BEGIN;
-- Keep the deployed RPC's ownership, coin, turn and revision checks. The source
-- archive does not contain its definition, so do not replace those checks blindly.
-- Abort without changes if the deployed signature differs from the client contract.
DO $$ BEGIN
 IF to_regprocedure('public.tournament_veto_action_legacy_mw4(text,text,text,integer,integer,text)') IS NULL THEN
  IF to_regprocedure('public.tournament_veto_action(text,text,text,integer,integer,text)') IS NULL THEN
   RAISE EXCEPTION 'Expected tournament_veto_action(text,text,text,integer,integer,text) was not found. No changes applied. Export the deployed function definition before updating.';
  END IF;
  ALTER FUNCTION public.tournament_veto_action(text,text,text,integer,integer,text) RENAME TO tournament_veto_action_legacy_mw4;
 END IF;
END $$;
CREATE OR REPLACE FUNCTION public.tournament_mw4_map_pool(p_game integer) RETURNS jsonb
LANGUAGE sql IMMUTABLE SET search_path=public,pg_temp AS $$
 SELECT coalesce(jsonb_agg(jsonb_build_object('name',map_name) ORDER BY position),'[]'::jsonb)
 FROM unnest(CASE WHEN p_game IN (1,4) THEN ARRAY['Lithium','Lotus','Munition','Reactor U92','Rooftops','Sentry']
 WHEN p_game IN (2,5) THEN ARRAY['Coal','Lotus','Munition','Reactor U92','Rooftops','Silkworm']
 WHEN p_game=3 THEN ARRAY['Lithium','Lotus','Munition'] ELSE ARRAY[]::text[] END) WITH ORDINALITY AS maps(map_name,position);
$$;
CREATE OR REPLACE FUNCTION public.tournament_mw4_series() RETURNS jsonb
LANGUAGE sql IMMUTABLE SET search_path=public,pg_temp AS $$
 SELECT jsonb_agg(jsonb_build_object('game',n,'mode',CASE WHEN n IN(1,4) THEN 'Hardpoint' WHEN n IN(2,5) THEN 'Search and Destroy' ELSE 'Hijacked' END,
 'map',NULL,'status','pending','pool',tournament_mw4_map_pool(n),'struckBy','[]'::jsonb) ORDER BY n) FROM generate_series(1,5) n;
$$;
CREATE OR REPLACE FUNCTION public.tournament_veto_action(p_tournament text,p_match text,p_action text,p_version integer,p_game integer DEFAULT NULL,p_map text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE s jsonb; prior_state jsonb; g jsonb; m jsonb;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in to veto maps.'; END IF;
 IF p_action IS NULL OR p_action NOT IN('coin','reset','strike') THEN RAISE EXCEPTION 'Unsupported veto action.'; END IF;
 -- Serialize the wrapper as well as the original RPC, including first-use coin flips.
 PERFORM pg_advisory_xact_lock(hashtextextended('mw4-veto:'||p_tournament||':'||p_match,0));
 SELECT state INTO prior_state FROM tournament_veto_states WHERE tournament_id=p_tournament AND match_id=p_match FOR UPDATE;
 IF p_action='strike' THEN
  IF prior_state->>'ruleset' IS DISTINCT FROM 'mw4-20261112' THEN RAISE EXCEPTION 'This saved veto uses older map pools. Ask an administrator to reset it for MW4.'; END IF;
  IF p_game IS NULL OR p_game NOT BETWEEN 1 AND 5 OR p_map IS NULL OR NOT EXISTS(SELECT 1 FROM jsonb_array_elements(tournament_mw4_map_pool(p_game)) x WHERE x->>'name'=p_map) THEN
   RAISE EXCEPTION 'That map is not in the MW4 pool for this mode.';
  END IF;
 END IF;
 -- Never skip these existing authorization / reporter / turn / version checks.
 s:=public.tournament_veto_action_legacy_mw4(p_tournament,p_match,p_action,p_version,p_game,p_map);
 IF s IS NULL OR jsonb_typeof(s->'series') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Unexpected response from the existing veto function; no changes committed.'; END IF;
 IF p_action IN('coin','reset') THEN
  -- Only replace untouched initial state. An in-progress match changes rules only
  -- through the deployed RPC's authorized reset action, never through a page load.
  IF coalesce((s->>'vetoStep')::integer,0)<>0 OR EXISTS(SELECT 1 FROM jsonb_array_elements(s->'series') x WHERE x->>'status'='decided' OR jsonb_array_length(coalesce(x->'struckBy','[]'::jsonb))>0) THEN
   RAISE EXCEPTION 'The existing veto function did not return an untouched series; no changes committed.';
  END IF;
  s:=jsonb_set(s,'{series}',tournament_mw4_series());
  s:=s||jsonb_build_object('ruleset','mw4-20261112');
 ELSE
  -- Reject legacy hard-coded maps if the original RPC attempts to restore them.
  IF jsonb_array_length(s->'series')<>5 THEN RAISE EXCEPTION 'Invalid MW4 best-of-five series.'; END IF;
  FOR g IN SELECT value FROM jsonb_array_elements(s->'series') LOOP
   IF (g->>'game')::integer NOT BETWEEN 1 AND 5 THEN RAISE EXCEPTION 'Invalid MW4 game number.'; END IF;
   FOR m IN SELECT value FROM jsonb_array_elements(g->'pool') LOOP
    IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(tournament_mw4_map_pool((g->>'game')::integer)) x WHERE x->>'name'=m->>'name') THEN RAISE EXCEPTION 'The deployed veto function restored an obsolete map; no changes committed.'; END IF;
   END LOOP;
   IF g->'map' IS NOT NULL AND g->'map'<>'null'::jsonb AND NOT EXISTS(SELECT 1 FROM jsonb_array_elements(tournament_mw4_map_pool((g->>'game')::integer)) x WHERE x->>'name'=g->'map'->>'name') THEN RAISE EXCEPTION 'The deployed veto function selected an obsolete map; no changes committed.'; END IF;
  END LOOP;
  -- Some existing implementations rebuild state objects. Retain the ruleset tag.
  s:=s||jsonb_build_object('ruleset','mw4-20261112');
 END IF;
 UPDATE tournament_veto_states SET state=s WHERE tournament_id=p_tournament AND match_id=p_match;
 IF NOT FOUND THEN RAISE EXCEPTION 'The deployed veto function did not save the expected match row; no changes committed.'; END IF;
 RETURN s;
END $$;
-- The original function is private to the wrapper; clients cannot bypass the pools.
REVOKE INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER ON public.tournament_veto_states FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.tournament_veto_action_legacy_mw4(text,text,text,integer,integer,text) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.tournament_veto_action(text,text,text,integer,integer,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.tournament_veto_action(text,text,text,integer,integer,text) TO authenticated;
REVOKE ALL ON FUNCTION public.tournament_mw4_series(),public.tournament_mw4_map_pool(integer) FROM PUBLIC,anon,authenticated;
COMMIT;
