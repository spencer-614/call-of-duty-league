-- Repair only the Test Switch shown in the diagnostic result.
-- Copy keys supported by the existing table; leave unspecified columns at defaults.
-- Existing main-table rows, registrations and brackets are not overwritten.
BEGIN;
DO $$
DECLARE event jsonb; columns_sql text; values_sql text;
BEGIN
 SELECT value INTO event
 FROM jsonb_array_elements((SELECT status_text::jsonb FROM public.league_settings WHERE id='tournaments_registry'))
 WHERE value->>'id'='tourney-1794526354031';
 IF event IS NULL THEN RAISE EXCEPTION 'Test Switch is no longer in the registry; no changes made.'; END IF;
 IF lower(coalesce(event->>'format','')) NOT LIKE '%duo%' THEN RAISE EXCEPTION 'The stored format is not Duo Switch; no changes made.'; END IF;
 SELECT string_agg(format('%I',a.attname),', ' ORDER BY a.attnum),
        string_agg(format('(jsonb_populate_record(NULL::public.tournaments, $1)).%I',a.attname),', ' ORDER BY a.attnum)
 INTO columns_sql,values_sql
 FROM pg_attribute a
 WHERE a.attrelid='public.tournaments'::regclass AND a.attnum>0 AND NOT a.attisdropped
   AND a.attgenerated='' AND a.attidentity='' AND event ? a.attname;
 IF columns_sql IS NULL THEN RAISE EXCEPTION 'No compatible tournament columns found.'; END IF;
 EXECUTE format('INSERT INTO public.tournaments (%s) SELECT %s ON CONFLICT (id) DO NOTHING',columns_sql,values_sql) USING event;
END $$;
COMMIT;
SELECT id,title,format FROM public.tournaments WHERE id::text='tourney-1794526354031';
