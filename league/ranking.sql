BEGIN;
CREATE TABLE IF NOT EXISTS public.fcl_rankings (
 season_id bigint REFERENCES public.fcl_seasons NOT NULL,
 user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
 rank_value integer NOT NULL CHECK(rank_value BETWEEN 1 AND 9),
 updated_at timestamptz NOT NULL DEFAULT now(), updated_by uuid REFERENCES auth.users,
 PRIMARY KEY(season_id,user_id)
);
CREATE TABLE IF NOT EXISTS public.fcl_ranking_requests (
 id uuid PRIMARY KEY,season_id bigint NOT NULL REFERENCES public.fcl_seasons,
 user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
 kind text NOT NULL CHECK(kind IN ('placement','rerank')),
 answers jsonb NOT NULL,account_image text,rank_image text,
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','denied')),
 created_at timestamptz NOT NULL DEFAULT now(),reviewed_at timestamptz,
 reviewed_by uuid REFERENCES auth.users,review_note text,previous_rank integer,assigned_rank integer,
 CHECK(kind<>'placement' OR account_image IS NOT NULL)
);
CREATE UNIQUE INDEX IF NOT EXISTS fcl_ranking_one_pending ON public.fcl_ranking_requests(season_id,user_id) WHERE status='pending';
CREATE TABLE IF NOT EXISTS public.fcl_ranking_history (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 season_id bigint NOT NULL REFERENCES public.fcl_seasons,user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
 request_id uuid REFERENCES public.fcl_ranking_requests,old_rank integer,new_rank integer NOT NULL,
 actor_id uuid NOT NULL REFERENCES auth.users,note text NOT NULL DEFAULT '',created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.fcl_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fcl_ranking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fcl_ranking_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.fcl_rankings,public.fcl_ranking_requests,public.fcl_ranking_history FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.fcl_ranking_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public,pg_temp AS $$
 SELECT EXISTS(SELECT 1 FROM public.staff_roles WHERE user_id=auth.uid() AND lower(role) IN ('founder','founders','commissioner','admin','administrator','staff'));
$$;
REVOKE ALL ON FUNCTION public.fcl_ranking_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fcl_ranking_admin() TO anon,authenticated;

CREATE OR REPLACE FUNCTION public.fcl_my_ranking() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE sid bigint; sname text;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in to request your season rank'; END IF;
 SELECT id,name INTO sid,sname FROM public.fcl_seasons WHERE status='active' ORDER BY id DESC LIMIT 1;
 RETURN jsonb_build_object('season_id',sid,'season_name',sname,
 'ranked',EXISTS(SELECT 1 FROM public.fcl_rankings WHERE season_id=sid AND user_id=auth.uid()),
 'requests',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',r.id,'kind',r.kind,'status',r.status,'created_at',r.created_at,'reviewed_at',r.reviewed_at) ORDER BY r.created_at DESC)
 FROM public.fcl_ranking_requests r WHERE r.season_id=sid AND r.user_id=auth.uid()),'[]'::jsonb));
END $$;

CREATE OR REPLACE FUNCTION public.fcl_submit_ranking(request_id uuid,request_kind text,form_answers jsonb,account_path text DEFAULT NULL,rank_path text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE uid uuid:=auth.uid(); sid bigint; ranked boolean; field text; path text;
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'Sign in first'; END IF;
 SELECT id INTO sid FROM public.fcl_seasons WHERE status='active' ORDER BY id DESC LIMIT 1 FOR SHARE;
 IF sid IS NULL THEN RAISE EXCEPTION 'Ranking requests open when staff create an active season'; END IF;
 -- Serialize submissions and reviews for this account/season, including races.
 PERFORM pg_advisory_xact_lock(hashtextextended(uid::text||':'||sid,0));
 IF EXISTS(SELECT 1 FROM public.fcl_ranking_requests WHERE id=request_id AND user_id=uid) THEN RETURN jsonb_build_object('submitted',true); END IF;
 IF EXISTS(SELECT 1 FROM public.fcl_ranking_requests WHERE season_id=sid AND user_id=uid AND status='pending') THEN RAISE EXCEPTION 'You already have a pending request'; END IF;
 SELECT EXISTS(SELECT 1 FROM public.fcl_rankings WHERE season_id=sid AND user_id=uid) INTO ranked;
 IF request_kind NOT IN ('placement','rerank') OR request_kind IS NULL THEN RAISE EXCEPTION 'Invalid request type'; END IF;
 IF ranked AND request_kind='placement' THEN RAISE EXCEPTION 'You have already been ranked. Request a re-rank instead'; END IF;
 IF NOT ranked AND request_kind='rerank' THEN RAISE EXCEPTION 'Request your placement rank first'; END IF;
 IF jsonb_typeof(form_answers) IS DISTINCT FROM 'object' OR octet_length(form_answers::text)>18000 THEN RAISE EXCEPTION 'Invalid form answers'; END IF;
 FOREACH field IN ARRAY CASE WHEN request_kind='placement' THEN ARRAY['peak_rank','average_rank','other_leagues','self_placement'] ELSE ARRAY['requested_rank','reason'] END LOOP
  IF jsonb_typeof(form_answers->field) IS DISTINCT FROM 'string' OR length(btrim(form_answers->>field)) NOT BETWEEN 1 AND 3000 THEN RAISE EXCEPTION 'Complete all required answers (maximum 3000 characters each)'; END IF;
 END LOOP;
 IF (request_kind='placement' AND form_answers-ARRAY['peak_rank','average_rank','other_leagues','self_placement']<>'{}'::jsonb) OR
 (request_kind='rerank' AND form_answers-ARRAY['requested_rank','reason']<>'{}'::jsonb) THEN RAISE EXCEPTION 'Unexpected form fields'; END IF;
 IF request_kind='placement' AND account_path IS NULL THEN RAISE EXCEPTION 'Upload the account screenshot with your Activision ID visible'; END IF;
 IF request_kind='rerank' AND (account_path IS NOT NULL OR rank_path IS NOT NULL) THEN RAISE EXCEPTION 'Re-rank requests do not require uploads'; END IF;
 FOREACH path IN ARRAY ARRAY[account_path,rank_path] LOOP
  IF path IS NOT NULL AND (path NOT LIKE uid::text||'/'||request_id::text||'/%' OR NOT EXISTS(
   SELECT 1 FROM storage.objects o WHERE o.bucket_id='ranking-evidence' AND o.name=path
    AND o.metadata->>'mimetype' IN ('image/png','image/jpeg','image/webp')
  )) THEN RAISE EXCEPTION 'Screenshot upload was not found for your request'; END IF;
 END LOOP;
 INSERT INTO public.fcl_ranking_requests(id,season_id,user_id,kind,answers,account_image,rank_image)
 VALUES(request_id,sid,uid,request_kind,form_answers,account_path,rank_path);
 RETURN jsonb_build_object('submitted',true);
END $$;

CREATE OR REPLACE FUNCTION public.fcl_ranking_queue(status_filter text DEFAULT 'pending',search_text text DEFAULT '',page_number integer DEFAULT 0) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE result jsonb;
BEGIN
 IF NOT public.fcl_ranking_admin() THEN RAISE EXCEPTION 'Website staff account required'; END IF;
 IF status_filter NOT IN ('pending','accepted','denied','all') OR page_number NOT BETWEEN 0 AND 100000 THEN RAISE EXCEPTION 'Invalid filter'; END IF;
 SELECT COALESCE(jsonb_agg(to_jsonb(t)),'[]'::jsonb) INTO result FROM (
 SELECT r.id,r.user_id,r.kind,r.status,r.created_at,s.name AS season_name,
 COALESCE((SELECT p.gamertag FROM public.players p WHERE p.user_id=r.user_id ORDER BY p.id LIMIT 1),u.email,'Player') AS player_name
 FROM public.fcl_ranking_requests r JOIN public.fcl_seasons s ON s.id=r.season_id JOIN auth.users u ON u.id=r.user_id
 WHERE (status_filter='all' OR r.status=status_filter) AND
 (COALESCE(u.email,'') ILIKE '%'||left(search_text,100)||'%' OR EXISTS(SELECT 1 FROM public.players p WHERE p.user_id=r.user_id AND p.gamertag ILIKE '%'||left(search_text,100)||'%'))
 ORDER BY r.created_at DESC,r.id LIMIT 51 OFFSET page_number*50
 ) t;
 RETURN result;
END $$;

CREATE OR REPLACE FUNCTION public.fcl_ranking_profile(target_user uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
BEGIN
 IF NOT public.fcl_ranking_admin() THEN RAISE EXCEPTION 'Website staff account required'; END IF;
 RETURN jsonb_build_object('user_id',target_user,
 'name',COALESCE((SELECT gamertag FROM public.players WHERE user_id=target_user ORDER BY id LIMIT 1),(SELECT email FROM auth.users WHERE id=target_user)),
 'rankings',COALESCE((SELECT jsonb_agg(to_jsonb(x)) FROM (SELECT r.*,s.name AS season_name FROM public.fcl_rankings r JOIN public.fcl_seasons s ON s.id=r.season_id WHERE user_id=target_user ORDER BY s.id DESC)x),'[]'::jsonb),
 'requests',COALESCE((SELECT jsonb_agg(to_jsonb(x)) FROM (SELECT r.*,s.name AS season_name FROM public.fcl_ranking_requests r JOIN public.fcl_seasons s ON s.id=r.season_id WHERE user_id=target_user ORDER BY created_at DESC LIMIT 100)x),'[]'::jsonb),
 'history',COALESCE((SELECT jsonb_agg(to_jsonb(x)) FROM (SELECT * FROM public.fcl_ranking_history WHERE user_id=target_user ORDER BY created_at DESC LIMIT 100)x),'[]'::jsonb));
END $$;

CREATE OR REPLACE FUNCTION public.fcl_review_ranking(target_request uuid,decision text,new_rank integer DEFAULT NULL,staff_note text DEFAULT '') RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE r public.fcl_ranking_requests; prev integer;
BEGIN
 IF NOT public.fcl_ranking_admin() THEN RAISE EXCEPTION 'Website staff account required'; END IF;
 SELECT * INTO r FROM public.fcl_ranking_requests WHERE id=target_request;
 IF NOT FOUND THEN RAISE EXCEPTION 'Request not found'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(r.user_id::text||':'||r.season_id,0));
 SELECT * INTO r FROM public.fcl_ranking_requests WHERE id=target_request FOR UPDATE;
 IF r.status<>'pending' THEN RAISE EXCEPTION 'Another reviewer already decided this request. Refresh the profile'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.fcl_seasons WHERE id=r.season_id AND status='active' FOR SHARE) THEN RAISE EXCEPTION 'This season is archived'; END IF;
 IF decision IS NULL OR decision NOT IN ('accepted','denied') THEN RAISE EXCEPTION 'Choose accept or deny'; END IF;
 IF length(staff_note)>3000 THEN RAISE EXCEPTION 'Staff note is too long'; END IF;
 SELECT rank_value INTO prev FROM public.fcl_rankings WHERE season_id=r.season_id AND user_id=r.user_id;
 IF decision='accepted' THEN
  IF new_rank IS NULL OR new_rank NOT BETWEEN 1 AND 9 THEN RAISE EXCEPTION 'Assign a rank from 1 to 9'; END IF;
  IF r.kind='rerank' AND prev IS NULL THEN RAISE EXCEPTION 'Placement is missing; refresh the profile'; END IF;
  INSERT INTO public.fcl_rankings(season_id,user_id,rank_value,updated_by) VALUES(r.season_id,r.user_id,new_rank,auth.uid())
  ON CONFLICT(season_id,user_id) DO UPDATE SET rank_value=excluded.rank_value,updated_by=excluded.updated_by,updated_at=now();
  INSERT INTO public.fcl_ranking_history(season_id,user_id,request_id,old_rank,new_rank,actor_id,note)
  VALUES(r.season_id,r.user_id,r.id,prev,new_rank,auth.uid(),staff_note);
 END IF;
 UPDATE public.fcl_ranking_requests SET status=decision,reviewed_at=now(),reviewed_by=auth.uid(),review_note=staff_note,previous_rank=prev,assigned_rank=CASE WHEN decision='accepted' THEN new_rank END WHERE id=r.id;
 RETURN jsonb_build_object('reviewed',true);
END $$;

-- Import a placement already decided outside this new workflow, by exact account.
CREATE OR REPLACE FUNCTION public.fcl_record_existing_rank(target_user uuid,new_rank integer,staff_note text DEFAULT '') RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE sid bigint; prev integer;
BEGIN
 IF NOT public.fcl_ranking_admin() THEN RAISE EXCEPTION 'Website staff account required'; END IF;
 SELECT id INTO sid FROM public.fcl_seasons WHERE status='active' ORDER BY id DESC LIMIT 1 FOR SHARE;
 IF sid IS NULL THEN RAISE EXCEPTION 'Create an active season first'; END IF;
 IF new_rank IS NULL OR new_rank NOT BETWEEN 1 AND 9 OR length(staff_note)>3000 THEN RAISE EXCEPTION 'Enter a rank from 1 to 9 and a short note'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.players WHERE user_id=target_user) THEN RAISE EXCEPTION 'No registered player belongs to that account'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(target_user::text||':'||sid,0));
 IF EXISTS(SELECT 1 FROM public.fcl_ranking_requests WHERE user_id=target_user AND season_id=sid AND status='pending') THEN RAISE EXCEPTION 'Review the pending request instead'; END IF;
 SELECT rank_value INTO prev FROM public.fcl_rankings WHERE season_id=sid AND user_id=target_user;
 INSERT INTO public.fcl_rankings(season_id,user_id,rank_value,updated_by) VALUES(sid,target_user,new_rank,auth.uid())
 ON CONFLICT(season_id,user_id) DO UPDATE SET rank_value=excluded.rank_value,updated_by=excluded.updated_by,updated_at=now();
 INSERT INTO public.fcl_ranking_history(season_id,user_id,old_rank,new_rank,actor_id,note) VALUES(sid,target_user,prev,new_rank,auth.uid(),staff_note);
 RETURN jsonb_build_object('saved',true);
END $$;

DO $$ DECLARE sig text; BEGIN
 FOREACH sig IN ARRAY ARRAY['fcl_my_ranking()','fcl_submit_ranking(uuid,text,jsonb,text,text)','fcl_ranking_queue(text,text,integer)','fcl_ranking_profile(uuid)','fcl_review_ranking(uuid,text,integer,text)','fcl_record_existing_rank(uuid,integer,text)'] LOOP
 EXECUTE 'REVOKE ALL ON FUNCTION public.'||sig||' FROM PUBLIC,anon';
 EXECUTE 'GRANT EXECUTE ON FUNCTION public.'||sig||' TO authenticated';
 END LOOP;
END $$;

INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('ranking-evidence','ranking-evidence',false,8388608,ARRAY['image/png','image/jpeg','image/webp'])
ON CONFLICT(id) DO UPDATE SET public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
CREATE OR REPLACE FUNCTION public.fcl_ranking_upload_allowed(object_name text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public,pg_temp AS $$
 SELECT auth.uid() IS NOT NULL AND split_part(object_name,'/',1)=auth.uid()::text
 AND object_name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}\.(png|jpg|webp)$'
 AND NOT EXISTS(SELECT 1 FROM public.fcl_ranking_requests r WHERE r.id::text=split_part(object_name,'/',2));
$$;
REVOKE ALL ON FUNCTION public.fcl_ranking_upload_allowed(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fcl_ranking_upload_allowed(text) TO anon,authenticated;
DROP POLICY IF EXISTS fcl_ranking_upload ON storage.objects;
CREATE POLICY fcl_ranking_upload ON storage.objects FOR INSERT TO authenticated WITH CHECK(
 bucket_id='ranking-evidence' AND public.fcl_ranking_upload_allowed(name));
-- Restrictive guards protect this bucket even when older broad storage policies exist.
DROP POLICY IF EXISTS fcl_ranking_insert_guard ON storage.objects;
CREATE POLICY fcl_ranking_insert_guard ON storage.objects AS RESTRICTIVE FOR INSERT TO anon,authenticated WITH CHECK(
 bucket_id<>'ranking-evidence' OR public.fcl_ranking_upload_allowed(name));
DROP POLICY IF EXISTS fcl_ranking_read ON storage.objects;
CREATE POLICY fcl_ranking_read ON storage.objects FOR SELECT TO authenticated USING(bucket_id='ranking-evidence' AND public.fcl_ranking_admin());
DROP POLICY IF EXISTS fcl_ranking_read_guard ON storage.objects;
CREATE POLICY fcl_ranking_read_guard ON storage.objects AS RESTRICTIVE FOR SELECT TO anon,authenticated USING(bucket_id<>'ranking-evidence' OR public.fcl_ranking_admin());
DROP POLICY IF EXISTS fcl_ranking_update_guard ON storage.objects;
CREATE POLICY fcl_ranking_update_guard ON storage.objects AS RESTRICTIVE FOR UPDATE TO anon,authenticated USING(bucket_id<>'ranking-evidence') WITH CHECK(bucket_id<>'ranking-evidence');
DROP POLICY IF EXISTS fcl_ranking_delete_guard ON storage.objects;
CREATE POLICY fcl_ranking_delete_guard ON storage.objects AS RESTRICTIVE FOR DELETE TO anon,authenticated USING(bucket_id<>'ranking-evidence');
COMMIT;
