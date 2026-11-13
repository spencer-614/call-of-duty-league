const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {PGlite}=require('@electric-sql/pglite');
test('summaries preserve metadata/counts and brackets; wheel detects changes',async()=>{
 const db=new PGlite();try{
 await db.exec(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE SCHEMA auth;CREATE TABLE auth.users(id uuid PRIMARY KEY);CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT NULLIF(current_setting('request.jwt.claim.sub',true),'')::uuid$$;`);
 const schema=fs.readFileSync('supabase_database_setup.sql','utf8');
 for(const name of ['tournaments','tournament_registrations','league_settings']){const m=schema.match(new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${name} \\([\\s\\S]*?\\n\\);`));assert.ok(m,name);await db.exec(m[0]);}
 await db.exec(fs.readFileSync('switch/migration.sql','utf8'));
 const sql=fs.readFileSync('performance/migration.sql','utf8');await db.exec(sql);await db.exec(sql);
 const bracket={stages:[],padding:'x'.repeat(100000)};
 await db.query("INSERT INTO tournaments(id,title,bracket_data,format) VALUES($1,$2,$3,'Duo Switch')",['event','Canonical',bracket]);
 await db.query("INSERT INTO league_settings(id,status_text) VALUES('tournaments_registry',$1),('tournament_registrations_registry',$2)",[JSON.stringify([{id:'event',title:'Old',circuit:'hub',bracket_data:bracket},{id:'deleted'}]),JSON.stringify([{tournament_id:'event'},{tournament_id:'event'}])]);
 const data=(await db.query('SELECT fcl_tournament_summaries() AS d')).rows[0].d;
 assert.equal(data.length,1);assert.equal(data[0].title,'Canonical');assert.equal(data[0].circuit,'hub');assert.equal(data[0].registered_teams,2);assert.equal(data[0].has_bracket,true);assert.ok(!('bracket_data' in data[0]));assert.ok(JSON.stringify(data).length<2000);
 assert.deepEqual((await db.query("SELECT bracket_data FROM tournaments WHERE id='event'")).rows[0].bracket_data,bracket);
 const uid='11111111-1111-4111-8111-111111111111';await db.query('INSERT INTO auth.users VALUES($1)',[uid]);await db.query('INSERT INTO fcl_switch_operators VALUES($1)',[uid]);await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)",[uid]);
 const s=(await db.query("SELECT fcl_switch_create('event',false) AS s")).rows[0].s;
 const same=(await db.query('SELECT fcl_switch_poll($1,$2) AS d',[s.id,s.revision])).rows[0].d;
 assert.equal(same.unchanged,true);assert.ok(!same.state);assert.ok(!same.history);
 const changed=(await db.query('SELECT fcl_switch_poll($1,-1) AS d',[s.id])).rows[0].d;assert.ok(changed.state);assert.equal(changed.revision,s.revision);
 const small=(await db.query('SELECT fcl_switch_summary($1) AS d',[s.id])).rows[0].d;assert.deepEqual(small.state.prices,changed.state.prices);assert.ok(!small.history);assert.ok(!small.state.duos);
 await db.exec(`ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;CREATE POLICY visible ON tournaments FOR SELECT TO anon USING (false);GRANT SELECT ON tournaments,league_settings,tournament_registrations TO anon;SET ROLE anon;`);
 assert.deepEqual((await db.query('SELECT fcl_tournament_summaries() AS d')).rows[0].d,[]);
 assert.equal((await db.query('SELECT fcl_switch_poll($1,$2) AS d',[s.id,s.revision])).rows[0].d.unchanged,true);
 }finally{await db.close();}
});
test('concurrent reads share requests, isolate results and recover from errors',async()=>{
 const text=fs.readFileSync('supabase.js','utf8');let calls=0,fail=false;
 const window={LeagueDB:{getSignups:async()=>{calls++;await new Promise(r=>setTimeout(r,5));if(fail)throw Error('offline');return [{id:1}];}}};
 vm.runInNewContext(text.slice(text.indexOf('// Share concurrent lookups;')),{window,Map,Promise,JSON});
 const [a,b]=await Promise.all([window.LeagueDB.getSignups(),window.LeagueDB.getSignups()]);assert.equal(calls,1);a[0].id=9;assert.equal(b[0].id,1);
 await window.LeagueDB.getSignups();assert.equal(calls,2);fail=true;await assert.rejects(window.LeagueDB.getSignups(),/offline/);fail=false;await window.LeagueDB.getSignups();assert.equal(calls,4);
});
