const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const {PGlite}=require('@electric-sql/pglite');
test('Switch database workflow, payments, random pairing, protection, permissions and recovery',async()=>{
 const db=new PGlite();try{
 await db.exec(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE SCHEMA auth;CREATE TABLE auth.users(id uuid PRIMARY KEY);CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT NULLIF(current_setting('request.jwt.claim.sub',true),'')::uuid$$;`);
 const schema=fs.readFileSync('supabase_database_setup.sql','utf8');
 for(const name of ['tournaments','tournament_registrations','league_settings']){const m=schema.match(new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${name} \\([\\s\\S]*?\\n\\);`));assert.ok(m,name);await db.exec(m[0]);}
 await db.exec(`CREATE TABLE tournament_report_matches(tournament_id text,match_id text,team1 text,team2 text,PRIMARY KEY(tournament_id,match_id));CREATE TABLE tournament_report_members(tournament_id text,match_id text,user_id uuid,team integer,PRIMARY KEY(tournament_id,match_id,user_id));`);
 const sql=fs.readFileSync('switch/migration.sql','utf8');await db.exec(sql);await db.exec(sql);
 const staff='11111111-1111-4111-8111-111111111111',player='22222222-2222-4222-8222-222222222222';
 await db.query('INSERT INTO auth.users VALUES($1),($2)',[staff,player]);await db.query('INSERT INTO fcl_switch_operators VALUES($1)',[staff]);
 const who=async id=>db.query("SELECT set_config('request.jwt.claim.sub',$1,false)",[id]);await who(player);
 await assert.rejects(db.query("SELECT fcl_switch_create(NULL,true)"),/operator/i);await who(staff);
 let session=(await db.query('SELECT fcl_switch_create(NULL,true) AS s')).rows[0].s;
 let seq=0;const uuid=()=>`aaaaaaaa-aaaa-4aaa-8aaa-${String(++seq).padStart(12,'0')}`;
 async function cmd(action,args={},id=uuid(),revision=session.revision){const r=await db.query('SELECT fcl_switch_command($1,$2,$3,$4,$5) AS s',[session.id,action,args,id,revision]);session=r.rows[0].s;if(session.command_error)throw Error(session.command_error);return session;}
 async function finish(){await db.query(`UPDATE fcl_switch_sessions SET state=jsonb_set(state,'{active_spin,ends_at}',to_jsonb((clock_timestamp()-interval '1 second')::text)) WHERE id=$1 AND state->'active_spin'<>'null'::jsonb`,[session.id]);}
 const invariant=()=>{const st=session.state;const all=st.teams.flatMap(t=>[t.duo1_id,t.duo2_id]).concat(st.unpaired);assert.equal(new Set(all).size,all.length);assert.equal(all.length,st.duos.length);for(const t of st.teams){const rosters=[t.duo1_id,t.duo2_id].flatMap(id=>st.duos.find(d=>d.id===id).roster);assert.deepEqual(t.roster,rosters);assert.equal(t.roster.length,4);}};
 await assert.rejects(cmd('start'),/verified/i);
 for(const d of session.state.duos) await cmd('entry',{duo_id:d.id});
 const op=uuid(), rev=session.revision;await cmd('start',{},op);await cmd('start',{},op,rev); // safe retry
 await assert.rejects(cmd('spin',{},uuid(),rev),/another admin/i);
 while(session.state.unpaired.length){await cmd('spin');invariant();await assert.rejects(cmd('spin'),/still running/i);await finish();}
 const purchaser=session.state.teams[0].duo1_id;const oldPartner=session.state.teams[0].duo2_id;
 await cmd('reroll',{duo_id:purchaser});invariant();let mine=session.state.teams.find(t=>[t.duo1_id,t.duo2_id].includes(purchaser));assert.ok(![mine.duo1_id,mine.duo2_id].includes(oldPartner));await finish();
 await cmd('lock',{duo_id:purchaser});const protectedTeam=session.state.teams.find(t=>t.isLocked);const before=JSON.stringify(protectedTeam);
 await assert.rejects(cmd('reroll',{duo_id:purchaser}),/locked/i);
 const nukeOp=uuid(),nukeRev=session.revision;await cmd('nuke',{duo_id:purchaser},nukeOp);assert.equal(session.state.blowup_count,1);assert.equal(session.history.find(h=>h.id===nukeOp).amount,20);await cmd('nuke',{duo_id:purchaser},nukeOp,nukeRev);assert.equal(session.state.blowup_count,1);assert.equal(session.state.teams.length,1);assert.equal(JSON.stringify(session.state.teams[0]),before);assert.equal(session.state.unpaired.length,6);invariant();
 await assert.rejects(cmd('finalize'),/complete/i);
 while(session.state.unpaired.length){await cmd('spin');invariant();await finish();}
 const another=session.state.teams.find(t=>!t.isLocked).duo1_id;await cmd('unlock',{duo_id:another,target_id:protectedTeam.id});assert.equal(session.state.teams.find(t=>t.id===protectedTeam.id).isLocked,false);
 assert.equal(session.history.find(h=>h.action==='unlock'&&h.status==='completed').amount,20);await cmd('nuke',{duo_id:another});assert.equal(session.state.blowup_count,2);assert.equal(session.history.find(h=>h.action==='nuke').amount,25);assert.equal(session.state.unpaired.length,8);assert.equal(session.state.teams.length,0);invariant();
 while(session.state.unpaired.length){await cmd('spin');await finish();}
 await cmd('lock',{duo_id:another});assert.equal(session.history.find(h=>h.action==='lock').amount,25);await cmd('reroll',{duo_id:session.state.teams.find(t=>!t.isLocked).duo1_id});assert.equal(session.history.find(h=>h.action==='reroll'&&h.status==='completed').amount,20);await finish();await cmd('finalize');await assert.rejects(cmd('reroll',{duo_id:another}),/closed/i);await assert.rejects(cmd('nuke',{duo_id:another}),/closed/i);
 await who(player);const publicState=(await db.query('SELECT fcl_switch_read($1) AS s',[session.id])).rows[0].s;assert.equal(publicState.can_admin,false);assert.ok(publicState.history.every(a=>!('note'in a)&&!('actor'in a)&&!('reference'in a)));
 await assert.rejects(cmd('reset'),/operator/i);await who(staff);
 // Real tournament import, external-payment validation and transaction rollback.
 await db.query("INSERT INTO tournaments(id,title,format) VALUES('real','Real event','Duo Switch')");
 const regs=Array.from({length:4},(_,i)=>({id:'real'+i,tournament_id:'real',team_name:'Real '+i,registered_by:i%2?player:staff,roster:['R'+i+'a','R'+i+'b']}));
 await db.query("INSERT INTO league_settings(id,status_text) VALUES('tournament_registrations_registry',$1)",[JSON.stringify(regs)]);
 session=(await db.query("SELECT fcl_switch_create('real',false) AS s")).rows[0].s;
 await assert.rejects(cmd('entry',{duo_id:'real0'}),/verify/i);
 await cmd('entry',{duo_id:'real0',method:'Cash App',payment_confirmed:true,reference:'payment1',note:'private payment note'});
 await assert.rejects(cmd('entry',{duo_id:'real1',method:'Cash App',payment_confirmed:true,reference:'payment1'}),/already used/i);
 const reread=(await db.query('SELECT fcl_switch_read($1) AS s',[session.id])).rows[0].s;assert.equal(reread.revision,session.revision);assert.equal(reread.state.duos[1].entry_verified,false);
 await assert.rejects(cmd('nuke',{duo_id:'spectator'}),/registered/i);

 // Complete the real session and publish using the site's actual bracket generator.
 for(let i=1;i<4;i++)await cmd('entry',{duo_id:'real'+i,method:'PayPal',payment_confirmed:true,reference:'realPayment'+i});
 // A member changing after import must stop pairing until staff refresh.
 const changed=structuredClone(regs);changed[0].roster[1]='Replacement';await db.query("UPDATE league_settings SET status_text=$1 WHERE id='tournament_registrations_registry'",[JSON.stringify(changed)]);
 await assert.rejects(cmd('start'),/registrations changed/i);await cmd('sync');await cmd('start');
 await assert.rejects(db.query("INSERT INTO tournament_registrations(id,tournament_id,team_name,captain_gamertag,captain_discord) VALUES('late','real','Late','Late','Late')"),/registration is closed/i);
 while(session.state.unpaired.length){await cmd('spin');await finish();}await cmd('finalize');
 const src=fs.readFileSync('supabase.js','utf8');
 const byes=Function('return ({'+src.slice(src.indexOf('  advanceTournamentByes('),src.indexOf('  async generateTournamentBracket(')).trim()+'})')().advanceTournamentByes;
 const genSource=src.slice(src.indexOf('  async generateTournamentBracket('),src.indexOf('  async getTournamentBracket(')).trim();
 const client={from:()=>({select(){return this},eq(){return this},limit(){return Promise.resolve({data:[],error:null})}}),rpc:async(name,args)=>{try{const keys=Object.keys(args);const query='SELECT '+name+'('+keys.map((k,i)=>k+'=> $'+(i+1)).join(',')+') AS s';return{data:(await db.query(query,keys.map(k=>args[k]))).rows[0].s,error:null};}catch(e){return{data:null,error:{message:e.message}}}}};
 const storage={setItem(){},getItem(){return null},removeItem(){},length:0};const windowMock={supabaseClient:client,dispatchEvent(){}};
 const generate=Function('window','localStorage','CustomEvent','return ({'+genSource+'})')(windowMock,storage,function(){}).generateTournamentBracket;
 const api={getTournaments:async()=>(await db.query("SELECT * FROM tournaments WHERE id='real'")).rows,getTournamentRegistrations:async()=>changed,advanceTournamentByes:byes,generateTournamentBracket:generate};
 const generated=await api.generateTournamentBracket('real',{replaceUnstartedBracket:true,notifyCompetitors:false});assert.equal(generated.success,true,generated.error);
 const saved=(await db.query("SELECT bracket_data FROM tournaments WHERE id='real'")).rows[0].bracket_data;assert.ok(saved.stages.length);session=(await db.query('SELECT fcl_switch_read($1) AS s',[session.id])).rows[0].s;assert.equal(session.state.bracket_generated,true);
 const official=session.state.teams;for(const t of official){const seeded=saved.stages[0].rounds[0].matches.flatMap(m=>[m.team1,m.team2]).find(x=>x.id===t.id);assert.deepEqual(seeded.roster,t.roster);}
 await assert.rejects(db.query('SELECT fcl_switch_publish_bracket($1,$2)',[session.id,saved]),/already saved/i);
 // Both original duo owners receive access to the combined squad.
 const match=saved.stages[0].rounds[0].matches[0];await db.query('INSERT INTO tournament_report_matches VALUES($1,$2,$3,$4)',['real',match.id,match.team1.name,match.team2.name]);
 const reporters=(await db.query('SELECT * FROM tournament_report_members')).rows;assert.ok(reporters.length>=2);for(const member of reporters){const team=member.team===1?match.team1:match.team2;assert.ok(session.state.duos.some(d=>[team.duo1_id,team.duo2_id].includes(d.id)&&d.registered_by===member.user_id));}
 await who(player);await assert.rejects(db.query("UPDATE tournaments SET title='unauthorized' WHERE id='real'"),/authorized Switch operator/i);await who(staff);

 await who(player);await assert.rejects(db.query("SELECT fcl_switch_delete_tournament('real')"),/operator/i);await who(staff);
 await db.query("INSERT INTO league_settings(id,status_text) VALUES('tournaments_registry',$1)",[JSON.stringify([{id:'real'},{id:'keep'}])]);
 await db.query("SELECT fcl_switch_delete_tournament('real')");
 for(const table of ['tournaments','fcl_switch_sessions','tournament_report_matches','tournament_report_members'])assert.equal((await db.query('SELECT count(*)::int AS n FROM '+table+" WHERE "+(table==='tournaments'?'id':'tournament_id')+"='real'")).rows[0].n,0);
 assert.deepEqual(JSON.parse((await db.query("SELECT status_text FROM league_settings WHERE id='tournaments_registry'")).rows[0].status_text),[{id:'keep'}]);
 assert.deepEqual(JSON.parse((await db.query("SELECT status_text FROM league_settings WHERE id='tournament_registrations_registry'")).rows[0].status_text),[]);
 // Practice previews run the exact bracket builder without publishing anything, including byes.
 session=(await db.query('SELECT fcl_switch_create(NULL,true) AS s')).rows[0].s;
 await db.query("UPDATE fcl_switch_sessions SET state=jsonb_set(state,'{duos}',$2) WHERE id=$1",[session.id,session.state.duos.slice(0,6)]);
 session=(await db.query('SELECT fcl_switch_read($1) AS s',[session.id])).rows[0].s;
 await cmd('practice_entries');await cmd('start');while(session.state.unpaired.length){await cmd('spin');await finish();}await cmd('finalize');
 const preview=await api.generateTournamentBracket(session.id,{practice:true,notifyCompetitors:false});assert.equal(preview.success,true,preview.error);assert.equal(preview.practice,true);assert.ok(preview.bracket.stages[0].rounds[0].matches.some(m=>m.isBye));
 for(const stage of preview.bracket.stages)for(const round of stage.rounds)for(const m of round.matches)for(const t of [m.team1,m.team2])if(t.isDuoSwitch)assert.equal(t.roster.length,4);
 assert.equal((await db.query('SELECT state FROM fcl_switch_sessions WHERE id=$1',[session.id])).rows[0].state.bracket_generated,false);await cmd('reset');assert.equal(session.state.phase,'registration');assert.equal(session.state.blowup_count,0);
 await db.exec('SET ROLE authenticated');await assert.rejects(db.query('SELECT fcl_switch_command_core($1,$2,$3,$4,$5)',[session.id,'start',{},uuid(),session.revision]),/permission/i);await db.exec('RESET ROLE');
 await db.exec('SET ROLE anon');await assert.rejects(db.query('SELECT * FROM fcl_switch_actions'),/permission/i);await db.exec('RESET ROLE');
 }finally{await db.close();}
});
