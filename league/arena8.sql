BEGIN;
CREATE TABLE IF NOT EXISTS public.fcl_arena_bridge(
 guild_id text PRIMARY KEY,state jsonb NOT NULL DEFAULT '{}'::jsonb,private_state jsonb,
 updated_at timestamptz,worker_id uuid,lease_until timestamptz
);
CREATE TABLE IF NOT EXISTS public.fcl_arena_actions(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),guild_id text NOT NULL REFERENCES public.fcl_arena_bridge,
 user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,discord_id text NOT NULL,channel_id text NOT NULL,
 action text NOT NULL CHECK(action IN ('join','leave')),status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','done','error')),
 result text,created_at timestamptz NOT NULL DEFAULT now(),finished_at timestamptz
);
CREATE INDEX IF NOT EXISTS fcl_arena_actions_queue ON public.fcl_arena_actions(guild_id,status,created_at);
ALTER TABLE public.fcl_arena_bridge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fcl_arena_actions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.fcl_arena_bridge,public.fcl_arena_actions FROM PUBLIC,anon,authenticated;
CREATE OR REPLACE FUNCTION public.fcl_arena_state() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE did text; b public.fcl_arena_bridge;
BEGIN
 SELECT * INTO b FROM public.fcl_arena_bridge ORDER BY updated_at DESC NULLS LAST LIMIT 1;
 SELECT COALESCE(provider_id,identity_data->>'sub',identity_data->>'id') INTO did FROM auth.identities WHERE user_id=auth.uid() AND provider='discord' LIMIT 1;
 RETURN jsonb_build_object('state',COALESCE(b.state,'{}'::jsonb),'updated_at',b.updated_at,
 'online',COALESCE(b.updated_at>now()-interval '35 seconds' AND b.lease_until>now(),false),'discord_id',did,
 'actions',COALESCE((SELECT jsonb_agg(to_jsonb(x)) FROM (SELECT id,action,status,result,created_at FROM public.fcl_arena_actions WHERE user_id=auth.uid() ORDER BY created_at DESC LIMIT 5)x),'[]'::jsonb));
END $$;
CREATE OR REPLACE FUNCTION public.fcl_arena_action(channel text,requested_action text) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE did text; b public.fcl_arena_bridge; rid uuid;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in and link Discord first'; END IF;
 IF requested_action IS NULL OR requested_action NOT IN ('join','leave') THEN RAISE EXCEPTION 'Invalid queue action'; END IF;
 SELECT COALESCE(provider_id,identity_data->>'sub',identity_data->>'id') INTO did FROM auth.identities WHERE user_id=auth.uid() AND provider='discord' LIMIT 1;
 IF did IS NULL OR did !~ '^[0-9]{15,22}$' THEN RAISE EXCEPTION 'Link your Discord account through the website first'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(did,0));
 SELECT * INTO b FROM public.fcl_arena_bridge ORDER BY updated_at DESC NULLS LAST LIMIT 1;
 IF b.updated_at IS NULL OR b.updated_at<now()-interval '35 seconds' OR b.lease_until<now() THEN RAISE EXCEPTION 'Arena bot is offline. Try again when it reconnects'; END IF;
 IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(COALESCE(b.state->'queues','[]')) q WHERE q->>'channelId'=channel) THEN RAISE EXCEPTION 'Queue not found'; END IF;
 UPDATE public.fcl_arena_actions SET status='error',result='Request expired; please try again.',finished_at=now() WHERE discord_id=did AND status='pending' AND created_at<now()-interval '2 minutes';
 IF EXISTS(SELECT 1 FROM public.fcl_arena_actions WHERE discord_id=did AND status='pending') THEN RAISE EXCEPTION 'Your previous queue action is still pending'; END IF;
 IF EXISTS(SELECT 1 FROM public.fcl_arena_actions WHERE discord_id=did AND created_at>now()-interval '2 seconds') THEN RAISE EXCEPTION 'Please wait a moment before trying again'; END IF;
 INSERT INTO public.fcl_arena_actions(guild_id,user_id,discord_id,channel_id,action) VALUES(b.guild_id,auth.uid(),did,channel,requested_action) RETURNING id INTO rid;
 RETURN rid;
END $$;
REVOKE ALL ON FUNCTION public.fcl_arena_state() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fcl_arena_state() TO anon,authenticated;
REVOKE ALL ON FUNCTION public.fcl_arena_action(text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.fcl_arena_action(text,text) TO authenticated;
COMMIT;
