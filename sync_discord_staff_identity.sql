-- ==============================================================================
-- FRONTLINE CALL OF DUTY LEAGUE - DISCORD AUTH IDENTITY & STAFF SYNC
-- ==============================================================================
-- 1. Ensure all identity tables have email and user_id columns.
-- 2. Synchronize an authenticated Discord user's real auth email and UUID across:
--    - public.players
--    - public.tournament_players
--    - public.league_signups
--    - public.staff_roles (linking by DiscordID, Discord handle, Gamertag, or email)
-- ==============================================================================

-- Ensure columns exist across public schema
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.tournament_players ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.league_signups ADD COLUMN IF NOT EXISTS email TEXT;

CREATE INDEX IF NOT EXISTS idx_players_email ON public.players(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_tournament_players_email ON public.tournament_players(LOWER(email));

-- ==============================================================================
-- FUNCTION: public.sync_my_discord_staff_identity()
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.sync_my_discord_staff_identity()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    auth_email TEXT;
    discord_id TEXT;
    user_gamertag TEXT;
    discord_username TEXT;
    auth_provider TEXT;
    auth_providers JSONB;
    auth_identities JSONB;
    matched_staff_id BIGINT;
    match_count INTEGER;
    updated_count INTEGER := 0;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication is required.';
    END IF;

    -- Extract verified auth credentials and Discord metadata for current user
    SELECT
        LOWER(BTRIM(u.email)),
        u.raw_app_meta_data ->> 'provider',
        u.raw_app_meta_data -> 'providers',
        u.identities,
        COALESCE(
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'provider_id'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'discord_user_id'), ''),
            (
                SELECT COALESCE(
                    discord_identity ->> 'id',
                    discord_identity ->> 'user_id',
                    discord_identity -> 'identity_data' ->> 'id'
                )
                FROM JSONB_ARRAY_ELEMENTS(COALESCE(u.identities, '[]'::JSONB)) AS identities(discord_identity)
                WHERE discord_identity ->> 'provider' = 'discord'
                LIMIT 1
            )
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
    INTO auth_email, auth_provider, auth_providers, auth_identities, discord_id, user_gamertag, discord_username
    FROM auth.users AS u
    WHERE u.id = auth.uid();

    IF NOT FOUND OR auth_email IS NULL OR auth_email = '' THEN
        RETURN FALSE;
    END IF;

    -- Clean snowflake ID
    IF discord_id IS NOT NULL AND discord_id !~ '^[0-9]{5,25}$' THEN
        discord_id := NULL;
    END IF;

    -- 1. Sync public.players table (link user_id and verified auth_email)
    BEGIN
        UPDATE public.players
        SET email = auth_email,
            user_id = auth.uid()
        WHERE (
            user_id = auth.uid()
            OR (user_gamertag IS NOT NULL AND LOWER(BTRIM(gamertag)) = LOWER(BTRIM(user_gamertag)))
            OR (discord_username IS NOT NULL AND LOWER(BTRIM(discord_name)) = LOWER(BTRIM(discord_username)))
        )
        AND (user_id IS NULL OR user_id = auth.uid());
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    -- 2. Sync public.tournament_players table
    BEGIN
        UPDATE public.tournament_players
        SET email = auth_email,
            user_id = auth.uid(),
            discord_id = COALESCE(tournament_players.discord_id, discord_id)
        WHERE (
            user_id = auth.uid()
            OR (discord_id IS NOT NULL AND tournament_players.discord_id = discord_id)
            OR (user_gamertag IS NOT NULL AND LOWER(BTRIM(gamertag)) = LOWER(BTRIM(user_gamertag)))
            OR (discord_username IS NOT NULL AND LOWER(BTRIM(discord_name)) = LOWER(BTRIM(discord_username)))
        )
        AND (user_id IS NULL OR user_id = auth.uid());
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    -- 3. Sync public.league_signups table
    BEGIN
        UPDATE public.league_signups
        SET user_id = auth.uid(),
            discord_user_id = COALESCE(league_signups.discord_user_id, discord_id)
        WHERE (
            user_id = auth.uid()
            OR (discord_id IS NOT NULL AND league_signups.discord_user_id = discord_id)
            OR (user_gamertag IS NOT NULL AND LOWER(BTRIM(gamertag)) = LOWER(BTRIM(user_gamertag)))
            OR (discord_username IS NOT NULL AND LOWER(BTRIM(discord_username)) = LOWER(BTRIM(discord_username)))
        )
        AND (user_id IS NULL OR user_id = auth.uid());
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    -- 4. Sync public.staff_roles (match by DiscordID, Discord handle, Gamertag, or email)
    matched_staff_id := NULL;

    -- A. Match by DiscordID in notes
    IF discord_id IS NOT NULL THEN
        SELECT staff.id
        INTO matched_staff_id
        FROM public.staff_roles AS staff
        WHERE staff.notes ~* (
            '(^|[^0-9])DiscordID:[[:space:]]*' ||
            discord_id ||
            '([^0-9]|$)'
        )
        LIMIT 1;
    END IF;

    -- B. Match by Discord handle in notes
    IF matched_staff_id IS NULL AND discord_username IS NOT NULL AND LENGTH(discord_username) >= 2 THEN
        SELECT staff.id
        INTO matched_staff_id
        FROM public.staff_roles AS staff
        WHERE staff.notes ~* (
            '(^|[^a-z0-9_])Discord:[[:space:]]*@?' ||
            discord_username ||
            '([^a-z0-9_]|$)'
        )
        LIMIT 1;
    END IF;

    -- C. Match by Gamertag in notes or display_name
    IF matched_staff_id IS NULL AND user_gamertag IS NOT NULL AND LENGTH(user_gamertag) >= 2 THEN
        SELECT staff.id
        INTO matched_staff_id
        FROM public.staff_roles AS staff
        WHERE staff.notes ~* (
            '(^|[^a-z0-9_])Gamertag:[[:space:]]*' ||
            user_gamertag ||
            '([^a-z0-9_]|$)'
        )
        OR LOWER(BTRIM(staff.display_name)) = LOWER(BTRIM(user_gamertag))
        LIMIT 1;
    END IF;

    -- Apply match if found
    IF matched_staff_id IS NOT NULL THEN
        -- Verify no email collision with a different staff member
        IF NOT EXISTS (
            SELECT 1
            FROM public.staff_roles AS staff
            WHERE LOWER(BTRIM(staff.email)) = auth_email
              AND staff.id <> matched_staff_id
        ) THEN
            UPDATE public.staff_roles
            SET email = auth_email,
                user_id = auth.uid(),
                updated_at = NOW()
            WHERE id = matched_staff_id;

            GET DIAGNOSTICS updated_count = ROW_COUNT;
            IF updated_count = 1 THEN
                RETURN TRUE;
            END IF;
        END IF;
    END IF;

    -- D. Match by direct email
    SELECT COUNT(*)
    INTO match_count
    FROM public.staff_roles AS staff
    WHERE LOWER(BTRIM(staff.email)) = auth_email
      AND (staff.user_id IS NULL OR staff.user_id = auth.uid());

    IF match_count = 1 THEN
        UPDATE public.staff_roles
        SET user_id = auth.uid(),
            updated_at = NOW()
        WHERE LOWER(BTRIM(email)) = auth_email
          AND (user_id IS NULL OR user_id = auth.uid());

        GET DIAGNOSTICS updated_count = ROW_COUNT;
        RETURN updated_count = 1;
    END IF;

    RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_my_discord_staff_identity() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_my_discord_staff_identity() TO authenticated;
