const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const {PGlite}=require('@electric-sql/pglite');
test('configured prices drive entry, each power-up, history, public reads and nuke escalation',async()=>{
 const db=new PGlite();try{
 await db.exec(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE SCHEMA auth;CREATE TABLE auth.users(id uuid PRIMARY KEY);CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT NULLIF(current_setting('request.jwt.claim.sub',true),'')::uuid$$;`);
 const schema=fs.readFileSync('supabase_database_setup.sql','utf8');for(const name of ['tournaments','tournament_registrations','league_settings'])await db.exec(schema.match(new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${name} \\([\\s\\S]*?\\n\\);`))[0]);
 await db.exec('CREATE TABLE tournament_report_matches(tournament_id text,match_id text,team1 text,team2 text,PRIMARY KEY(tournament_id,match_id));CREATE TABLE tournament_report_members(tournament_id text,match_id text,user_id uuid,team integer,PRIMARY KEY(tournament_id,match_id,user_id));');
 await db.exec(fs.readFileSync('switch/migration.sql','utf8'));
 const staff='11111111-1111-4111-8111-111111111111';await db.query('INSERT INTO auth.users VALUES($1)',[staff]);await db.query('INSERT INTO fcl_switch_operators VALUES($1)',[staff]);await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)",[staff]);
 const prices={entry:10,reroll:11,lock:16,unlock:21,nuke:17};await db.query("INSERT INTO tournaments(id,title,format,switch_prices) VALUES('priced','Priced','Duo Switch (All Modes)',$1)",[prices]);
 assert.equal((await db.query("SELECT entry_fee FROM tournaments WHERE id='priced'")).rows[0].entry_fee,'$10 / Duo');
 await assert.rejects(db.query("UPDATE tournaments SET switch_prices=$1 WHERE id='priced'",[{...prices,nuke:-1}]),/whole dollar/i);
 const duos=Array.from({length:4},(_,i)=>({id:'d'+i,team_name:'Duo'+i,roster:['P'+i+'A','P'+i+'B'],entry_verified:i>0}));
 const state={phase:'registration',duos,teams:[],unpaired:[],blowup_count:0,base_prices:prices};
 await db.query("INSERT INTO fcl_switch_sessions(id,tournament_id,title,state) VALUES('s','priced','Priced',$1)",[state]);
 const edited={...prices,reroll:12};await db.query("UPDATE tournaments SET switch_prices=$1 WHERE id='priced'",[edited]);
 let s=(await db.query("SELECT fcl_switch_read('s') AS s")).rows[0].s;assert.equal(s.state.prices.reroll,12);assert.equal(s.revision,1);
 let n=0;const uuid=()=>`aaaaaaaa-aaaa-4aaa-8aaa-${String(++n).padStart(12,'0')}`;
 async function cmd(action,extra={}){const id=uuid();s=(await db.query('SELECT fcl_switch_command($1,$2,$3,$4,$5) AS s',['s',action,{duo_id:'d0',method:'Cash App',payment_confirmed:true,...extra},id,s.revision])).rows[0].s;assert.equal(s.command_error,undefined,s.command_error);return s.history.find(h=>h.id===id);}
 assert.equal((await cmd('entry')).amount,10);await assert.rejects(db.query("UPDATE tournaments SET switch_prices=$1 WHERE id='priced'",[{...edited,nuke:99}]),/prices are locked/i);
 const team=(a,b)=>({id:'squad'+a,name:'Squad'+a,duo1_id:'d'+a,duo2_id:'d'+b,isLocked:false,roster:[...duos[a].roster,...duos[b].roster]});
 await db.query("UPDATE fcl_switch_sessions SET state=state||$1 WHERE id='s'",[{phase:'window',teams:[team(0,1),team(2,3)]}]);s=(await db.query("SELECT fcl_switch_read('s') AS s")).rows[0].s;
 assert.equal((await cmd('lock')).amount,16);assert.equal((await cmd('unlock',{duo_id:'d2',target_id:'squad0'})).amount,21);
 assert.equal((await cmd('reroll')).amount,12);
 await db.exec("UPDATE fcl_switch_sessions SET state=jsonb_set(state,'{active_spin,ends_at}',to_jsonb((clock_timestamp()-interval '1 second')::text)) WHERE id='s'");
 const nuke=await cmd('nuke');assert.equal(nuke.amount,17);assert.deepEqual(s.state.prices,{entry:10,reroll:17,lock:21,unlock:26,nuke:22});
 await db.exec("SELECT set_config('request.jwt.claim.sub','',false)");const publicRead=(await db.query("SELECT fcl_switch_read('s') AS s")).rows[0].s;assert.equal(publicRead.state.prices.nuke,22);assert.equal(publicRead.history.find(x=>x.id===nuke.id).amount,17);
 }finally{await db.close();}
});
test('admin price fields validate and round-trip while other tournaments are unaffected',()=>{
 const els=Object.fromEntries(['reroll','lock','unlock','nuke'].map(k=>[k,{value:''}]));const window={};vm.runInNewContext(fs.readFileSync('switch-pricing.js','utf8'),{window,document:{getElementById:id=>els[id]}});
 const t={switch_prices:{entry:10,reroll:11,lock:12,unlock:13,nuke:14}};window.SwitchPricing.fill('',t);const p=window.SwitchPricing.read('','$10 / Duo',true);assert.deepEqual(JSON.parse(JSON.stringify(p)),t.switch_prices);
 els.lock.value='2.5';assert.throws(()=>window.SwitchPricing.read('','$10 / Duo',true),/whole-dollar/);assert.throws(()=>window.SwitchPricing.read('','$10.50 / Duo',true),/whole-dollar/);
});
