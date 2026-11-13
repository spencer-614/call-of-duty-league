const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const {PGlite}=require('@electric-sql/pglite');
test('identity linking updates once and repeated sync fires no profile/staff update triggers',async()=>{
 const db=new PGlite();try{
 await db.exec(`CREATE SCHEMA auth;CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,raw_user_meta_data jsonb);CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT NULLIF(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 CREATE TABLE players(id bigint,email text,user_id uuid,gamertag text,discord_name text);
 CREATE TABLE tournament_players(id bigint,email text,user_id uuid,gamertag text,discord_name text,discord_id text);
 CREATE TABLE league_signups(id bigint,email text,user_id uuid,gamertag text,discord_username text,discord_user_id text);
 CREATE TABLE staff_roles(id bigint,email text,user_id uuid,notes text,display_name text,updated_at timestamptz);
 CREATE TABLE update_log(table_name text);
 CREATE FUNCTION log_update() RETURNS trigger LANGUAGE plpgsql AS $$BEGIN INSERT INTO update_log VALUES(TG_TABLE_NAME);RETURN NEW;END$$;
 CREATE TRIGGER count_updates AFTER UPDATE ON players FOR EACH ROW EXECUTE FUNCTION log_update();
 CREATE TRIGGER count_updates AFTER UPDATE ON tournament_players FOR EACH ROW EXECUTE FUNCTION log_update();
 CREATE TRIGGER count_updates AFTER UPDATE ON league_signups FOR EACH ROW EXECUTE FUNCTION log_update();
 CREATE TRIGGER count_updates AFTER UPDATE ON staff_roles FOR EACH ROW EXECUTE FUNCTION log_update();`);
 await db.exec(fs.readFileSync('performance/identity-idempotent.sql','utf8'));
 const uid='11111111-1111-4111-8111-111111111111';
 await db.query('INSERT INTO auth.users VALUES($1,$2,$3)',[uid,'user@example.com',{provider_id:'123456789',gamertag:'Example',discord_username:'example'}]);
 await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)",[uid]);
 await db.exec(`INSERT INTO players VALUES(1,NULL,NULL,'Example','example');INSERT INTO tournament_players VALUES(1,NULL,NULL,'Example','example',NULL);INSERT INTO league_signups VALUES(1,NULL,NULL,'Example','example',NULL);INSERT INTO staff_roles VALUES(1,'user@example.com',NULL,'DiscordID: 123456789','Example',NULL);`);
 assert.equal((await db.query('SELECT sync_my_discord_staff_identity() AS d')).rows[0].d,true);
 assert.equal((await db.query('SELECT count(*)::int AS n FROM update_log')).rows[0].n,4);
 for(let i=0;i<3;i++)await db.query('SELECT sync_my_discord_staff_identity()');
 assert.equal((await db.query('SELECT count(*)::int AS n FROM update_log')).rows[0].n,4);
 assert.equal((await db.query('SELECT discord_id FROM tournament_players')).rows[0].discord_id,'123456789');
 await db.query("SELECT set_config('request.jwt.claim.sub','',false)");await assert.rejects(db.query('SELECT sync_my_discord_staff_identity()'),/Authentication/);
 }finally{await db.close();}
});
test('background account sync is shared, throttled across page reloads and runs on changed identity',async()=>{
 let calls=0,time=1000;const storage=new Map();const localStorage={getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)};
 const text=fs.readFileSync('supabase.js','utf8');const snippet=text.slice(text.indexOf('// Background account linking is not authorization.'));
 const window={LeagueDB:{syncDiscordAuthAccount:async()=>{calls++;return {success:true};}}};
 const ctx={window,localStorage,Map,JSON,Date:{now:()=>time}};
 vm.runInNewContext(snippet,ctx);const user={id:'a',email:'a@example.com',user_metadata:{name:'a'}};
 await Promise.all([window.LeagueDB.syncDiscordAuthAccount(user),window.LeagueDB.syncDiscordAuthAccount(user)]);assert.equal(calls,1);
 await window.LeagueDB.syncDiscordAuthAccount(user);assert.equal(calls,1);
 // Another page with an empty memory cache still honors the per-account cooldown.
 const second={LeagueDB:{syncDiscordAuthAccount:async()=>{calls++;return {success:true};}}};vm.runInNewContext(snippet,{...ctx,window:second});await second.LeagueDB.syncDiscordAuthAccount(user);assert.equal(calls,1);
 await second.LeagueDB.syncDiscordAuthAccount({...user,user_metadata:{name:'new'}});assert.equal(calls,2);
 time+=300001;await second.LeagueDB.syncDiscordAuthAccount({...user,user_metadata:{name:'new'}});assert.equal(calls,3);
});
