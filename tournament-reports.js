/* Tournament map evidence: database policies enforce team ownership. */
(() => {
 const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const client = () => window.supabaseClient || window.dbClient;
 const checked = async p => {const {data,error}=await p;if(error)throw Error(error.message);return data;};
 const key = (q,t,m) => q.eq('tournament_id',t).eq('match_id',m);
 const button = (label,fn) => {const b=document.createElement('button');b.type='button';b.textContent=label;b.className='btn-tourney-outline';b.onclick=async()=>{b.disabled=true;try{await fn();}catch(e){alert(e.message);}finally{b.disabled=false;}};return b;};
 async function evidence(path,host){if(!path)return;const d=await checked(client().storage.from('tournament-evidence').createSignedUrl(path,300));const a=document.createElement('a');a.href=d.signedUrl;a.target='_blank';a.rel='noopener';a.textContent='View screenshot';host.append(a);}
 function series(reports,decisions){const score=[0,0];let winner=0,lastMap=0;for(let n=1;n<=5;n++){const d=decisions.find(x=>x.map===n),a=reports.find(x=>x.map===n&&x.team===1),b=reports.find(x=>x.map===n&&x.team===2);const w=d?.winner||(a&&b&&a.winner===b.winner?a.winner:0);if(!w)break;score[w-1]++;lastMap=n;if(score[w-1]===3){winner=w;break;}}return{score,winner,lastMap};}
 window.TournamentReports={
 series,
 async prepare(t,match){const c=client();const {data,error}=await c.rpc('fcl_tournament_prepare_match',{p_tournament:String(t),p_match:String(match.id)});if(error){if(error.code==='42501')return{match,ready:false,admin:false};throw Error(error.message);}return data;},
 _pendingAwards:new Map(),
 async awardSeries(t,match,winner,reason){const c=client(),key=String(t)+':'+String(match.id);const payload={p_tournament:String(t),p_match:String(match.id),p_winner:Number(winner),p_team1:match.team1.name,p_team2:match.team2.name,p_reason:reason.trim()};let pending=this._pendingAwards.get(key);if(pending&&Object.keys(payload).some(k=>payload[k]!==pending[k]))throw Error('The previous award may still be pending. Refresh the match before submitting a different decision.');if(!pending){pending={...payload,p_operation:crypto.randomUUID()};this._pendingAwards.set(key,pending);}const {data,error}=await c.rpc('fcl_tournament_award_series',pending);if(error){if(!/fetch|network|timeout|connection/i.test(error.message))this._pendingAwards.delete(key);throw Error(error.message);}this._pendingAwards.delete(key);window.dispatchEvent(new CustomEvent('frontline_bracket_updated',{detail:{tournamentId:String(t),bracket:data}}));return data;},
 async overlay(t,bracket){if(!bracket)return bracket;return await checked(client().rpc('fcl_tournament_live_bracket',{p_tournament:String(t)}))||bracket;},
 _mountCleanup:new WeakMap(),
 _mountGeneration:new WeakMap(),
 async mount(target,t,match){
  if(!target)return;
  const generation={};this._mountGeneration.set(target,generation);
  this._mountCleanup.get(target)?.();this._mountCleanup.delete(target);
  const host=document.createElement('div');
  const commit=()=>{if(this._mountGeneration.get(target)!==generation)return false;target.replaceChildren(...host.childNodes);return true;};
  if(match.isBye){host.textContent="Bye — automatic advancement once the preceding match is decided. No map reporting is required.";commit();return;}
  const c=client();if(!c){host.textContent='Reporting requires a database connection.';commit();return;}
  try {
   const {data:{user},error}=await c.auth.getUser();if(error||!user){host.textContent='Sign in to report maps.';commit();return;}
   t=String(t);const m=String(match.id);const prepared=await this.prepare(t,match);if(this._mountGeneration.get(target)!==generation)return;Object.assign(match,prepared.match);const admin=!!prepared.admin;
   const refresh=()=>this.mount(target,t,match);host.replaceChildren();
   const title=document.createElement('h3');title.textContent='Map results · Best of 5';host.append(title);
   if(admin){const advanced=document.createElement('details');const label=document.createElement('summary');label.textContent='Advanced: assign an additional reporter';advanced.append(label);const uid=document.createElement('input');uid.placeholder='Reporter account UUID';const side=document.createElement('select');side.innerHTML=`<option value="1">${esc(match.team1.name)}</option><option value="2">${esc(match.team2.name)}</option>`;advanced.append(uid,side,button('Grant team reporting access',async()=>{await checked(c.from('tournament_report_members').upsert({tournament_id:t,match_id:m,user_id:uid.value.trim(),team:Number(side.value)}));await refresh();}));host.append(advanced);}
   const members=await checked(key(c.from('tournament_report_members').select('*'),t,m));const own=members.find(x=>x.user_id===user.id);
   const reports=await checked(key(c.from('tournament_map_reports').select('*'),t,m));const decisions=await checked(key(c.from('tournament_map_decisions').select('*'),t,m));
   if(own){const identity=document.createElement('p');identity.textContent='You are reporting for: '+(own.team===1?match.team1.name:match.team2.name)+'. Each squad submits its own confirmation below.';host.append(identity);}
   if(this._mountGeneration.get(target)!==generation)return;
   const result=match.report_result?.has_evidence?match.report_result:(match.status==='Completed'&&(match.team1.winner||match.team2.winner)?{score:[match.team1.score,match.team2.score],winner:match.team1.winner?1:2,lastMap:Number(match.team1.score)+Number(match.team2.score)}:series(reports,decisions)),score=result.score;match.team1.score=score[0];match.team2.score=score[1];match.status=result.winner?'Completed':result.lastMap?'Live':'Scheduled';match.team1.winner=result.winner===1;match.team2.winner=result.winner===2;
   const dialog=target.closest?.('dialog');if(dialog){const big=dialog.querySelectorAll('.modal-big-score');if(big[0])big[0].textContent=score[0];if(big[1])big[1].textContent=score[1];const status=dialog.querySelector('[data-report-match-status]');if(status)status.textContent=match.status;}
   const readiness=document.createElement('p');readiness.textContent=prepared.ready?'Map reporting is open: all vetoes are complete.':'Map reporting opens automatically when all map vetoes are complete.';host.append(readiness);const summary=document.createElement('p');summary.textContent=result.awarded?`Series awarded by staff: ${result.winner===1?match.team1.name:match.team2.name} wins ${score[0]}–${score[1]}. Reason: ${result.reason}`:result.winner?`Series complete: ${result.winner===1?match.team1.name:match.team2.name} wins ${score[0]}–${score[1]}.`:`Verified maps: ${match.team1.name} ${score[0]} – ${score[1]} ${match.team2.name}. Waiting for both teams to confirm maps in order.`;host.append(summary);

   for(let map=1;map<=5;map++){
    const a=reports.find(x=>x.map===map&&x.team===1),b=reports.find(x=>x.map===map&&x.team===2),d=decisions.find(x=>x.map===map);
    const unplayed=result.winner&&map>result.lastMap&&!a&&!b&&!d;const status=unplayed?'Not played · series finished':d?'Admin decided':a&&b?(a.winner===b.winner?'Confirmed':'Disputed'):a||b?'Waiting for other team':'Not reported';
    const row=document.createElement('section');row.style.cssText='border:1px solid #394126;padding:12px;margin:10px 0';row.innerHTML=`<strong>Map ${map} · ${esc(status)}</strong>`;host.append(row);
    for(const report of (unplayed?[]:[a,b]).filter(Boolean)){const p=document.createElement('p');p.textContent=`${report.team===1?match.team1.name:match.team2.name} reports winner: ${report.winner===1?match.team1.name:match.team2.name} · `;row.append(p);await evidence(report.screenshot,p);}
    if(d){const p=document.createElement('p');p.textContent='Official winner: '+(d.winner===1?match.team1.name:match.team2.name);row.append(p);}
    if(own&&prepared.ready&&!d&&!result.winner){const prior=own.team===1?a:b;const select=document.createElement('select');select.innerHTML=`<option value="">Choose map winner</option><option value="1">${esc(match.team1.name)}</option><option value="2">${esc(match.team2.name)}</option>`;select.value=prior?.winner||'';row.append(select,button(prior?'Save correction':'Submit map',async()=>{
      if(!select.value)throw Error('Choose a winner.');await checked(c.from('tournament_map_reports').upsert({tournament_id:t,match_id:m,map,team:own.team,winner:Number(select.value),screenshot:prior?.screenshot||null,updated_at:new Date().toISOString()}));await refresh();}));}
   }
   if(!own&&!admin){const p=document.createElement('p');p.textContent='Reporting is available to the registered team representatives. Sign in with the account that registered your duo or team.';host.append(p);}
   host.append(button('Refresh results',refresh));
   if(!commit())return;
   window.dispatchEvent(new CustomEvent('frontline_map_results_updated',{detail:{tournamentId:t,matchId:m}}));
   if(!prepared.ready&&!result.winner){const onVeto=e=>{if(String(e.detail?.tournamentId)===t&&String(e.detail?.matchId)===m)refresh();};window.addEventListener('frontline_match_reporting_ready',onVeto);this._mountCleanup.set(target,()=>window.removeEventListener('frontline_match_reporting_ready',onVeto));}

  }catch(e){host.textContent='Map reporting: '+e.message;commit();}
 },
 async admin(host){try{const c=client();if(!c)throw Error('Database unavailable.');const session=await checked(c.auth.getUser());if(!session.user||!(await window.LeagueDB.getMyStaffAccess()).is_admin)throw Error('Sign in with a tournament admin account.');const rows=await checked(c.from('tournament_map_reports').select('*'));const decisions=await checked(c.from('tournament_map_decisions').select('*'));const matches=await checked(c.from('tournament_report_matches').select('*'));host.replaceChildren();let count=0;
 for(const a of rows.filter(x=>x.team===1)){const result=series(rows.filter(x=>x.tournament_id===a.tournament_id&&x.match_id===a.match_id),decisions.filter(x=>x.tournament_id===a.tournament_id&&x.match_id===a.match_id));if(result.winner&&a.map>result.lastMap)continue;const b=rows.find(x=>x.team===2&&x.tournament_id===a.tournament_id&&x.match_id===a.match_id&&x.map===a.map);if(!b||a.winner===b.winner||decisions.some(x=>x.tournament_id===a.tournament_id&&x.match_id===a.match_id&&x.map===a.map))continue;count++;const match=matches.find(x=>x.tournament_id===a.tournament_id&&x.match_id===a.match_id);const row=document.createElement('section');row.style.cssText='border:1px solid #555;padding:16px;margin:12px 0';row.innerHTML=`<h3>${esc(match?.team1)} vs ${esc(match?.team2)} · Map ${a.map}</h3><p>${esc(a.tournament_id)} / ${esc(a.match_id)} · Both teams claim this map</p>`;host.append(row);for(const report of [a,b]){const p=document.createElement('p');p.textContent=`Team ${report.team} claims team ${report.winner} won · `;row.append(p);await evidence(report.screenshot,p);}for(const side of [1,2])row.append(button('Winner: '+(side===1?match.team1:match.team2),async()=>{if(!confirm('Set the official map winner? This locks player edits for this map.'))return;await checked(c.from('tournament_map_decisions').upsert({tournament_id:a.tournament_id,match_id:a.match_id,map:a.map,winner:side}));await this.admin(host);}));}
 if(!count)host.textContent='No open tournament map disputes.';
 }catch(e){host.textContent=e.message;}}
 };
})();
