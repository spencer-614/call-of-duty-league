BEGIN;
-- Keep historical screenshot paths and all ownership/veto/consensus protections.
ALTER TABLE public.tournament_map_reports ALTER COLUMN screenshot DROP NOT NULL;
DO $$
DECLARE col smallint; c record;
BEGIN
 SELECT attnum INTO col FROM pg_attribute WHERE attrelid='public.tournament_map_reports'::regclass AND attname='screenshot';
 -- Remove only column-local screenshot validation; never remove mixed business rules.
 FOR c IN SELECT conname FROM pg_constraint
 WHERE conrelid='public.tournament_map_reports'::regclass AND contype='c' AND conkey=ARRAY[col] LOOP
  EXECUTE format('ALTER TABLE public.tournament_map_reports DROP CONSTRAINT %I',c.conname);
 END LOOP;
END $$;
NOTIFY pgrst, 'reload schema';
COMMIT;
