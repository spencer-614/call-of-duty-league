BEGIN;
-- SECURITY INVOKER preserves the existing caller's table permissions and RLS.
CREATE OR REPLACE FUNCTION public.fcl_tournament_summaries() RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER SET search_path=public,pg_temp AS $$
DECLARE registry jsonb; registrations jsonb; result jsonb;
BEGIN
 SELECT status_text::jsonb INTO registry FROM league_settings WHERE id='tournaments_registry';
 SELECT status_text::jsonb INTO registrations FROM league_settings WHERE id='tournament_registrations_registry';
 WITH rows AS (
  SELECT t.id, to_jsonb(t) AS canonical,
   coalesce((SELECT x FROM jsonb_array_elements(coalesce(registry,'[]'::jsonb)) x WHERE x->>'id'=t.id::text LIMIT 1),'{}'::jsonb) AS extra
  FROM tournaments t
 ), merged AS (
  SELECT id, extra || canonical || coalesce((SELECT jsonb_object_agg(k,extra->k)
   FROM unnest(ARRAY['circuit','cashapp_tag','paypal_handle','payment_instructions','has_entry_fee','entry_fee_amount','pinned','is_active','banner_fit','banner_url','rules_notes']) k
   WHERE extra ? k),'{}'::jsonb) AS item FROM rows
 ), counted AS (
  SELECT item || jsonb_build_object(
   'registered_teams', CASE WHEN jsonb_typeof(registrations)='array' THEN
    (SELECT count(*) FROM jsonb_array_elements(registrations) r WHERE r->>'tournament_id'=id::text)
    ELSE (SELECT count(*) FROM tournament_registrations r WHERE r.tournament_id::text=id::text) END,
   'has_bracket', item->'bracket_data' IS NOT NULL AND item->'bracket_data'<>'null'::jsonb
  ) AS item FROM merged
 ) SELECT coalesce(jsonb_agg(item - 'bracket_data' - 'bracket' - 'bracketData' - 'switch_state' ORDER BY item->>'start_date'),'[]'::jsonb) INTO result FROM counted;
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
COMMIT;
NOTIFY pgrst, 'reload schema';
