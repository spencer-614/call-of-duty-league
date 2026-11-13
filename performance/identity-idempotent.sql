BEGIN;
CREATE OR REPLACE FUNCTION public.sync_my_discord_staff_identity()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
    v_auth_email TEXT;
    v_discord_id TEXT;
    v_user_gamertag TEXT;
    v_discord_username TEXT;
    matched_staff_id BIGINT;
    match_count INTEGER;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication is required.';
    END IF;

    SELECT
        LOWER(BTRIM(u.email)),
        COALESCE(
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'provider_id'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'discord_user_id'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'sub'), '')
        ),
        COALESCE(
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'gamertag'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'username'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'name'), '')
        ),
        COALESCE(
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'discord_name'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'discord_username'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'user_name'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data -> 'custom_claims' ->> 'global_name'), '')
        )
    INTO v_auth_email, v_discord_id, v_user_gamertag, v_discord_username
    FROM auth.users AS u
    WHERE u.id = auth.uid();

    IF NOT FOUND OR v_auth_email IS NULL OR v_auth_email = '' THEN
        RETURN FALSE;
    END IF;

    IF v_discord_id IS NOT NULL AND v_discord_id !~ '^[0-9]{5,25}$' THEN
        v_discord_id := NULL;
    END IF;

    -- 1. Sync public.players
    BEGIN
        UPDATE public.players
        SET email = v_auth_email,
            user_id = auth.uid()
        WHERE (
            user_id = auth.uid()
            OR (v_user_gamertag IS NOT NULL AND LOWER(BTRIM(gamertag)) = LOWER(BTRIM(v_user_gamertag)))
            OR (v_discord_username IS NOT NULL AND LOWER(BTRIM(discord_name)) = LOWER(BTRIM(v_discord_username)))
        )
        AND (user_id IS NULL OR user_id = auth.uid())
        AND (players.email, players.user_id) IS DISTINCT FROM (v_auth_email, auth.uid());
    EXCEPTION WHEN OTHERS THEN NULL;
    END;

    -- 2. Sync public.tournament_players
    BEGIN
        UPDATE public.tournament_players
        SET email = v_auth_email,
            user_id = auth.uid(),
            discord_id = COALESCE(tournament_players.discord_id, v_discord_id)
        WHERE (
            user_id = auth.uid()
            OR (v_discord_id IS NOT NULL AND tournament_players.discord_id = v_discord_id)
            OR (v_user_gamertag IS NOT NULL AND LOWER(BTRIM(gamertag)) = LOWER(BTRIM(v_user_gamertag)))
            OR (v_discord_username IS NOT NULL AND LOWER(BTRIM(discord_name)) = LOWER(BTRIM(v_discord_username)))
        )
        AND (user_id IS NULL OR user_id = auth.uid())
        AND (tournament_players.email, tournament_players.user_id, tournament_players.discord_id) IS DISTINCT FROM (v_auth_email, auth.uid(), COALESCE(tournament_players.discord_id, v_discord_id));
    EXCEPTION WHEN OTHERS THEN NULL;
    END;

    -- 3. Sync public.league_signups
    BEGIN
        UPDATE public.league_signups
        SET user_id = auth.uid(),
            email = v_auth_email,
            discord_user_id = COALESCE(league_signups.discord_user_id, v_discord_id)
        WHERE (
            user_id = auth.uid()
            OR (v_discord_id IS NOT NULL AND league_signups.discord_user_id = v_discord_id)
            OR (v_user_gamertag IS NOT NULL AND LOWER(BTRIM(gamertag)) = LOWER(BTRIM(v_user_gamertag)))
            OR (v_discord_username IS NOT NULL AND LOWER(BTRIM(league_signups.discord_username)) = LOWER(BTRIM(v_discord_username)))
        )
        AND (user_id IS NULL OR user_id = auth.uid())
        AND (league_signups.email, league_signups.user_id, league_signups.discord_user_id) IS DISTINCT FROM (v_auth_email, auth.uid(), COALESCE(league_signups.discord_user_id, v_discord_id));
    EXCEPTION WHEN OTHERS THEN NULL;
    END;

    -- 4. Sync public.staff_roles
    matched_staff_id := NULL;

    -- Match by DiscordID
    IF v_discord_id IS NOT NULL THEN
        SELECT staff.id INTO matched_staff_id
        FROM public.staff_roles AS staff
        WHERE staff.notes ~* ('(^|[^0-9])DiscordID:[[:space:]]*' || v_discord_id || '([^0-9]|$)')
        LIMIT 1;
    END IF;

    -- Match by Discord handle
    IF matched_staff_id IS NULL AND v_discord_username IS NOT NULL AND LENGTH(v_discord_username) >= 2 THEN
        SELECT staff.id INTO matched_staff_id
        FROM public.staff_roles AS staff
        WHERE staff.notes ~* ('(^|[^a-z0-9_])Discord:[[:space:]]*@?' || v_discord_username || '([^a-z0-9_]|$)')
        LIMIT 1;
    END IF;

    -- Match by Gamertag
    IF matched_staff_id IS NULL AND v_user_gamertag IS NOT NULL AND LENGTH(v_user_gamertag) >= 2 THEN
        SELECT staff.id INTO matched_staff_id
        FROM public.staff_roles AS staff
        WHERE staff.notes ~* ('(^|[^a-z0-9_])Gamertag:[[:space:]]*' || v_user_gamertag || '([^a-z0-9_]|$)')
           OR LOWER(BTRIM(staff.display_name)) = LOWER(BTRIM(v_user_gamertag))
        LIMIT 1;
    END IF;

    -- Apply match
    IF matched_staff_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.staff_roles AS staff
            WHERE LOWER(BTRIM(staff.email)) = v_auth_email AND staff.id <> matched_staff_id
        ) THEN
            UPDATE public.staff_roles
            SET email = v_auth_email,
                user_id = auth.uid(),
                updated_at = NOW()
            WHERE id = matched_staff_id
              AND (staff_roles.email, staff_roles.user_id) IS DISTINCT FROM (v_auth_email, auth.uid());

            RETURN TRUE;
        END IF;
    END IF;

    -- Direct email match
    SELECT COUNT(*) INTO match_count
    FROM public.staff_roles AS staff
    WHERE LOWER(BTRIM(staff.email)) = v_auth_email
      AND (staff.user_id IS NULL OR staff.user_id = auth.uid());

    IF match_count = 1 THEN
        UPDATE public.staff_roles
        SET user_id = auth.uid(),
            updated_at = NOW()
        WHERE LOWER(BTRIM(email)) = v_auth_email
          AND (user_id IS NULL OR user_id = auth.uid())
          AND user_id IS DISTINCT FROM auth.uid();

        RETURN TRUE;
    END IF;

    RETURN TRUE;
END;
$$;

COMMIT;
