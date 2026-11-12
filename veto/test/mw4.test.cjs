const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const {PGlite}=require('@electric-sql/pglite');
const expected={Hardpoint:['Lithium','Lotus','Munition','Reactor U92','Rooftops','Sentry'],SearchAndDestroy:['Coal','Lotus','Munition','Reactor U92','Rooftops','Silkworm'],Hijacked:['Lithium','Lotus','Munition']};
function browser(){const context={window:{}};vm.runInNewContext(fs.readFileSync('tournament-veto.js','utf8'),context);return context.window.TournamentVeto;}
test('browser pools and BO5 order match the saved MW4 rulebook',()=>{const api=browser();assert.deepEqual(JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(api.pool).map(([k,v])=>[k,v.map(m=>m.name)])))),expected);const series=api.createFreshSeries();assert.deepEqual(Array.from(series,g=>g.mode),['Hardpoint','Search and Destroy','Hijacked','Hardpoint','Search and Destroy']);assert.equal(api.ruleset,'mw4-20261112');series[0].pool[0].name='changed';assert.equal(api.createFreshSeries()[0].pool[0].name,'Lithium');});
test('database adapter updates pools while delegating authorization, turns and versions',async()=>{const db=new PGlite();try{
 await db.exec(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE SCHEMA auth;CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 CREATE TABLE tournament_veto_states(tournament_id text,match_id text,state jsonb,PRIMARY KEY(tournament_id,match_id));
 CREATE TABLE test_members(uid uuid,team integer,is_staff boolean DEFAULT false);
 INSERT INTO test_members VALUES('11111111-1111-4111-8111-111111111111',1,false),('22222222-2222-4222-8222-222222222222',2,false),('33333333-3333-4333-8333-333333333333',NULL,true);
 -- Contract fixture for the existing deployed RPC, whose source is not in the ZIP.
 CREATE FUNCTION tournament_veto_action(p_tournament text,p_match text,p_action text,p_version integer,p_game integer DEFAULT NULL,p_map text DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
 DECLARE s jsonb; g jsonb; series jsonb; members integer;staff boolean;left_pool jsonb;
 BEGIN
 SELECT team,is_staff INTO members,staff FROM test_members WHERE uid=auth.uid();IF members IS NULL AND NOT coalesce(staff,false) THEN RAISE EXCEPTION 'Not a match participant';END IF;
 SELECT state INTO s FROM tournament_veto_states WHERE tournament_id=p_tournament AND match_id=p_match FOR UPDATE;
 IF coalesce((s->>'version')::integer,0)<>p_version THEN RAISE EXCEPTION 'Stale version';END IF;
 IF p_action IN('reset','coin') THEN
 IF p_action='reset' AND NOT staff THEN RAISE EXCEPTION 'Staff only reset';END IF;
 SELECT jsonb_agg(jsonb_build_object('game',n,'mode','Legacy mode','pool',jsonb_build_array(jsonb_build_object('name','Obsolete map')),'map',NULL,'status','pending','struckBy','[]'::jsonb)) INTO series FROM generate_series(1,5)n;
 s:=jsonb_build_object('series',series,'coinFlipped',p_action='coin','coinWinner','team_a','vetoStep',0,'version',p_version+1);
 ELSE
 IF NOT (s->>'coinFlipped')::boolean THEN RAISE EXCEPTION 'Flip coin first';END IF;
 IF members IS NULL OR members<>(CASE WHEN (s->>'vetoStep')::integer%2=0 THEN 1 ELSE 2 END) THEN RAISE EXCEPTION 'Wrong team turn';END IF;
 SELECT value INTO g FROM jsonb_array_elements(s->'series') WHERE value->>'status'<>'decided' ORDER BY (value->>'game')::integer LIMIT 1;
 IF (g->>'game')::integer<>p_game THEN RAISE EXCEPTION 'Wrong active game';END IF;
 IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(g->'pool') x WHERE x->>'name'=p_map) THEN RAISE EXCEPTION 'Map unavailable';END IF;
 SELECT jsonb_agg(value) INTO left_pool FROM jsonb_array_elements(g->'pool') WHERE value->>'name'<>p_map;
 g:=g||jsonb_build_object('pool',left_pool,'struckBy',(g->'struckBy')||jsonb_build_array(jsonb_build_object('mapName',p_map,'teamName','Team')));
 IF jsonb_array_length(left_pool)=1 THEN g:=g||jsonb_build_object('map',left_pool->0,'status','decided');END IF;
 s:=jsonb_set(s,ARRAY['series',(p_game-1)::text],g)||jsonb_build_object('vetoStep',(s->>'vetoStep')::integer+1,'version',p_version+1);
 END IF;
 INSERT INTO tournament_veto_states VALUES(p_tournament,p_match,s) ON CONFLICT(tournament_id,match_id) DO UPDATE SET state=excluded.state;RETURN s;
 END $$;`);
 const sql=fs.readFileSync('veto/mw4-migration.sql','utf8');await db.exec(sql);await db.exec(sql);
 const users={a:'11111111-1111-4111-8111-111111111111',b:'22222222-2222-4222-8222-222222222222',staff:'33333333-3333-4333-8333-333333333333',other:'44444444-4444-4444-8444-444444444444'};
 const login=async id=>db.query("SELECT set_config('request.jwt.claim.sub',$1,false)",[id]);
 let state;async function action(a,version=state?.version||0,game=null,map=null){const r=await db.query('SELECT tournament_veto_action($1,$2,$3,$4,$5,$6) AS state',['t','m',a,version,game,map]);state=r.rows[0].state;return state;}
 await login('');await assert.rejects(action('coin'),/sign in/i);await login(users.other);await assert.rejects(action('coin'),/participant/i);
 await login(users.a);await action('coin',0);assert.equal(state.ruleset,'mw4-20261112');assert.deepEqual(state.series.map(g=>g.mode),Array.from(browser().createFreshSeries(),g=>g.mode));
 for(const g of state.series)assert.deepEqual(g.pool.map(m=>m.name),expected[g.game===3?'Hijacked':[1,4].includes(g.game)?'Hardpoint':'SearchAndDestroy']);
 await assert.rejects(action('strike',state.version,1,'Cachette'),/not in the MW4 pool/i);await login(users.b);await assert.rejects(action('strike',state.version,1,'Lithium'),/wrong team/i);
 await login(users.a);await assert.rejects(action('strike',0,1,'Lithium'),/stale version/i);
 while(state.series.some(g=>g.status!=='decided')){const g=state.series.find(g=>g.status!=='decided');await login(state.vetoStep%2?users.b:users.a);await action('strike',state.version,g.game,g.pool[0].name);}
 assert.equal(state.series[2].mode,'Hijacked');assert.ok(state.series.every(g=>g.map&&g.status==='decided'));
 await login(users.a);await assert.rejects(action('reset'),/staff only/i);await login(users.staff);await action('reset');assert.equal(state.coinFlipped,false);assert.equal(state.series[2].pool.length,3);
 // Deploying this migration does not rewrite saved matches. Legacy matches require staff reset.
 await db.query("UPDATE tournament_veto_states SET state=state-'ruleset' WHERE tournament_id='t'");await assert.rejects(action('strike',state.version,1,'Lithium'),/older map pools/i);
 await action('reset');assert.equal(state.ruleset,'mw4-20261112');
 await db.exec('SET ROLE authenticated');await assert.rejects(db.query("UPDATE tournament_veto_states SET state='{}'"),/permission/i);await assert.rejects(db.query("SELECT tournament_veto_action_legacy_mw4('t','m','reset',0,NULL,NULL)"),/permission/i);await db.exec('RESET ROLE');
 }finally{await db.close();}});

test('standalone match room uses the same mode-specific pools',()=>{const source=fs.readFileSync('match/index.html','utf8');const expression=source.slice(source.indexOf('const CDL_MAP_POOL = ')+21,source.indexOf(';',source.indexOf('const CDL_MAP_POOL = ')));const pool=vm.runInNewContext('('+expression+')');assert.deepEqual(JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(pool).map(([k,v])=>[k,v.map(m=>m.name)])))),expected);assert.equal((source.match(/mode: "Hijacked"/g)||[]).length,2);});
