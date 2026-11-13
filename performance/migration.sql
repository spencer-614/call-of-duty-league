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
COMMIT;
NOTIFY pgrst, 'reload schema';
