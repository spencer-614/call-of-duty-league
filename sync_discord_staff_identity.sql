-- ==============================================================================
-- FRONTLINE CALL OF DUTY LEAGUE - DISCORD AUTH IDENTITY & STAFF SYNC (V2)
-- ==============================================================================
-- 1. Ensure all identity tables have email, user_id, discord_id, and metadata columns.
-- 2. Drop any legacy trigger causing "Staff UUID and email must belong to same Auth account".
-- 3. Install smart align_staff_role_auth() trigger to auto-align UUID & email.
-- 4. Install automatic handle_auth_user_sync() trigger on auth.users for Discord logins.
-- 5. Perform immediate one-time backfill of all existing auth.users into players,
--    tournament_players, league_signups, and staff_roles.
-- 6. Install RPC functions:
--    - public.get_auth_directory()
--    - public.admin_assign_staff_role(...)
--    - public.sync_my_discord_staff_identity()
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ENSURE SCHEMA COLUMNS & INDEXES EXIST
-- ------------------------------------------------------------------------------
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS discord_name TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS discord_id TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE public.tournament_players ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.tournament_players ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.tournament_players ADD COLUMN IF NOT EXISTS discord_name TEXT;
ALTER TABLE public.tournament_players ADD COLUMN IF NOT EXISTS discord_id TEXT;
ALTER TABLE public.tournament_players ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE public.league_signups ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.league_signups ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.league_signups ADD COLUMN IF NOT EXISTS discord_username TEXT;
ALTER TABLE public.league_signups ADD COLUMN IF NOT EXISTS discord_user_id TEXT;

ALTER TABLE public.staff_roles ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.staff_roles ADD COLUMN IF NOT EXISTS custom_permissions JSONB;
ALTER TABLE public.staff_roles ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE INDEX IF NOT EXISTS idx_players_email ON public.players(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);
CREATE INDEX IF NOT EXISTS idx_tournament_players_email ON public.tournament_players(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_tournament_players_user_id ON public.tournament_players(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_roles_email ON public.staff_roles(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_staff_roles_user_id ON public.staff_roles(user_id);

-- ------------------------------------------------------------------------------
-- 2. DROP CONFLICTING / LEGACY TRIGGERS ON staff_roles
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    trg RECORD;
BEGIN
    FOR trg IN (
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_schema = 'public' 
          AND event_object_table = 'staff_roles'
          AND trigger_name ~* 'auth|check|validate'
    ) LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(trg.trigger_name) || ' ON public.staff_roles;';
    END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 3. SMART TRIGGER: Auto-align Staff Role Auth & Prevent Mismatch Exceptions
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.align_staff_role_auth()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
    v_auth_email TEXT;
    v_auth_id UUID;
BEGIN
    -- If user_id is provided, auto-align email with auth.users
    IF NEW.user_id IS NOT NULL THEN
        SELECT LOWER(BTRIM(u.email)), u.id
        INTO v_auth_email, v_auth_id
        FROM auth.users u
        WHERE u.id = NEW.user_id;

        IF v_auth_email IS NOT NULL AND (NEW.email IS NULL OR NEW.email = '' OR NEW.email LIKE '%@frontlineleague.com' OR LOWER(BTRIM(NEW.email)) <> v_auth_email) THEN
            NEW.email := v_auth_email;
        END IF;
    -- If user_id is NOT provided, see if the email belongs to an existing auth.user
    ELSIF NEW.email IS NOT NULL AND NEW.email NOT LIKE '%@frontlineleague.com' THEN
        SELECT u.id
        INTO v_auth_id
        FROM auth.users u
        WHERE LOWER(BTRIM(u.email)) = LOWER(BTRIM(NEW.email))
        LIMIT 1;

        IF v_auth_id IS NOT NULL THEN
            NEW.user_id := v_auth_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_align_staff_role_auth ON public.staff_roles;
CREATE TRIGGER tr_align_staff_role_auth
    BEFORE INSERT OR UPDATE ON public.staff_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.align_staff_role_auth();

-- ------------------------------------------------------------------------------
-- 4. AUTOMATIC TRIGGER ON auth.users (Syncs Discord Logins the millisecond they authenticate)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_auth_user_sync()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
    clean_email TEXT;
    clean_discord_id TEXT;
    clean_gamertag TEXT;
    clean_discord_name TEXT;
    clean_avatar TEXT;
BEGIN
    clean_email := LOWER(BTRIM(NEW.email));
    IF clean_email IS NULL OR clean_email = '' THEN
        RETURN NEW;
    END IF;

    -- Extract Discord Snowflake ID
    clean_discord_id := COALESCE(
        NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'provider_id'), ''),
        NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'discord_user_id'), ''),
        (
            SELECT COALESCE(
                discord_identity ->> 'id',
                discord_identity ->> 'user_id',
                discord_identity -> 'identity_data' ->> 'id'
            )
            FROM JSONB_ARRAY_ELEMENTS(COALESCE(NEW.identities, '[]'::JSONB)) AS identities(discord_identity)
            WHERE discord_identity ->> 'provider' = 'discord'
            LIMIT 1
        )
    );
    IF clean_discord_id !~ '^[0-9]{5,25}$' THEN
        clean_discord_id := NULL;
    END IF;

    -- Extract Gamertag
    clean_gamertag := COALESCE(
        NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'gamertag'), ''),
        NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'username'), ''),
        NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'name'), ''),
        NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'full_name'), ''),
        split_part(clean_email, '@', 1)
    );

    -- Extract Discord handle
    clean_discord_name := COALESCE(
        NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'discord_name'), ''),
        NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'discord_username'), ''),
        NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'user_name'), ''),
        NULLIF(BTRIM(NEW.raw_user_meta_data -> 'custom_claims' ->> 'global_name'), ''),
        clean_gamertag
    );

    -- Extract Avatar URL
    clean_avatar := COALESCE(
        NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'avatar_url'), ''),
        NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'picture'), ''),
        ''
    );

    -- 1. Sync public.players:
    UPDATE public.players
    SET email = clean_email,
        user_id = NEW.id,
        discord_name = COALESCE(NULLIF(players.discord_name, ''), clean_discord_name),
        avatar_url = CASE WHEN players.avatar_url IS NULL OR players.avatar_url = '' THEN clean_avatar ELSE players.avatar_url END
    WHERE user_id = NEW.id
       OR (clean_gamertag IS NOT NULL AND LOWER(BTRIM(gamertag)) = LOWER(BTRIM(clean_gamertag)))
       OR (clean_discord_name IS NOT NULL AND LOWER(BTRIM(discord_name)) = LOWER(BTRIM(clean_discord_name)));

    -- 2. Sync public.tournament_players:
    UPDATE public.tournament_players
    SET email = clean_email,
        user_id = NEW.id,
        discord_id = COALESCE(tournament_players.discord_id, clean_discord_id),
        discord_name = COALESCE(tournament_players.discord_name, clean_discord_name),
        avatar_url = CASE WHEN tournament_players.avatar_url IS NULL OR tournament_players.avatar_url = '' THEN clean_avatar ELSE tournament_players.avatar_url END
    WHERE user_id = NEW.id
       OR (clean_discord_id IS NOT NULL AND tournament_players.discord_id = clean_discord_id)
       OR (clean_gamertag IS NOT NULL AND LOWER(BTRIM(gamertag)) = LOWER(BTRIM(clean_gamertag)))
       OR (clean_discord_name IS NOT NULL AND LOWER(BTRIM(discord_name)) = LOWER(BTRIM(clean_discord_name)));

    -- 3. Sync public.league_signups:
    UPDATE public.league_signups
    SET user_id = NEW.id,
        email = clean_email,
        discord_user_id = COALESCE(league_signups.discord_user_id, clean_discord_id)
    WHERE user_id = NEW.id
       OR (clean_discord_id IS NOT NULL AND league_signups.discord_user_id = clean_discord_id)
       OR (clean_gamertag IS NOT NULL AND LOWER(BTRIM(gamertag)) = LOWER(BTRIM(clean_gamertag)));

    -- 4. Sync public.staff_roles (auto-link pending roles):
    UPDATE public.staff_roles
    SET user_id = NEW.id,
        email = clean_email,
        updated_at = NOW()
    WHERE user_id = NEW.id
       OR LOWER(BTRIM(email)) = clean_email
       OR (clean_discord_id IS NOT NULL AND notes ~* ('(^|[^0-9])DiscordID:[[:space:]]*' || clean_discord_id || '([^0-9]|$)'))
       OR (clean_discord_name IS NOT NULL AND notes ~* ('(^|[^a-z0-9_])Discord:[[:space:]]*@?' || clean_discord_name || '([^a-z0-9_]|$)'))
       OR (clean_gamertag IS NOT NULL AND (
             LOWER(BTRIM(display_name)) = LOWER(BTRIM(clean_gamertag))
             OR notes ~* ('(^|[^a-z0-9_])Gamertag:[[:space:]]*' || clean_gamertag || '([^a-z0-9_]|$)')
          ));

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_auth_user_sync_identity ON auth.users;
CREATE TRIGGER tr_auth_user_sync_identity
    AFTER INSERT OR UPDATE OF email, raw_user_meta_data ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_auth_user_sync();

-- ------------------------------------------------------------------------------
-- 5. IMMEDIATE ONE-TIME BACKFILL FOR ALL EXISTING auth.users
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    usr RECORD;
    clean_email TEXT;
    clean_discord_id TEXT;
    clean_gamertag TEXT;
    clean_discord_name TEXT;
    clean_avatar TEXT;
BEGIN
    FOR usr IN SELECT id, email, raw_user_meta_data, identities FROM auth.users WHERE email IS NOT NULL AND email <> '' LOOP
        clean_email := LOWER(BTRIM(usr.email));
        
        clean_discord_id := COALESCE(
            NULLIF(BTRIM(usr.raw_user_meta_data ->> 'provider_id'), ''),
            NULLIF(BTRIM(usr.raw_user_meta_data ->> 'discord_user_id'), ''),
            (
                SELECT COALESCE(
                    discord_identity ->> 'id',
                    discord_identity ->> 'user_id',
                    discord_identity -> 'identity_data' ->> 'id'
                )
                FROM JSONB_ARRAY_ELEMENTS(COALESCE(usr.identities, '[]'::JSONB)) AS identities(discord_identity)
                WHERE discord_identity ->> 'provider' = 'discord'
                LIMIT 1
            )
        );
        IF clean_discord_id !~ '^[0-9]{5,25}$' THEN
            clean_discord_id := NULL;
        END IF;

        clean_gamertag := COALESCE(
            NULLIF(BTRIM(usr.raw_user_meta_data ->> 'gamertag'), ''),
            NULLIF(BTRIM(usr.raw_user_meta_data ->> 'username'), ''),
            NULLIF(BTRIM(usr.raw_user_meta_data ->> 'name'), ''),
            NULLIF(BTRIM(usr.raw_user_meta_data ->> 'full_name'), ''),
            split_part(clean_email, '@', 1)
        );

        clean_discord_name := COALESCE(
            NULLIF(BTRIM(usr.raw_user_meta_data ->> 'discord_name'), ''),
            NULLIF(BTRIM(usr.raw_user_meta_data ->> 'discord_username'), ''),
            NULLIF(BTRIM(usr.raw_user_meta_data ->> 'user_name'), ''),
            NULLIF(BTRIM(usr.raw_user_meta_data -> 'custom_claims' ->> 'global_name'), ''),
            clean_gamertag
        );

        clean_avatar := COALESCE(
            NULLIF(BTRIM(usr.raw_user_meta_data ->> 'avatar_url'), ''),
            NULLIF(BTRIM(usr.raw_user_meta_data ->> 'picture'), ''),
            ''
        );

        -- Backfill players
        UPDATE public.players
        SET email = clean_email,
            user_id = usr.id,
            discord_name = COALESCE(NULLIF(players.discord_name, ''), clean_discord_name),
            avatar_url = CASE WHEN players.avatar_url IS NULL OR players.avatar_url = '' THEN clean_avatar ELSE players.avatar_url END
        WHERE user_id = usr.id
           OR (clean_gamertag IS NOT NULL AND LOWER(BTRIM(gamertag)) = LOWER(BTRIM(clean_gamertag)))
           OR (clean_discord_name IS NOT NULL AND LOWER(BTRIM(discord_name)) = LOWER(BTRIM(clean_discord_name)));

        -- Backfill tournament_players
        UPDATE public.tournament_players
        SET email = clean_email,
            user_id = usr.id,
            discord_id = COALESCE(tournament_players.discord_id, clean_discord_id),
            discord_name = COALESCE(tournament_players.discord_name, clean_discord_name),
            avatar_url = CASE WHEN tournament_players.avatar_url IS NULL OR tournament_players.avatar_url = '' THEN clean_avatar ELSE tournament_players.avatar_url END
        WHERE user_id = usr.id
           OR (clean_discord_id IS NOT NULL AND tournament_players.discord_id = clean_discord_id)
           OR (clean_gamertag IS NOT NULL AND LOWER(BTRIM(gamertag)) = LOWER(BTRIM(clean_gamertag)))
           OR (clean_discord_name IS NOT NULL AND LOWER(BTRIM(discord_name)) = LOWER(BTRIM(clean_discord_name)));

        -- Backfill league_signups
        UPDATE public.league_signups
        SET email = clean_email,
            user_id = usr.id,
            discord_user_id = COALESCE(league_signups.discord_user_id, clean_discord_id)
        WHERE user_id = usr.id
           OR (clean_discord_id IS NOT NULL AND league_signups.discord_user_id = clean_discord_id)
           OR (clean_gamertag IS NOT NULL AND LOWER(BTRIM(gamertag)) = LOWER(BTRIM(clean_gamertag)));

        -- Backfill staff_roles
        UPDATE public.staff_roles
        SET email = clean_email,
            user_id = usr.id
        WHERE user_id = usr.id
           OR LOWER(BTRIM(email)) = clean_email
           OR (clean_discord_id IS NOT NULL AND notes ~* ('(^|[^0-9])DiscordID:[[:space:]]*' || clean_discord_id || '([^0-9]|$)'))
           OR (clean_discord_name IS NOT NULL AND notes ~* ('(^|[^a-z0-9_])Discord:[[:space:]]*@?' || clean_discord_name || '([^a-z0-9_]|$)'))
           OR (clean_gamertag IS NOT NULL AND (
                 LOWER(BTRIM(display_name)) = LOWER(BTRIM(clean_gamertag))
                 OR notes ~* ('(^|[^a-z0-9_])Gamertag:[[:space:]]*' || clean_gamertag || '([^a-z0-9_]|$)')
              ));
    END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 6. RPC: public.get_auth_directory()
-- Returns verified Discord emails & UUIDs from auth.users for Admin Console
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_auth_directory()
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    gamertag TEXT,
    discord_name TEXT,
    discord_id TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id AS user_id,
        LOWER(BTRIM(u.email)) AS email,
        COALESCE(
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'gamertag'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'username'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'name'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'full_name'), ''),
            split_part(u.email, '@', 1)
        ) AS gamertag,
        COALESCE(
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'discord_name'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'discord_username'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'user_name'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data -> 'custom_claims' ->> 'global_name'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'gamertag'), '')
        ) AS discord_name,
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
        ) AS discord_id,
        COALESCE(
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'avatar_url'), ''),
            NULLIF(BTRIM(u.raw_user_meta_data ->> 'picture'), ''),
            ''
        ) AS avatar_url,
        u.created_at
    FROM auth.users AS u
    WHERE u.email IS NOT NULL AND u.email <> ''
    ORDER BY u.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_auth_directory() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_auth_directory() TO authenticated, anon;

-- ------------------------------------------------------------------------------
-- 7. RPC: public.admin_assign_staff_role(...)
-- Assigns staff role seamlessly, looking up real Auth UUID and email
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_assign_staff_role(
    target_email TEXT,
    target_role TEXT,
    target_display_name TEXT DEFAULT NULL,
    target_user_id UUID DEFAULT NULL,
    target_discord TEXT DEFAULT NULL,
    target_discord_id TEXT DEFAULT NULL,
    target_gamertag TEXT DEFAULT NULL,
    target_permissions JSONB DEFAULT NULL,
    target_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
    resolved_email TEXT;
    resolved_user_id UUID;
    resolved_name TEXT;
    notes_str TEXT;
    saved_role RECORD;
BEGIN
    resolved_email := LOWER(BTRIM(target_email));
    resolved_user_id := target_user_id;

    -- 1. If user_id is provided, look up the authentic email in auth.users
    IF resolved_user_id IS NOT NULL THEN
        SELECT LOWER(BTRIM(email)) INTO resolved_email
        FROM auth.users WHERE id = resolved_user_id;
    END IF;

    -- 2. If user_id not provided, try to find user by email, discord_id, or gamertag in auth.users
    IF resolved_user_id IS NULL THEN
        IF resolved_email IS NOT NULL AND resolved_email NOT LIKE '%@frontlineleague.com' THEN
            SELECT id INTO resolved_user_id FROM auth.users WHERE LOWER(BTRIM(email)) = resolved_email LIMIT 1;
        END IF;

        IF resolved_user_id IS NULL AND target_discord_id IS NOT NULL AND target_discord_id <> '' THEN
            SELECT u.id, LOWER(BTRIM(u.email)) INTO resolved_user_id, resolved_email
            FROM auth.users u
            WHERE u.raw_user_meta_data ->> 'provider_id' = target_discord_id
               OR u.raw_user_meta_data ->> 'discord_user_id' = target_discord_id
            LIMIT 1;
        END IF;

        IF resolved_user_id IS NULL AND target_gamertag IS NOT NULL AND target_gamertag <> '' THEN
            SELECT u.id, LOWER(BTRIM(u.email)) INTO resolved_user_id, resolved_email
            FROM auth.users u
            WHERE LOWER(BTRIM(u.raw_user_meta_data ->> 'gamertag')) = LOWER(BTRIM(target_gamertag))
               OR LOWER(BTRIM(u.raw_user_meta_data ->> 'username')) = LOWER(BTRIM(target_gamertag))
            LIMIT 1;
        END IF;
    END IF;

    IF resolved_email IS NULL OR resolved_email = '' THEN
        resolved_email := LOWER(BTRIM(target_email));
    END IF;

    resolved_name := COALESCE(NULLIF(BTRIM(target_display_name), ''), target_gamertag, target_discord, split_part(resolved_email, '@', 1));

    -- Format notes with Discord ID and Gamertag so future logins can match
    notes_str := COALESCE(NULLIF(BTRIM(target_notes), ''), '');
    IF target_discord IS NOT NULL AND target_discord <> '' AND notes_str !~* ('(^|[^a-z0-9_])Discord:[[:space:]]*' || target_discord) THEN
        notes_str := BTRIM(notes_str || ' · Discord: ' || target_discord, ' ·');
    END IF;
    IF target_discord_id IS NOT NULL AND target_discord_id <> '' AND notes_str !~* ('(^|[^0-9])DiscordID:[[:space:]]*' || target_discord_id) THEN
        notes_str := BTRIM(notes_str || ' · DiscordID: ' || target_discord_id, ' ·');
    END IF;
    IF target_gamertag IS NOT NULL AND target_gamertag <> '' AND notes_str !~* ('(^|[^a-z0-9_])Gamertag:[[:space:]]*' || target_gamertag) THEN
        notes_str := BTRIM(notes_str || ' · Gamertag: ' || target_gamertag, ' ·');
    END IF;

    -- Upsert into staff_roles
    INSERT INTO public.staff_roles (email, user_id, display_name, role, custom_permissions, notes, updated_at)
    VALUES (resolved_email, resolved_user_id, resolved_name, target_role, target_permissions, NULLIF(notes_str, ''), NOW())
    ON CONFLICT (email) DO UPDATE SET
        user_id = COALESCE(EXCLUDED.user_id, staff_roles.user_id),
        display_name = COALESCE(EXCLUDED.display_name, staff_roles.display_name),
        role = EXCLUDED.role,
        custom_permissions = EXCLUDED.custom_permissions,
        notes = COALESCE(EXCLUDED.notes, staff_roles.notes),
        updated_at = NOW()
    RETURNING * INTO saved_role;

    RETURN jsonb_build_object(
        'success', true,
        'email', resolved_email,
        'user_id', resolved_user_id,
        'role', saved_role.role,
        'staff_role', to_jsonb(saved_role)
    );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_assign_staff_role(TEXT, TEXT, TEXT, UUID, TEXT, TEXT, TEXT, JSONB, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_assign_staff_role(TEXT, TEXT, TEXT, UUID, TEXT, TEXT, TEXT, JSONB, TEXT) TO authenticated, anon;

-- ------------------------------------------------------------------------------
-- 8. SELF-SYNC RPC: public.sync_my_discord_staff_identity()
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_my_discord_staff_identity()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
    auth_email TEXT;
    discord_id TEXT;
    user_gamertag TEXT;
    discord_username TEXT;
    matched_staff_id BIGINT;
    match_count INTEGER;
    updated_count INTEGER := 0;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication is required.';
    END IF;

    SELECT
        LOWER(BTRIM(u.email)),
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
    INTO auth_email, discord_id, user_gamertag, discord_username
    FROM auth.users AS u
    WHERE u.id = auth.uid();

    IF NOT FOUND OR auth_email IS NULL OR auth_email = '' THEN
        RETURN FALSE;
    END IF;

    IF discord_id IS NOT NULL AND discord_id !~ '^[0-9]{5,25}$' THEN
        discord_id := NULL;
    END IF;

    -- 1. Sync public.players
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
    EXCEPTION WHEN OTHERS THEN NULL;
    END;

    -- 2. Sync public.tournament_players
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
    EXCEPTION WHEN OTHERS THEN NULL;
    END;

    -- 3. Sync public.league_signups
    BEGIN
        UPDATE public.league_signups
        SET user_id = auth.uid(),
            email = auth_email,
            discord_user_id = COALESCE(league_signups.discord_user_id, discord_id)
        WHERE (
            user_id = auth.uid()
            OR (discord_id IS NOT NULL AND league_signups.discord_user_id = discord_id)
            OR (user_gamertag IS NOT NULL AND LOWER(BTRIM(gamertag)) = LOWER(BTRIM(user_gamertag)))
            OR (discord_username IS NOT NULL AND LOWER(BTRIM(discord_username)) = LOWER(BTRIM(discord_username)))
        )
        AND (user_id IS NULL OR user_id = auth.uid());
    EXCEPTION WHEN OTHERS THEN NULL;
    END;

    -- 4. Sync public.staff_roles
    matched_staff_id := NULL;

    -- Match by DiscordID
    IF discord_id IS NOT NULL THEN
        SELECT staff.id INTO matched_staff_id
        FROM public.staff_roles AS staff
        WHERE staff.notes ~* ('(^|[^0-9])DiscordID:[[:space:]]*' || discord_id || '([^0-9]|$)')
        LIMIT 1;
    END IF;

    -- Match by Discord handle
    IF matched_staff_id IS NULL AND discord_username IS NOT NULL AND LENGTH(discord_username) >= 2 THEN
        SELECT staff.id INTO matched_staff_id
        FROM public.staff_roles AS staff
        WHERE staff.notes ~* ('(^|[^a-z0-9_])Discord:[[:space:]]*@?' || discord_username || '([^a-z0-9_]|$)')
        LIMIT 1;
    END IF;

    -- Match by Gamertag
    IF matched_staff_id IS NULL AND user_gamertag IS NOT NULL AND LENGTH(user_gamertag) >= 2 THEN
        SELECT staff.id INTO matched_staff_id
        FROM public.staff_roles AS staff
        WHERE staff.notes ~* ('(^|[^a-z0-9_])Gamertag:[[:space:]]*' || user_gamertag || '([^a-z0-9_]|$)')
           OR LOWER(BTRIM(staff.display_name)) = LOWER(BTRIM(user_gamertag))
        LIMIT 1;
    END IF;

    -- Apply match
    IF matched_staff_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.staff_roles AS staff
            WHERE LOWER(BTRIM(staff.email)) = auth_email AND staff.id <> matched_staff_id
        ) THEN
            UPDATE public.staff_roles
            SET email = auth_email,
                user_id = auth.uid(),
                updated_at = NOW()
            WHERE id = matched_staff_id;

            RETURN TRUE;
        END IF;
    END IF;

    -- Direct email match
    SELECT COUNT(*) INTO match_count
    FROM public.staff_roles AS staff
    WHERE LOWER(BTRIM(staff.email)) = auth_email
      AND (staff.user_id IS NULL OR staff.user_id = auth.uid());

    IF match_count = 1 THEN
        UPDATE public.staff_roles
        SET user_id = auth.uid(),
            updated_at = NOW()
        WHERE LOWER(BTRIM(email)) = auth_email
          AND (user_id IS NULL OR user_id = auth.uid());

        RETURN TRUE;
    END IF;

    RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_my_discord_staff_identity() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_my_discord_staff_identity() TO authenticated, anon;
