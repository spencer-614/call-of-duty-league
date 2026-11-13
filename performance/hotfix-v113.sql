-- Run this file in Supabase SQL Editor, then publish v1.13 files.
BEGIN;
-- SECURITY INVOKER preserves the existing caller's table permissions and RLS.
CREATE OR REPLACE FUNCTION public.fcl_tournament_summaries() RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER SET search_path=public,pg_temp AS $$
DECLARE registry jsonb; registrations jsonb; extras jsonb:='{}'::jsonb;
 counts jsonb:='{}'::jsonb; result jsonb:='[]'::jsonb; row_data record;
 item jsonb; extra jsonb; entry jsonb; metadata_keys text[];
BEGIN
 SELECT status_text::jsonb INTO registry FROM league_settings WHERE id='tournaments_registry';
 SELECT status_text::jsonb INTO registrations FROM league_settings WHERE id='tournament_registrations_registry';
 metadata_keys:=ARRAY['circuit','cashapp_tag','paypal_handle','payment_instructions','has_entry_fee','entry_fee_amount','pinned','is_active','banner_fit','banner_url','rules_notes'];
 IF jsonb_typeof(registry)='array' THEN
  FOR entry IN SELECT value FROM jsonb_array_elements(registry) LOOP
   -- Keep first matching registry row, as in the previous loader.
   IF entry->>'id' IS NOT NULL AND NOT extras ? (entry->>'id') THEN
    extras:=extras || jsonb_build_object(entry->>'id',entry-'bracket_data'-'bracket'-'bracketData'-'switch_state');
   END IF;
  END LOOP;
 END IF;
 IF jsonb_typeof(registrations)='array' THEN
  SELECT coalesce(jsonb_object_agg(id,n),'{}'::jsonb) INTO counts
   FROM (SELECT value->>'tournament_id' AS id,count(*) AS n FROM jsonb_array_elements(registrations)
    WHERE value->>'tournament_id' IS NOT NULL GROUP BY 1) c;
 ELSE
  SELECT coalesce(jsonb_object_agg(id,n),'{}'::jsonb) INTO counts
   FROM (SELECT tournament_id::text AS id,count(*) AS n FROM tournament_registrations GROUP BY 1) c;
 END IF;
 FOR row_data IN SELECT t.id, to_jsonb(t)-'bracket_data'-'bracket'-'bracketData'-'switch_state' AS canonical,
  t.bracket_data IS NOT NULL AND t.bracket_data<>'null'::jsonb AS has_bracket
  FROM tournaments t ORDER BY t.start_date LOOP
  extra:=coalesce(extras->row_data.id::text,'{}'::jsonb);
  item:=extra || row_data.canonical;
  FOR entry IN SELECT to_jsonb(k) FROM unnest(metadata_keys) k LOOP
   IF extra ? (entry#>>'{}') THEN item:=item || jsonb_build_object(entry#>>'{}',extra->(entry#>>'{}')); END IF;
  END LOOP;
  item:=item || jsonb_build_object('registered_teams',coalesce((counts->>row_data.id::text)::integer,0),
   'teams_registered_count',coalesce((counts->>row_data.id::text)::integer,0),'has_bracket',row_data.has_bracket);
  result:=result || jsonb_build_array(item);
 END LOOP;
 RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.fcl_tournament_summaries() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fcl_tournament_summaries() TO anon,authenticated;

-- Reuse the existing permission-filtered full reader only when a revision changes.
CREATE OR REPLACE FUNCTION public.fcl_switch_poll(p_id text,p_revision integer) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE current_revision integer;
BEGIN
 SELECT revision INTO current_revision FROM fcl_switch_sessions WHERE id=p_id OR tournament_id=p_id LIMIT 1;
 IF NOT FOUND THEN RETURN NULL; END IF;
 IF current_revision=p_revision THEN
  RETURN jsonb_build_object('unchanged',true,'revision',current_revision,'server_now',clock_timestamp());
 END IF;
 RETURN fcl_switch_read(p_id);
END $$;
CREATE OR REPLACE FUNCTION public.fcl_switch_summary(p_id text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE s fcl_switch_sessions; prices jsonb;
BEGIN
 SELECT * INTO s FROM fcl_switch_sessions WHERE id=p_id OR tournament_id=p_id LIMIT 1;
 IF NOT FOUND THEN RETURN NULL; END IF;
 prices:=jsonb_build_object('entry',fcl_switch_price(s.id,'entry'),'reroll',fcl_switch_price(s.id,'reroll'),
 'lock',fcl_switch_price(s.id,'lock'),'unlock',fcl_switch_price(s.id,'unlock'),'nuke',fcl_switch_price(s.id,'nuke'));
 RETURN jsonb_build_object('id',s.id,'practice',s.practice,'state',jsonb_build_object(
 'phase',s.state->'phase','bracket_generated',s.state->'bracket_generated','blowup_count',s.state->'blowup_count','prices',prices));
END $$;
REVOKE ALL ON FUNCTION public.fcl_switch_poll(text,integer),public.fcl_switch_summary(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fcl_switch_poll(text,integer),public.fcl_switch_summary(text) TO anon,authenticated;


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
NOTIFY pgrst, 'reload schema';
