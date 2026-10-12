/* Tournament map evidence: database policies enforce team ownership. */
(() => {
 const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const client = () => window.supabaseClient || window.dbClient;
 const checked = async p => {const {data,error}=await p;if(error)throw Error(error.message);return data;};
 const key = (q,t,m) => q.eq('tournament_id',t).eq('match_id',m);
 const button = (label,fn) => {const b=document.createElement('button');b.type='button';b.textContent=label;b.className='btn-tourney-outline';b.onclick=async()=>{b.disabled=true;try{await fn();}catch(e){alert(e.message);}finally{b.disabled=false;}};return b;};
 async function evidence(path,host){const d=await checked(client().storage.from('tournament-evidence').createSignedUrl(path,300));const a=document.createElement('a');a.href=d.signedUrl;a.target='_blank';a.rel='noopener';a.textContent='View screenshot';host.append(a);}
 window.TournamentReports={
 async mount(host,t,match){
  const c=client();if(!c){host.textContent='Reporting requires a database connection.';return;}
  try {
   const {data:{user},error}=await c.auth.getUser();if(error||!user){host.textContent='Sign in to report maps.';return;}
   t=String(t);const m=String(match.id);const admin=user.app_metadata?.tournament_admin===true || user.app_metadata?.tournament_admin==='true';
   const refresh=()=>this.mount(host,t,match);host.replaceChildren();
   const title=document.createElement('h3');title.textContent='Map results · Best of 5';host.append(title);
   if(admin){host.append(button('Enable reporting for this match',async()=>{await checked(c.from('tournament_report_matches').upsert({tournament_id:t,match_id:m,team1:match.team1.name,team2:match.team2.name}));const assigned=await checked(key(c.from('tournament_report_members').select('*'),t,m));alert(assigned.length?'Reporting enabled. Registered team owners have been assigned where ownership is available.':'Reporting enabled, but no verified registration owners were found. Existing registrations need a one-time ownership assignment.');await refresh();}));
    const uid=document.createElement('input');uid.placeholder='Reporter account UUID';const side=document.createElement('select');side.innerHTML=`<option value="1">${esc(match.team1.name)}</option><option value="2">${esc(match.team2.name)}</option>`;host.append(uid,side,button('Grant team reporting access',async()=>{await checked(c.from('tournament_report_members').upsert({tournament_id:t,match_id:m,user_id:uid.value.trim(),team:Number(side.value)}));uid.value='';alert('Reporter assigned.');}));}
   const members=await checked(key(c.from('tournament_report_members').select('*'),t,m));const own=members.find(x=>x.user_id===user.id);
   const reports=await checked(key(c.from('tournament_map_reports').select('*'),t,m));const decisions=await checked(key(c.from('tournament_map_decisions').select('*'),t,m));
   const score=[0,0];for(let n=1;n<=5;n++){const decision=decisions.find(x=>x.map===n),one=reports.find(x=>x.map===n&&x.team===1),two=reports.find(x=>x.map===n&&x.team===2);const winner=decision?.winner||(one&&two&&one.winner===two.winner?one.winner:0);if(winner)score[winner-1]++;}const summary=document.createElement('p');summary.textContent=`Verified maps: ${match.team1.name} ${score[0]} – ${score[1]} ${match.team2.name}. Staff finalize the series in the bracket controls after all played maps are verified.`;host.append(summary);
   for(let map=1;map<=5;map++){
    const a=reports.find(x=>x.map===map&&x.team===1),b=reports.find(x=>x.map===map&&x.team===2),d=decisions.find(x=>x.map===map);
    const status=d?'Admin decided':a&&b?(a.winner===b.winner?'Confirmed':'Disputed'):a||b?'Waiting for other team':'Not reported';
    const row=document.createElement('section');row.style.cssText='border:1px solid #394126;padding:12px;margin:10px 0';row.innerHTML=`<strong>Map ${map} · ${esc(status)}</strong>`;host.append(row);
    for(const report of [a,b].filter(Boolean)){const p=document.createElement('p');p.textContent=`${report.team===1?match.team1.name:match.team2.name} reports winner: ${report.winner===1?match.team1.name:match.team2.name} · `;row.append(p);await evidence(report.screenshot,p);}
    if(d){const p=document.createElement('p');p.textContent='Official winner: '+(d.winner===1?match.team1.name:match.team2.name);row.append(p);}
    if(own&&!d){const prior=own.team===1?a:b;const select=document.createElement('select');select.innerHTML=`<option value="">Choose map winner</option><option value="1">${esc(match.team1.name)}</option><option value="2">${esc(match.team2.name)}</option>`;select.value=prior?.winner||'';const file=document.createElement('input');file.type='file';file.accept='image/png,image/jpeg,image/webp';row.append(select,file,button(prior?'Save correction':'Submit map',async()=>{
      if(!select.value)throw Error('Choose a winner.');let path=prior?.screenshot;const f=file.files[0];if(f){if(!['image/png','image/jpeg','image/webp'].includes(f.type)||f.size>8388608)throw Error('Use PNG, JPEG or WebP, up to 8 MB.');path=`${user.id}/${t}/${m}/${crypto.randomUUID()}`;await checked(c.storage.from('tournament-evidence').upload(path,f,{contentType:f.type}));}if(!path)throw Error('Attach a screenshot.');await checked(c.from('tournament_map_reports').upsert({tournament_id:t,match_id:m,map,team:own.team,winner:Number(select.value),screenshot:path,updated_at:new Date().toISOString()}));await refresh();}));}
   }
   if(!own&&!admin){const p=document.createElement('p');p.textContent='Ask staff to assign your account as a reporter for your team.';host.append(p);}
   host.append(button('Refresh results',refresh));
  }catch(e){host.textContent='Map reporting: '+e.message;}
 },
 async admin(host){try{const c=client();if(!c)throw Error('Database unavailable.');const session=await checked(c.auth.getUser());if(!session.user||!['true',true].includes(session.user.app_metadata?.tournament_admin))throw Error('Sign in with a tournament admin account.');const rows=await checked(c.from('tournament_map_reports').select('*'));const decisions=await checked(c.from('tournament_map_decisions').select('*'));const matches=await checked(c.from('tournament_report_matches').select('*'));host.replaceChildren();let count=0;
 for(const a of rows.filter(x=>x.team===1)){const b=rows.find(x=>x.team===2&&x.tournament_id===a.tournament_id&&x.match_id===a.match_id&&x.map===a.map);if(!b||a.winner===b.winner||decisions.some(x=>x.tournament_id===a.tournament_id&&x.match_id===a.match_id&&x.map===a.map))continue;count++;const match=matches.find(x=>x.tournament_id===a.tournament_id&&x.match_id===a.match_id);const row=document.createElement('section');row.style.cssText='border:1px solid #555;padding:16px;margin:12px 0';row.innerHTML=`<h3>${esc(match?.team1)} vs ${esc(match?.team2)} · Map ${a.map}</h3><p>${esc(a.tournament_id)} / ${esc(a.match_id)} · Both teams claim this map</p>`;host.append(row);for(const report of [a,b]){const p=document.createElement('p');p.textContent=`Team ${report.team} claims team ${report.winner} won · `;row.append(p);await evidence(report.screenshot,p);}for(const side of [1,2])row.append(button('Winner: '+(side===1?match.team1:match.team2),async()=>{if(!confirm('Set the official map winner? This locks player edits for this map.'))return;await checked(c.from('tournament_map_decisions').upsert({tournament_id:a.tournament_id,match_id:a.match_id,map:a.map,winner:side}));await this.admin(host);}));}
 if(!count)host.textContent='No open tournament map disputes.';
 }catch(e){host.textContent=e.message;}}
 };
})();
