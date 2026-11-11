BEGIN;
-- Dedicated permissions: browser storage and public tournament rows are NOT trusted.
CREATE TABLE IF NOT EXISTS public.fcl_switch_operators(user_id uuid PRIMARY KEY REFERENCES auth.users(id));
ALTER TABLE public.fcl_switch_operators ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.fcl_switch_operators FROM anon, authenticated;
CREATE TABLE IF NOT EXISTS public.fcl_switch_sessions(
 id text PRIMARY KEY, tournament_id text UNIQUE, title text NOT NULL, practice boolean NOT NULL DEFAULT false,
 revision integer NOT NULL DEFAULT 0, state jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE TABLE IF NOT EXISTS public.fcl_switch_actions(
 operation_id uuid PRIMARY KEY, session_id text NOT NULL REFERENCES public.fcl_switch_sessions(id) ON DELETE CASCADE,
 actor uuid NOT NULL, action text NOT NULL, args jsonb NOT NULL, amount integer NOT NULL,
 method text, reference text, status text NOT NULL DEFAULT 'completed', error text, outcome jsonb, created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
ALTER TABLE public.fcl_switch_actions ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'completed';
ALTER TABLE public.fcl_switch_actions ADD COLUMN IF NOT EXISTS error text;
ALTER TABLE public.fcl_switch_actions ADD COLUMN IF NOT EXISTS outcome jsonb;
DROP INDEX IF EXISTS public.fcl_switch_payment_once;
CREATE UNIQUE INDEX fcl_switch_payment_once ON public.fcl_switch_actions(session_id,method,lower(reference)) WHERE reference IS NOT NULL AND status='completed';
ALTER TABLE public.fcl_switch_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fcl_switch_actions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.fcl_switch_sessions, public.fcl_switch_actions FROM anon, authenticated;
CREATE OR REPLACE FUNCTION public.fcl_switch_is_operator() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public,pg_temp AS $$
 SELECT auth.uid() IS NOT NULL AND EXISTS(SELECT 1 FROM fcl_switch_operators WHERE user_id=auth.uid());
$$;
CREATE OR REPLACE FUNCTION public.fcl_switch_team(a jsonb,b jsonb) RETURNS jsonb
LANGUAGE sql VOLATILE SET search_path=public,pg_temp AS $$
 SELECT jsonb_build_object('id','switch_'||gen_random_uuid()::text,'name',(a->>'team_name')||' & '||(b->>'team_name'),
 'tag','SWCH','duo1_id',a->>'id','duo2_id',b->>'id','duo1_name',a->>'team_name','duo2_name',b->>'team_name',
 'roster',(a->'roster')||(b->'roster'),'report_members',coalesce(a->'report_members','[]'::jsonb)||coalesce(b->'report_members','[]'::jsonb),
 'isDuoSwitch',true,'isLocked',false);
$$;
CREATE OR REPLACE FUNCTION public.fcl_switch_read(p_id text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE s fcl_switch_sessions; history jsonb;
BEGIN
 SELECT * INTO s FROM fcl_switch_sessions WHERE id=p_id OR tournament_id=p_id LIMIT 1;
 IF NOT FOUND THEN RETURN NULL; END IF;
 SELECT coalesce(jsonb_agg(item ORDER BY created_at DESC),'[]'::jsonb) INTO history FROM (
 SELECT created_at,jsonb_build_object('id',operation_id,'action',action,'status',status,'amount',amount,'created_at',created_at,
 'duo_id',args->>'duo_id','target_id',args->>'target_id','summary',outcome->'summary') ||
 CASE WHEN fcl_switch_is_operator() THEN jsonb_build_object('actor',actor,'method',method,'reference',reference,'note',args->>'note','error',error) ELSE '{}'::jsonb END AS item
 FROM fcl_switch_actions WHERE session_id=s.id ORDER BY created_at DESC LIMIT 100) h;
 RETURN jsonb_build_object('id',s.id,'tournament_id',s.tournament_id,'title',s.title,'practice',s.practice,'revision',s.revision,
 'state',s.state,'history',history,'server_now',clock_timestamp(),'can_admin',fcl_switch_is_operator());
END $$;
-- Reads authoritative registration registry first, matching the existing registration workflow.
CREATE OR REPLACE FUNCTION public.fcl_switch_registrations(p_tournament text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE regs jsonb; result jsonb; row_data jsonb;
BEGIN
 SELECT status_text::jsonb INTO regs FROM league_settings WHERE id='tournament_registrations_registry';
 SELECT coalesce(jsonb_agg(x),'[]'::jsonb) INTO result FROM jsonb_array_elements(coalesce(regs,'[]'::jsonb)) x WHERE x->>'tournament_id'=p_tournament;
 IF jsonb_array_length(result)=0 THEN
 SELECT coalesce(jsonb_agg(to_jsonb(r)),'[]'::jsonb) INTO result FROM tournament_registrations r WHERE r.tournament_id::text=p_tournament;
 END IF;
 RETURN result;
END $$;
CREATE OR REPLACE FUNCTION public.fcl_switch_create(p_tournament text DEFAULT NULL,p_practice boolean DEFAULT false) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE sid text; title_text text; regs jsonb; d jsonb; duos jsonb:='[]'; members jsonb; n integer;
BEGIN
 IF NOT fcl_switch_is_operator() THEN RAISE EXCEPTION 'Switch operator access required. Sign in with your authorized staff account.'; END IF;
 IF p_practice THEN
 sid:='practice_'||gen_random_uuid();title_text:='Switch practice';
 FOR n IN 1..8 LOOP
 duos:=duos||jsonb_build_array(jsonb_build_object('id','practice_duo_'||n,'team_name','Practice Duo '||n,
 'roster',jsonb_build_array('Player '||n||'A','Player '||n||'B'),'entry_verified',false,'report_members','[]'::jsonb)); END LOOP;
 ELSE
 SELECT id INTO sid FROM fcl_switch_sessions WHERE tournament_id=p_tournament;
 IF FOUND THEN RETURN fcl_switch_read(sid); END IF;
 SELECT title INTO title_text FROM tournaments WHERE id::text=p_tournament AND lower(format) LIKE '%duo%';
 IF title_text IS NULL THEN RAISE EXCEPTION 'A Duo Switch tournament is required.'; END IF;
 IF EXISTS(SELECT 1 FROM tournaments WHERE id::text=p_tournament AND jsonb_array_length(coalesce(bracket_data->'stages','[]'::jsonb))>0) THEN
 RAISE EXCEPTION 'This tournament already has a bracket. Use a fresh tournament or explicitly clear its unstarted bracket first.'; END IF;
 sid:='switch_'||gen_random_uuid();regs:=fcl_switch_registrations(p_tournament);
 FOR d IN SELECT value FROM jsonb_array_elements(regs) LOOP
 members:=coalesce(d->'roster','[]'::jsonb);
 IF jsonb_typeof(members)<>'array' THEN RAISE EXCEPTION 'Duo % has an invalid roster; fix registration first.',d->>'team_name'; END IF;
 duos:=duos||jsonb_build_array(jsonb_build_object('id',d->>'id','team_name',d->>'team_name','roster',members,
 'entry_verified',false,'report_members',coalesce(d->'report_members','[]'::jsonb),'registered_by',d->>'registered_by'));
 END LOOP;
 END IF;
 INSERT INTO fcl_switch_sessions(id,tournament_id,title,practice,state) VALUES(sid,CASE WHEN p_practice THEN NULL ELSE p_tournament END,title_text,p_practice,
 jsonb_build_object('version',2,'phase','registration','status','registration','enabled',true,'duos',duos,'teams','[]'::jsonb,
 'unpaired','[]'::jsonb,'active_spin',null,'last_spin',null,'bracket_generated',false,'blowup_count',0));
 RETURN fcl_switch_read(sid);
END $$;
CREATE OR REPLACE FUNCTION public.fcl_switch_command_core(p_id text,p_action text,p_args jsonb,p_operation uuid,p_revision integer) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE s fcl_switch_sessions; st jsonb; prior fcl_switch_actions; duos jsonb; teams jsonb; pool jsonb; a jsonb;b jsonb;c jsonb;d jsonb;t jsonb; other_t jsonb;
 result_teams jsonb; candidate jsonb; choices jsonb; spin jsonb; amount integer:=0; method_text text; ref_text text;
 buyer text:=p_args->>'duo_id'; target text:=p_args->>'target_id'; phase text; selected integer; roster_tags text[]; total integer; unique_total integer; before_teams jsonb; before_pool jsonb;
BEGIN
 IF NOT fcl_switch_is_operator() THEN RAISE EXCEPTION 'Switch operator access required.'; END IF;
 SELECT * INTO s FROM fcl_switch_sessions WHERE id=p_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Switch session not found.'; END IF;
 SELECT * INTO prior FROM fcl_switch_actions WHERE operation_id=p_operation;
 IF FOUND THEN
 IF prior.session_id<>p_id OR prior.action<>p_action OR prior.args<>p_args THEN RAISE EXCEPTION 'Operation ID already used for another action.'; END IF;
 RETURN fcl_switch_read(p_id); END IF;
 IF s.revision<>p_revision THEN RAISE EXCEPTION 'Another admin changed this session. Refresh and review before trying again.'; END IF;
 st:=s.state; phase:=st->>'phase';duos:=st->'duos';teams:=st->'teams';pool:=st->'unpaired';before_teams:=teams;before_pool:=pool;
 IF st->'active_spin' IS NOT NULL AND st->'active_spin'<>'null'::jsonb THEN
 IF (st->'active_spin'->>'ends_at')::timestamptz>clock_timestamp() THEN RAISE EXCEPTION 'A wheel spin is still running. Wait for its result.'; END IF;
 st:=st||jsonb_build_object('last_spin',st->'active_spin','active_spin',null);
 END IF;
 IF phase='finalized' AND NOT (s.practice AND p_action='reset') AND p_action NOT IN ('bracket_saved') THEN RAISE EXCEPTION 'The purchase window is closed. Squads are official.'; END IF;
 IF p_action='sync' THEN
 IF s.practice OR phase<>'registration' THEN RAISE EXCEPTION 'Registration refresh is only available before initial pairing.'; END IF;
 result_teams:='[]';
 FOR d IN SELECT value FROM jsonb_array_elements(fcl_switch_registrations(s.tournament_id)) LOOP
 SELECT value INTO a FROM jsonb_array_elements(duos) WHERE value->>'id'=d->>'id';
 result_teams:=result_teams||jsonb_build_array(jsonb_build_object('id',d->>'id','team_name',d->>'team_name','roster',coalesce(d->'roster','[]'::jsonb),
 'entry_verified',coalesce(a->'entry_verified','false'::jsonb),'registered_by',d->>'registered_by','report_members',coalesce(d->'report_members','[]'::jsonb)));
 END LOOP;duos:=result_teams;
 ELSIF p_action IN ('entry','reroll','lock','unlock','nuke') THEN
 SELECT value INTO a FROM jsonb_array_elements(duos) WHERE value->>'id'=buyer;
 IF a IS NULL THEN RAISE EXCEPTION 'Select the registered duo that purchased this action.'; END IF;
 IF p_action='entry' THEN
 IF phase<>'registration' THEN RAISE EXCEPTION 'Entry payments must be confirmed before pairing.'; END IF;
 IF (a->>'entry_verified')::boolean THEN RAISE EXCEPTION 'Entry payment already confirmed.'; END IF;amount:=5;
 ELSE
 IF phase<>'window' OR jsonb_array_length(pool)>0 THEN RAISE EXCEPTION 'Finish pairing all duos before accepting power-ups.'; END IF;
 IF NOT (a->>'entry_verified')::boolean THEN RAISE EXCEPTION 'Purchaser must have a verified entry.'; END IF;
 amount:=CASE p_action WHEN 'reroll' THEN 10 WHEN 'nuke' THEN 20 ELSE 15 END;
 END IF;
 method_text:=p_args->>'method';ref_text:=nullif(btrim(p_args->>'reference'),'');
 IF s.practice THEN method_text:='Practice';ref_text:=NULL;
 ELSIF method_text IS NULL OR method_text NOT IN ('Cash App','PayPal') OR p_args->>'payment_confirmed' IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Verify the external payment and select Cash App or PayPal.'; END IF;
 IF p_action='entry' THEN
 SELECT jsonb_agg(CASE WHEN value->>'id'=buyer THEN value||'{"entry_verified":true}'::jsonb ELSE value END) INTO duos FROM jsonb_array_elements(duos);
 ELSIF p_action IN ('lock','unlock') THEN
 IF p_action='lock' THEN SELECT value INTO t FROM jsonb_array_elements(teams) WHERE value->>'duo1_id'=buyer OR value->>'duo2_id'=buyer;
 ELSE SELECT value INTO t FROM jsonb_array_elements(teams) WHERE value->>'id'=target; END IF;
 IF t IS NULL THEN RAISE EXCEPTION 'Target squad not found.'; END IF;
 IF p_action='unlock' AND (t->>'duo1_id'=buyer OR t->>'duo2_id'=buyer) THEN RAISE EXCEPTION 'Unlock must target another squad.'; END IF;
 IF (t->>'isLocked')::boolean=(p_action='lock') THEN RAISE EXCEPTION 'Squad already has that lock status.'; END IF;
 SELECT jsonb_agg(CASE WHEN value->>'id'=t->>'id' THEN value||jsonb_build_object('isLocked',p_action='lock') ELSE value END) INTO teams FROM jsonb_array_elements(teams);
 ELSIF p_action='nuke' THEN
 SELECT count(*) INTO total FROM jsonb_array_elements(teams) WHERE NOT (value->>'isLocked')::boolean;
 IF total<2 THEN RAISE EXCEPTION 'Blow-up requires at least two unlocked squads.'; END IF;
 pool:='[]';result_teams:='[]';
 FOR t IN SELECT value FROM jsonb_array_elements(teams) LOOP
 IF (t->>'isLocked')::boolean THEN result_teams:=result_teams||jsonb_build_array(t);
 ELSE pool:=pool||jsonb_build_array(t->>'duo1_id',t->>'duo2_id'); END IF;END LOOP;
 teams:=result_teams;st:=st||jsonb_build_object('phase','repairing','last_spin',null,'blowup_count',(st->>'blowup_count')::integer+1);
 ELSIF p_action='reroll' THEN
 SELECT value INTO t FROM jsonb_array_elements(teams) WHERE value->>'duo1_id'=buyer OR value->>'duo2_id'=buyer;
 IF t IS NULL OR (t->>'isLocked')::boolean THEN RAISE EXCEPTION 'Purchasing squad is missing or locked.'; END IF;
 SELECT value INTO b FROM jsonb_array_elements(duos) WHERE value->>'id'=CASE WHEN t->>'duo1_id'=buyer THEN t->>'duo2_id' ELSE t->>'duo1_id' END;
 SELECT coalesce(jsonb_agg(x),'[]'::jsonb) INTO choices FROM jsonb_array_elements(duos) x WHERE EXISTS(
 SELECT 1 FROM jsonb_array_elements(teams) y WHERE y->>'id'<>t->>'id' AND NOT (y->>'isLocked')::boolean AND (y->>'duo1_id'=x->>'id' OR y->>'duo2_id'=x->>'id'));
 IF jsonb_array_length(choices)=0 THEN RAISE EXCEPTION 'No different eligible partner: unlock another squad first.'; END IF;
 selected:=floor(random()*jsonb_array_length(choices));c:=choices->selected;
 SELECT value INTO other_t FROM jsonb_array_elements(teams) WHERE value->>'duo1_id'=c->>'id' OR value->>'duo2_id'=c->>'id';
 SELECT value INTO d FROM jsonb_array_elements(duos) WHERE value->>'id'=CASE WHEN other_t->>'duo1_id'=c->>'id' THEN other_t->>'duo2_id' ELSE other_t->>'duo1_id' END;
 SELECT coalesce(jsonb_agg(value),'[]'::jsonb) INTO result_teams FROM jsonb_array_elements(teams) WHERE value->>'id' NOT IN(t->>'id',other_t->>'id');
 teams:=result_teams||jsonb_build_array(fcl_switch_team(a,c),fcl_switch_team(b,d));
 END IF;
 ELSIF p_action='practice_entries' THEN
 IF NOT s.practice OR phase<>'registration' THEN RAISE EXCEPTION 'This shortcut is only available in practice registration.'; END IF;
 SELECT jsonb_agg(value||'{"entry_verified":true}'::jsonb) INTO duos FROM jsonb_array_elements(duos);
 ELSIF p_action='start' THEN
 IF NOT s.practice AND EXISTS (SELECT 1 FROM jsonb_array_elements(fcl_switch_registrations(s.tournament_id)) AS fresh(reg) FULL JOIN jsonb_array_elements(duos) AS snapshot(duo) ON fresh.reg->>'id'=snapshot.duo->>'id' WHERE fresh.reg IS NULL OR snapshot.duo IS NULL OR fresh.reg->'roster' IS DISTINCT FROM snapshot.duo->'roster' OR fresh.reg->>'team_name' IS DISTINCT FROM snapshot.duo->>'team_name') THEN RAISE EXCEPTION 'Registrations changed. Refresh registrations and review entry payments before starting.'; END IF;
 IF phase<>'registration' THEN RAISE EXCEPTION 'Initial pairing already started.'; END IF;
 IF jsonb_array_length(duos)<4 OR jsonb_array_length(duos)%2<>0 THEN RAISE EXCEPTION 'At least four duos and an even registration count are required.'; END IF;
 IF EXISTS(SELECT 1 FROM jsonb_array_elements(duos) x WHERE NOT (x->>'entry_verified')::boolean OR jsonb_typeof(x->'roster')<>'array' OR jsonb_array_length(x->'roster')<>2) THEN RAISE EXCEPTION 'Every duo needs a verified $5 entry and exactly two players.'; END IF;
 SELECT count(*),count(DISTINCT lower(btrim(CASE WHEN jsonb_typeof(r)='object' THEN coalesce(r->>'gamertag',r->>'name') ELSE r#>>'{}' END))) INTO total,unique_total
 FROM jsonb_array_elements(duos) x CROSS JOIN LATERAL jsonb_array_elements(x->'roster') r;
 IF total<>unique_total OR EXISTS(SELECT 1 FROM jsonb_array_elements(duos) x CROSS JOIN LATERAL jsonb_array_elements(x->'roster') r WHERE nullif(btrim(CASE WHEN jsonb_typeof(r)='object' THEN coalesce(r->>'gamertag',r->>'name') ELSE r#>>'{}' END),'') IS NULL) THEN RAISE EXCEPTION 'Players must be named and cannot appear in multiple duos.'; END IF;
 SELECT jsonb_agg(value->>'id') INTO pool FROM jsonb_array_elements(duos);st:=st||'{"phase":"pairing"}'::jsonb;
 ELSIF p_action='spin' THEN
 IF phase NOT IN ('pairing','repairing') OR jsonb_array_length(pool)<2 THEN RAISE EXCEPTION 'No duos are waiting for a pairing spin.'; END IF;
 -- Fixed queue order for the anchor; partner is selected randomly on the server.
 SELECT value INTO a FROM jsonb_array_elements(duos) WHERE value->>'id'=pool->>0;
 SELECT jsonb_agg(x) INTO choices FROM jsonb_array_elements(duos) x WHERE x->>'id'<>a->>'id' AND pool ? (x->>'id');
 selected:=floor(random()*jsonb_array_length(choices));c:=choices->selected;
 teams:=teams||jsonb_build_array(fcl_switch_team(a,c));
 SELECT coalesce(jsonb_agg(value),'[]'::jsonb) INTO pool FROM jsonb_array_elements(pool) WHERE value#>>'{}' NOT IN(a->>'id',c->>'id');
 IF jsonb_array_length(pool)=0 THEN st:=st||'{"phase":"window"}'::jsonb; END IF;
 ELSIF p_action='finalize' THEN
 IF phase<>'window' OR jsonb_array_length(pool)>0 OR jsonb_array_length(teams)<2 THEN RAISE EXCEPTION 'Complete all pairing spins before finalizing.'; END IF;
 st:=st||'{"phase":"finalized","status":"locked"}'::jsonb;
 ELSIF p_action='bracket_saved' THEN
 IF phase<>'finalized' OR s.practice THEN RAISE EXCEPTION 'Finalize a real tournament first.'; END IF;
 IF NOT EXISTS(SELECT 1 FROM tournaments WHERE id::text=s.tournament_id AND jsonb_array_length(coalesce(bracket_data->'stages','[]'::jsonb))>0) THEN RAISE EXCEPTION 'Bracket has not been saved. Retry generation.'; END IF;
 st:=st||'{"bracket_generated":true}'::jsonb;
 ELSIF p_action='reset' THEN
 IF NOT s.practice THEN RAISE EXCEPTION 'Only practice sessions can be reset.'; END IF;
 teams:='[]';pool:='[]';SELECT jsonb_agg(value||'{"entry_verified":false}'::jsonb) INTO duos FROM jsonb_array_elements(duos);
 st:=st||'{"phase":"registration","status":"registration","active_spin":null,"last_spin":null,"blowup_count":0}'::jsonb;
 ELSE RAISE EXCEPTION 'Unknown Switch action.';
 END IF;
 IF p_action IN ('spin','reroll') THEN
 spin:=jsonb_build_object('before_teams',before_teams,'before_unpaired',before_pool,'id',p_operation,'spin_type',p_action,'requesting_duo',a,'target_duo',c,'slices',choices,'target_index',selected,
 'starts_at',clock_timestamp()+interval '1 second','ends_at',clock_timestamp()+interval '6.2 seconds','duration_ms',5200,
 'title',CASE WHEN p_action='reroll' THEN 'Random partner respin' ELSE 'Live duo pairing' END,'subtext','Partner for '||(a->>'team_name'));
 st:=st||jsonb_build_object('active_spin',spin);
 END IF;
 st:=st||jsonb_build_object('duos',duos,'teams',teams,'unpaired',pool);
 IF st->>'phase'<>'finalized' THEN st:=st||jsonb_build_object('status',st->>'phase'); END IF;
 UPDATE fcl_switch_sessions SET state=st,revision=revision+1 WHERE id=p_id;
 INSERT INTO fcl_switch_actions(operation_id,session_id,actor,action,args,amount,method,reference,outcome) VALUES(p_operation,p_id,auth.uid(),p_action,p_args,amount,method_text,ref_text,
 jsonb_build_object('before_teams',before_teams,'after_teams',teams,'unpaired_after',pool,'summary',jsonb_build_object('purchaser',a->>'team_name','partner',c->>'team_name','target_squad',CASE WHEN p_action IN ('lock','unlock') THEN t->>'name' ELSE NULL END,'waiting_duos',jsonb_array_length(pool))));
 RETURN fcl_switch_read(p_id);
END $$;
-- Preserve failed staff attempts as well as successful actions. The inner function
-- runs in a subtransaction: a failure never leaves half-applied squads or a payment.
CREATE OR REPLACE FUNCTION public.fcl_switch_command(p_id text,p_action text,p_args jsonb,p_operation uuid,p_revision integer) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE result jsonb; failure text; prior fcl_switch_actions;
BEGIN
 IF NOT fcl_switch_is_operator() THEN RAISE EXCEPTION 'Switch operator access required.'; END IF;
 SELECT * INTO prior FROM fcl_switch_actions WHERE operation_id=p_operation;
 IF FOUND AND prior.status='failed' AND prior.session_id=p_id AND prior.action=p_action AND prior.args=p_args THEN
 RETURN fcl_switch_read(p_id)||jsonb_build_object('command_error',prior.error); END IF;
 BEGIN
 result:=fcl_switch_command_core(p_id,p_action,p_args,p_operation,p_revision);RETURN result;
 EXCEPTION WHEN OTHERS THEN
 GET STACKED DIAGNOSTICS failure=MESSAGE_TEXT;
 IF SQLSTATE='23505' THEN failure:='This payment reference was already used. Check the activity history before recording it again.'; END IF;
 IF EXISTS(SELECT 1 FROM fcl_switch_sessions WHERE id=p_id) AND NOT EXISTS(SELECT 1 FROM fcl_switch_actions WHERE operation_id=p_operation) THEN
 INSERT INTO fcl_switch_actions(operation_id,session_id,actor,action,args,amount,method,reference,status,error)
 VALUES(p_operation,p_id,auth.uid(),p_action,p_args,CASE p_action WHEN 'entry' THEN 5 WHEN 'reroll' THEN 10 WHEN 'lock' THEN 15 WHEN 'unlock' THEN 15 WHEN 'nuke' THEN 20 ELSE 0 END,
 p_args->>'method',nullif(btrim(p_args->>'reference'),''),'failed',failure);
 UPDATE fcl_switch_sessions SET revision=revision+1 WHERE id=p_id;
 END IF;
 RETURN fcl_switch_read(p_id)||jsonb_build_object('command_error',failure);
 END;
END $$;
REVOKE ALL ON FUNCTION public.fcl_switch_command_core(text,text,jsonb,uuid,integer) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.fcl_switch_team(jsonb,jsonb),public.fcl_switch_registrations(text) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.fcl_switch_create(text,boolean),public.fcl_switch_command(text,text,jsonb,uuid,integer),public.fcl_switch_read(text),public.fcl_switch_is_operator() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fcl_switch_read(text),public.fcl_switch_is_operator() TO anon,authenticated;
GRANT EXECUTE ON FUNCTION public.fcl_switch_create(text,boolean),public.fcl_switch_command(text,text,jsonb,uuid,integer) TO authenticated;
-- Bracket publication is a separate, retryable step after closing purchases.
CREATE OR REPLACE FUNCTION public.fcl_switch_publish_bracket(p_id text,p_bracket jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE s fcl_switch_sessions; stage jsonb; rnd jsonb; match_data jsonb; team_data jsonb; official jsonb; side text; seen text[]:='{}';
BEGIN
 IF NOT fcl_switch_is_operator() THEN RAISE EXCEPTION 'Switch operator access required.'; END IF;
 SELECT * INTO s FROM fcl_switch_sessions WHERE id=p_id FOR UPDATE;
 IF NOT FOUND OR s.practice OR s.state->>'phase'<>'finalized' THEN RAISE EXCEPTION 'Finalize a real Switch session first.'; END IF;
 IF (s.state->>'bracket_generated')::boolean THEN RAISE EXCEPTION 'Official bracket already saved; regeneration is disabled.'; END IF;
 IF jsonb_typeof(p_bracket->'stages') IS DISTINCT FROM 'array' OR jsonb_array_length(p_bracket->'stages')=0 THEN RAISE EXCEPTION 'A complete bracket is required.'; END IF;
 IF p_bracket->>'tournament_id' IS DISTINCT FROM s.tournament_id THEN RAISE EXCEPTION 'Bracket tournament mismatch.'; END IF;
 FOR stage IN SELECT value FROM jsonb_array_elements(p_bracket->'stages') LOOP
 FOR rnd IN SELECT value FROM jsonb_array_elements(stage->'rounds') LOOP
 FOR match_data IN SELECT value FROM jsonb_array_elements(rnd->'matches') LOOP
 FOREACH side IN ARRAY ARRAY['team1','team2'] LOOP
 team_data:=match_data->side;
 IF coalesce(team_data->>'isDuoSwitch','false')='true' THEN
 SELECT value INTO official FROM jsonb_array_elements(s.state->'teams') WHERE value->>'id'=team_data->>'id';
 IF official IS NULL OR official->>'name' IS DISTINCT FROM team_data->>'name' OR official->'roster' IS DISTINCT FROM team_data->'roster'
 OR official->>'duo1_id' IS DISTINCT FROM team_data->>'duo1_id' OR official->>'duo2_id' IS DISTINCT FROM team_data->>'duo2_id' THEN RAISE EXCEPTION 'Bracket contains a squad that differs from the official roster.'; END IF;
 IF NOT (official->>'id'=ANY(seen)) THEN seen:=array_append(seen,official->>'id'); END IF;
 END IF;
 END LOOP;END LOOP;END LOOP;END LOOP;
 IF cardinality(seen)<>jsonb_array_length(s.state->'teams') THEN RAISE EXCEPTION 'Bracket is missing an official squad.'; END IF;
 UPDATE tournaments SET bracket_data=p_bracket,status='Live',updated_at=clock_timestamp() WHERE id::text=s.tournament_id;
 UPDATE fcl_switch_sessions SET state=state||'{"bracket_generated":true}'::jsonb,revision=revision+1 WHERE id=p_id;
 INSERT INTO fcl_switch_actions(operation_id,session_id,actor,action,args,amount) VALUES(gen_random_uuid(),p_id,auth.uid(),'bracket_saved','{}',0);
 RETURN fcl_switch_read(p_id);
END $$;
REVOKE ALL ON FUNCTION public.fcl_switch_publish_bracket(text,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.fcl_switch_publish_bracket(text,jsonb) TO authenticated;
-- Existing permissive table policies must not bypass the Switch state machine.
CREATE OR REPLACE FUNCTION public.fcl_switch_protect_tournament() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM fcl_switch_sessions WHERE tournament_id=OLD.id::text) THEN
 IF NOT fcl_switch_is_operator() THEN RAISE EXCEPTION 'Only an authorized Switch operator can change this tournament.'; END IF;
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'A tournament with a Switch session cannot be deleted.'; END IF;
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS fcl_switch_protect_tournament ON public.tournaments;
CREATE TRIGGER fcl_switch_protect_tournament BEFORE UPDATE OR DELETE ON public.tournaments FOR EACH ROW EXECUTE FUNCTION public.fcl_switch_protect_tournament();
CREATE OR REPLACE FUNCTION public.fcl_switch_protect_registration() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE tid text;
BEGIN
 tid:=CASE WHEN TG_OP='DELETE' THEN OLD.tournament_id::text ELSE NEW.tournament_id::text END;
 IF EXISTS(SELECT 1 FROM fcl_switch_sessions WHERE (tournament_id=tid OR (TG_OP='UPDATE' AND tournament_id=OLD.tournament_id::text)) AND state->>'phase'<>'registration') THEN RAISE EXCEPTION 'Switch registration is closed; official duo membership cannot change.'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF;RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS fcl_switch_protect_registration ON public.tournament_registrations;
CREATE TRIGGER fcl_switch_protect_registration BEFORE INSERT OR UPDATE OR DELETE ON public.tournament_registrations FOR EACH ROW EXECUTE FUNCTION public.fcl_switch_protect_registration();
-- Assign BOTH duo owners to the newly combined squad when staff enable reporting.
CREATE OR REPLACE FUNCTION public.fcl_switch_assign_reporters() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE st jsonb; side integer; squad text; t jsonb; d jsonb; owner_id uuid;
BEGIN
 SELECT state INTO st FROM fcl_switch_sessions WHERE tournament_id=NEW.tournament_id::text AND state->>'phase'='finalized';
 IF st IS NULL THEN RETURN NEW; END IF;
 -- Re-enabling a match must not retain reporters from a different matchup.
 DELETE FROM tournament_report_members WHERE tournament_id=NEW.tournament_id AND match_id=NEW.match_id;
 FOR side IN 1..2 LOOP
 squad:=CASE WHEN side=1 THEN NEW.team1 ELSE NEW.team2 END;
 SELECT value INTO t FROM jsonb_array_elements(st->'teams') WHERE value->>'name'=squad;
 IF t IS NULL THEN CONTINUE; END IF;
 FOR d IN SELECT value FROM jsonb_array_elements(st->'duos') WHERE value->>'id' IN(t->>'duo1_id',t->>'duo2_id') LOOP
 IF coalesce(d->>'registered_by','') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
 owner_id:=(d->>'registered_by')::uuid;
 IF EXISTS(SELECT 1 FROM auth.users WHERE id=owner_id) THEN
 INSERT INTO tournament_report_members(tournament_id,match_id,user_id,team) VALUES(NEW.tournament_id,NEW.match_id,owner_id,side) ON CONFLICT(tournament_id,match_id,user_id) DO UPDATE SET team=excluded.team;
 END IF;END IF;END LOOP;END LOOP;
 RETURN NEW;
END $$;
DO $$ BEGIN
 IF to_regclass('public.tournament_report_matches') IS NOT NULL AND to_regclass('public.tournament_report_members') IS NOT NULL THEN
 EXECUTE 'DROP TRIGGER IF EXISTS zz_fcl_switch_assign_reporters ON public.tournament_report_matches';
 EXECUTE 'CREATE TRIGGER zz_fcl_switch_assign_reporters AFTER INSERT OR UPDATE ON public.tournament_report_matches FOR EACH ROW EXECUTE FUNCTION public.fcl_switch_assign_reporters()';
 END IF;
END $$;
REVOKE ALL ON FUNCTION public.fcl_switch_protect_tournament(),public.fcl_switch_protect_registration(),public.fcl_switch_assign_reporters() FROM PUBLIC,anon,authenticated;

COMMIT;
