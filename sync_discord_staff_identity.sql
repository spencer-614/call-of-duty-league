-- Link an existing staff role to the authenticated Discord account using its
-- provider email and Discord ID recorded in staff_roles.notes.
CREATE OR REPLACE FUNCTION public.sync_my_discord_staff_identity()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
DECLARE
    auth_email TEXT;
    discord_id TEXT;
    auth_provider TEXT;
    auth_providers JSONB;
    auth_identities JSONB;
    matched_staff_id BIGINT;
    match_count INTEGER;
    updated_count INTEGER;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication is required.';
    END IF;

    SELECT
        LOWER(BTRIM(u.email)),
        u.raw_app_meta_data ->> 'provider',
        u.raw_app_meta_data -> 'providers',
        u.identities,
        COALESCE(
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'provider_id'), ''),
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
        )
    INTO auth_email, auth_provider, auth_providers, auth_identities, discord_id
    FROM auth.users AS u
    WHERE u.id = auth.uid()
      AND u.email_confirmed_at IS NOT NULL;

    IF NOT FOUND OR auth_email IS NULL OR auth_email = '' THEN
        RETURN FALSE;
    END IF;

    IF auth_provider IS DISTINCT FROM 'discord'
       AND NOT COALESCE(auth_providers ? 'discord', FALSE)
       AND NOT EXISTS (
           SELECT 1
           FROM JSONB_ARRAY_ELEMENTS(COALESCE(auth_identities, '[]'::JSONB)) AS identities(discord_identity)
           WHERE discord_identity ->> 'provider' = 'discord'
       ) THEN
        RETURN FALSE;
    END IF;

    IF discord_id IS NOT NULL AND discord_id !~ '^[0-9]{5,25}$' THEN
        discord_id := NULL;
    END IF;

    IF discord_id IS NOT NULL THEN
        SELECT COUNT(*)
        INTO match_count
        FROM public.staff_roles AS staff
        WHERE staff.notes ~* (
            '(^|[^0-9])DiscordID:[[:space:]]*' ||
            discord_id ||
            '([^0-9]|$)'
        );

        IF match_count = 1 THEN
            SELECT staff.id
            INTO matched_staff_id
            FROM public.staff_roles AS staff
            WHERE staff.notes ~* (
                '(^|[^0-9])DiscordID:[[:space:]]*' ||
                discord_id ||
                '([^0-9]|$)'
            )
            LIMIT 1;

            IF EXISTS (
                SELECT 1
                FROM public.staff_roles AS staff
                WHERE LOWER(BTRIM(staff.email)) = auth_email
                  AND staff.id <> matched_staff_id
            ) THEN
                RETURN FALSE;
            END IF;

            UPDATE public.staff_roles
            SET email = auth_email,
                user_id = auth.uid(),
                updated_at = NOW()
            WHERE id = matched_staff_id;

            GET DIAGNOSTICS updated_count = ROW_COUNT;
            RETURN updated_count = 1;
        ELSIF match_count > 1 THEN
            RETURN FALSE;
        END IF;
    END IF;

    SELECT COUNT(*)
    INTO match_count
    FROM public.staff_roles AS staff
    WHERE LOWER(BTRIM(staff.email)) = auth_email
      AND (staff.user_id IS NULL OR staff.user_id = auth.uid());

    IF match_count <> 1 THEN
        RETURN FALSE;
    END IF;

    UPDATE public.staff_roles
    SET user_id = auth.uid(),
        updated_at = NOW()
    WHERE LOWER(BTRIM(email)) = auth_email
      AND (user_id IS NULL OR user_id = auth.uid());

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count = 1;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_my_discord_staff_identity() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_my_discord_staff_identity() TO authenticated;
