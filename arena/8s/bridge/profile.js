// Adds separate Discord 8s statistics without changing general Arena ladder Elo.
(async()=>{
 const db=window.supabaseClient||window.dbClient,root=document.querySelector('main');if(!db||!root)return;
 const card=document.createElement('section');card.style.cssText='padding:22px;margin:24px 0;background:#101927;border:1px solid #29374f;border-radius:8px;';
 const title=document.createElement('h2');title.textContent='Discord Arena 8’s';const text=document.createElement('p');const link=document.createElement('a');link.href='/arena/8s/';link.textContent='Open live 8’s queue';card.append(title,text,link);root.append(card);
 async function refresh(){try{const {data,error}=await db.rpc('fcl_arena_state');if(error)throw error;const me=data.state?.users?.find(u=>u.discordId===data.discord_id);text.textContent=me?`${me.elo} Elo · ${me.wins} wins · ${me.losses} losses · ${me.matchesPlayed} matches${data.online?'':' · Bot currently offline'}`:data.discord_id?'No Discord 8’s matches recorded yet. Join a queue to get started.':'Sign in and link Discord to see your 8’s stats.';}catch(e){text.textContent='8’s stats unavailable: '+e.message;}}
 await refresh();setInterval(()=>{if(!document.hidden)refresh();},15000);
})();
