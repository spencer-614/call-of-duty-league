// @ts-nocheck
// Standalone dashboard deployment: name the Edge Function arena8.
// Reuses existing LEAGUE_BOT_SECRET and DISCORD_GUILD_ID project secrets.
import pg from 'npm:pg@8.13.1';
import {timingSafeEqual} from 'node:crypto';
import {Buffer} from 'node:buffer';
const env=Deno.env.toObject();
const pool=new pg.Pool({connectionString:env.LEAGUE_DATABASE_URL||env.SUPABASE_DB_URL,max:1,connectionTimeoutMillis:5000,idleTimeoutMillis:5000,query_timeout:20000,...(env.LEAGUE_DATABASE_CA?{ssl:{ca:env.LEAGUE_DATABASE_CA.replace(/\\n/g,'\n'),rejectUnauthorized:true}}:{})});
pool.on('error',e=>console.error('Arena database:',e.message));
const json=(data:unknown,status=200)=>Response.json(data,{status});
Deno.serve(async req=>{
 if(new URL(req.url).pathname.endsWith('/health'))return json({service:'frontline-arena8',configured:!!(env.LEAGUE_BOT_SECRET&&env.DISCORD_GUILD_ID&&(env.LEAGUE_DATABASE_URL||env.SUPABASE_DB_URL))});
 const token=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
 const secret=env.LEAGUE_BOT_SECRET||'';
 if(!secret||Buffer.byteLength(token)!==Buffer.byteLength(secret)||!timingSafeEqual(Buffer.from(token),Buffer.from(secret)))return json({error:'Unauthorized'},401);
 if(req.method==='GET' && new URL(req.url).pathname.endsWith('/diagnostics')){
  try{await pool.query('SELECT 1 FROM public.fcl_arena_bridge LIMIT 1');await pool.query('SELECT 1 FROM public.fcl_arena_actions LIMIT 1');return json({service:'frontline-arena8',authentication:'accepted',database:'connected',migration:'ready'});}catch(e){console.error('Arena diagnostics:',e.message);return json({error:'Run league/arena8.sql in this project'},500);}
 }
 if(req.method!=='POST'||!['/sync','/heartbeat'].some(p=>new URL(req.url).pathname.endsWith(p)))return json({error:'Not found'},404);
 let db;
 try{
  const raw=await req.text();if(raw.length>5000000)return json({error:'Arena snapshot exceeds 5 MB. Archive old matches locally.'},413);
  const body=JSON.parse(raw);
  if(!/^[0-9a-f-]{36}$/i.test(body.worker_id||'')||!env.DISCORD_GUILD_ID)return json({error:'Invalid worker configuration'},400);
  if(body.state && (body.state.guildId!==env.DISCORD_GUILD_ID||!Array.isArray(body.state.queues)||!Array.isArray(body.state.users)||!Array.isArray(body.state.matches)))return json({error:'Invalid guild snapshot'},400);
  if(new URL(req.url).pathname.endsWith('/heartbeat')) {
   const {rowCount}=await pool.query("UPDATE public.fcl_arena_bridge SET lease_until=now()+interval '60 seconds' WHERE guild_id=$1 AND worker_id=$2 AND lease_until>now()",[env.DISCORD_GUILD_ID,body.worker_id]);
   return rowCount?json({ok:true}):json({error:'Arena worker lease lost'},409);
  }
  db=await pool.connect();await db.query('BEGIN');
  await db.query('INSERT INTO public.fcl_arena_bridge(guild_id) VALUES($1) ON CONFLICT DO NOTHING',[env.DISCORD_GUILD_ID]);
  const {rows:[row]}=await db.query('SELECT * FROM public.fcl_arena_bridge WHERE guild_id=$1 FOR UPDATE',[env.DISCORD_GUILD_ID]);
  if(row.lease_until && new Date(row.lease_until).getTime()>Date.now() && row.worker_id!==body.worker_id){await db.query('ROLLBACK');return json({error:'Another Arena bot holds the active worker lease. Stop it and wait 60 seconds.'},409);}
  await db.query("UPDATE public.fcl_arena_bridge SET worker_id=$2,lease_until=now()+interval '60 seconds' WHERE guild_id=$1",[env.DISCORD_GUILD_ID,body.worker_id]);
  if(body.state){
   // The public mirror never includes account UUID links, bans, tokens, or settings.
   const clean={guildId:env.DISCORD_GUILD_ID,queues:body.state.queues.map((q:any)=>({channelId:q.channelId,queueName:q.queueName,players:q.players,size:q.size,isLocked:q.isLocked})),
    users:body.state.users.map((u:any)=>({discordId:u.discordId,username:u.username,elo:u.elo,wins:u.wins,losses:u.losses,matchesPlayed:u.matchesPlayed,streak:u.streak})),
    matches:body.state.matches.map((m:any)=>({id:m.id,matchNumber:m.matchNumber,status:m.status,channelId:m.channelId,players:m.players,team1:m.team1,team2:m.team2,team1Captain:m.team1Captain,team2Captain:m.team2Captain,winner:m.winner,eloChanges:m.eloChanges,selectedMaps:m.selectedMaps,createdAt:m.createdAt,completedAt:m.completedAt}))};
   await db.query('UPDATE public.fcl_arena_bridge SET state=$2,private_state=$3,updated_at=now() WHERE guild_id=$1',[env.DISCORD_GUILD_ID,JSON.stringify(clean),JSON.stringify(body.private_state)]);
  }
  for(const r of (body.results||[]).slice(0,30))await db.query("UPDATE public.fcl_arena_actions SET status=$3,result=$4,finished_at=now() WHERE id=$1 AND guild_id=$2 AND status='pending'",[r.id,env.DISCORD_GUILD_ID,r.error?'error':'done',String(r.result||'Queue updated.').slice(0,2000)]);
  await db.query("UPDATE public.fcl_arena_actions SET status='error',result='Request expired; please try again.',finished_at=now() WHERE guild_id=$1 AND status='pending' AND created_at<now()-interval '2 minutes'",[env.DISCORD_GUILD_ID]);
  const {rows:actions}=await db.query("SELECT id,discord_id,channel_id,action FROM public.fcl_arena_actions WHERE guild_id=$1 AND status='pending' ORDER BY created_at LIMIT 20",[env.DISCORD_GUILD_ID]);
  await db.query('COMMIT');return json({actions,...(!body.state?{private_state:row.private_state}:{})});
 }catch(e){if(db)await db.query('ROLLBACK').catch(()=>{});console.error('Arena bridge:',e.message);return json({error:'Arena operation failed; check function logs'},500);}finally{db?.release();}
});
