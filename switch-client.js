/* Switch v2: external payments, staff commands, durable server-selected wheel results. */
(() => {
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const db=()=>window.supabaseClient||window.dbClient;
 const phases={registration:'Registration & entry payments',pairing:'Initial pairing',window:'Purchase window open',repairing:'Blow-up · pairing again',finalized:'Squads official · purchases closed'};
 const legacyPrices={entry:5,reroll:10,lock:15,unlock:15,nuke:20};
 const currentPrices=()=>active?.state.prices||Object.fromEntries(Object.entries(active?.state.base_prices||legacyPrices).map(([k,v])=>[k,v+(k==='entry'?0:5*Number(active?.state.blowup_count||0))]));
 const labels={entry:'Confirm entry',reroll:'Random respin',lock:'Lock squad',unlock:'Unlock another squad',nuke:'Blow it up',spin:'Pairing spin',start:'Initial pairing started',sync:'Registrations refreshed',finalize:'Squads finalized',reset:'Practice reset',practice_entries:'Practice entries verified',bracket_saved:'Bracket generated'};
 let active=null,host=null,timer=null,inFlight=false,offset=0,busy=false,lastRevision=-1,spinId=null,spinTimer=null,retry=null,latestOK=0,wasSpinning=false;
 async function rpc(name,args){const c=db();if(!c)throw Error('Database connection unavailable.');const {data,error}=await c.rpc(name,args);if(data?.command_error){accept(data);throw Error(data.command_error);}if(error)throw Error(error.message+(error.code==='PGRST202'?' Run switch/migration.sql before testing.':''));return data;}
 const spectatorBracketUrl=(data,publicView)=>publicView&&!data.practice&&data.tournament_id&&data.state.phase==='finalized'&&data.state.bracket_generated?'/tournaments/bracket/?tournament='+encodeURIComponent(data.tournament_id):null;
 const now=()=>Date.now()+offset;
 const spinning=()=>active?.state.active_spin&&Date.parse(active.state.active_spin.ends_at)>now();
 const name=id=>active?.state.duos.find(d=>d.id===id)?.team_name||id||'Staff';
 function message(text,isError=false){const e=host?.querySelector('[data-sw-message]');if(e){e.textContent=text;e.className=isError?'sw-message sw-error':'sw-message';}else if(isError)alert(text);}
 function btn(action,text,extra=''){return `<button type="button" data-sw-action="${action}" ${extra}>${text}</button>`;}
 function accept(data){
    if(!data)return;
    offset=Date.parse(data.server_now)-Date.now();
    active=data;
    const destination = spectatorBracketUrl(data, host?.hasAttribute?.('data-switch-public'));
    if (destination) {
      clearInterval(timer);
      window.location.replace(destination);
      return true;
    }
    const isNewRev=(data.revision!==lastRevision);
    if(window.DuoSwitchEngine){
      window.DuoSwitchEngine.cachedRegs=data.state.duos;
      window.DuoSwitchEngine.currentSwitchState={
        teams:data.state.teams,
        duos:data.state.duos,
        unpaired:data.state.unpaired,
        reroll_base_fee:currentPrices().reroll,lock_fee:currentPrices().lock,unlock_fee:currentPrices().unlock,nuke_fee:currentPrices().nuke,blowup_count:data.state.blowup_count,
        status:data.state.phase==='finalized'?'locked':'open'
      };
      if(isNewRev){
        if(typeof window.DuoSwitchEngine.renderModalPanels==='function'){
          window.DuoSwitchEngine.renderModalPanels();
        }
        if(typeof window.DuoSwitchEngine.syncHistoryAlerts==='function'&&Array.isArray(data.history)){
          window.DuoSwitchEngine.syncHistoryAlerts(data.history);
        }
      }
    }
    latestOK=Date.now();
    if(isNewRev){render();lastRevision=data.revision;}
    showSpin();
    tick();
  }
 function tick(){if(!host)return;if(wasSpinning&&!spinning()){wasSpinning=false;render();return;}wasSpinning=!!spinning();const status=host.querySelector('[data-sw-connection]');if(status)status.textContent=Date.now()-latestOK<5000?'● Live · synced':'● Reconnecting · actions paused';host.querySelectorAll('[data-sw-command]').forEach(b=>{b.disabled=!!b.dataset.swIneligible||busy||!!retry||!!spinning()||Date.now()-latestOK>=5000;});const progress=host.querySelector('[data-sw-spin-status]');if(progress){const s=active?.state.active_spin;progress.textContent=spinning()?`Live spin · ${Math.max(0,Math.ceil((Date.parse(s.ends_at)-now())/1000))}s`:active?.state.last_spin||s?`Latest result: ${(s||active.state.last_spin).requesting_duo.team_name} + ${(s||active.state.last_spin).target_duo.team_name}`:'Ready for the next spin';}}
 let lastPoll = 0, lightweightPolling = true;
 async function poll(){
  if(inFlight||document.hidden||!host?.isConnected||!active||Date.now()-lastPoll<2000)return;
  lastPoll=Date.now();inFlight=true;
  try{
   let data;
   if(lightweightPolling){
    const result=await db().rpc('fcl_switch_poll',{p_id:active.id,p_revision:lastRevision});
    if(result.error){
     if(result.error.code==='PGRST202')lightweightPolling=false;else throw result.error;
    }else data=result.data;
   }
   if(!lightweightPolling)data=await rpc('fcl_switch_read',{p_id:active.id});
   if(data?.unchanged){latestOK=Date.now();offset=Date.parse(data.server_now)-Date.now();}
   else if(data)accept(data);
  }catch(e){message('Connection interrupted. Reconnecting; no action is assumed successful.',true);}
  finally{inFlight=false;tick();}
 }
 function showSpin(force=false){const s=active?.state.active_spin||active?.state.last_spin;if(!s||(!force&&spinId===s.id))return;spinId=s.id;clearTimeout(spinTimer);const wait=Date.parse(s.starts_at)-now();const start=()=>{if(!window.DuoSwitchEngine)return;window.DuoSwitchEngine.handleIncomingSpinBroadcast({...s,title:s.title,elapsed_ms:Math.max(0,now()-Date.parse(s.starts_at)),duration_ms:s.duration_ms});};if(wait>0)spinTimer=setTimeout(start,wait);else if(force||now()<Date.parse(s.ends_at))start();}
 function options(items,key,label){return items.map(x=>`<option value="${esc(x[key])}">${esc(label(x))}</option>`).join('');}
 function render(){if(!host||!active)return;const st={...active.state};if(spinning()){st.teams=active.state.active_spin.before_teams;st.unpaired=active.state.active_spin.before_unpaired;}const admin=active.can_admin&&host.dataset.swAdmin==='true';const done=st.phase==='finalized';const duos=st.duos;const waiting=st.unpaired.map(name);const count=duos.filter(d=>d.entry_verified).length;
 const prices=currentPrices();
 const publicLink=`/tournaments/switch/index.html?session=${encodeURIComponent(active.id)}`;
 const payment=active.practice?'Practice only · no money changes hands':'Verify payment in Cash App or PayPal before executing an action.';
 host.innerHTML=`<section class="sw-desk"><div class="sw-top"><div><span class="sw-kicker">FRONTLINE / ${active.practice?'PRACTICE SESSION':'SWITCH TOURNAMENT'}</span><h2>${esc(active.title)}</h2><p>${esc(phases[st.phase]||st.phase)}</p></div><span data-sw-connection role="status">● Live · synced</span></div>
 <div class="sw-stats"><span><b>${duos.length}</b> duos</span><span><b>${count}</b> entries verified</span><span><b>${st.teams.length}</b> squads</span><span><b>${st.teams.filter(t=>t.isLocked).length}</b> locked</span><span><b>${st.unpaired.length}</b> awaiting pairing</span></div>
 <div class="sw-wheel-bar"><div><b data-sw-spin-status></b><p>Partners are selected randomly. A respin excludes your current partner; a blow-up may reunite former partners.</p></div>${btn('watch','Watch wheel')}${admin?`<a href="${publicLink}" target="_blank" rel="noopener">Open spectator view ↗</a>`:''}</div>
 <div data-sw-message role="status" aria-live="polite"></div>
 ${admin?`<div class="sw-admin"><div class="sw-stage"><h3>Run the event</h3><p>${esc(payment)}</p><div class="sw-actions">${st.phase==='registration'?`${active.practice?btn('practice_entries','Verify all practice entries','data-sw-command'):''}${!active.practice?btn('sync','Refresh registrations','data-sw-command'):''}${btn('start','Close registration & begin pairing','data-sw-command')}`:''}${['pairing','repairing'].includes(st.phase)?btn('spin',`Spin next · ${esc(name(st.unpaired[0]))}`,'data-sw-command'):''}${st.phase==='window'?btn('finalize','Close purchase window & finalize squads','data-sw-command'):''}${done&&active.practice?btn('practice_bracket','Preview practice bracket','data-sw-command'):''}${done&&!active.practice?`${!st.bracket_generated?btn('bracket','Generate bracket from official squads','data-sw-command'):''}${btn('matches','Manage matches')}<a href="/tournaments/bracket/?tournament=${encodeURIComponent(active.tournament_id)}">View bracket ↗</a>`:''}${btn('practice','New practice session')}${active.practice?btn('reset','Reset this practice session','data-sw-command'):''}</div></div>
 ${['registration','window'].includes(st.phase)?`<form data-sw-payment><h3>${st.phase==='registration'?`Confirm a $${prices.entry} duo entry`:'Record payment & execute action'}</h3><div class="sw-form"><label>Purchasing duo<select name="duo_id" required>${options(st.phase==='registration'?duos.filter(d=>!d.entry_verified):duos,'id',d=>d.team_name)}</select></label>${st.phase==='window'?`<label>Action<select name="action"><option value="reroll">Random respin · $${prices.reroll}</option><option value="lock">Lock squad · $${prices.lock}</option><option value="unlock">Unlock another squad · $${prices.unlock}</option><option value="nuke">Blow it up · $${prices.nuke}</option></select></label><label data-sw-target hidden>Target squad to unlock<select name="target_id"><option value="">Choose a locked squad</option>${options(st.teams.filter(t=>t.isLocked),'id',t=>t.name)}</select></label>`:'<input type="hidden" name="action" value="entry">'}${!active.practice?`<label>Payment method<select name="method" required><option value="Cash App">Cash App</option><option value="PayPal">PayPal</option></select></label><label>Transaction reference (optional)<input name="reference" autocomplete="off" maxlength="120"></label>`:''}<label>Staff note (optional)<input name="note" maxlength="300" autocomplete="off"></label></div>${!active.practice?'<label class="sw-confirm"><input type="checkbox" name="payment_confirmed" required> I verified the correct payment, duo, and action externally.</label>':'<p class="sw-kicker">Fake payment · practice session only</p>'}<p data-sw-impact>Respin changes two unlocked squads: the displaced partners form the other squad.</p><button type="submit" data-sw-command ${st.phase==='registration'&&count===duos.length?'disabled':''}>${active.practice?'Simulate payment & execute':'Confirm verified payment & execute'}</button></form>`:''}</div>`:`<div class="sw-payment-info"><h3>${done?'Official squads':'How to purchase an action'}</h3>${done?'<p>The purchase window is closed.</p>':`<p>Pay using the league’s configured Cash App or PayPal. Include your <strong>duo name + action</strong>; for an unlock include the <strong>target squad</strong>. Staff verify payment and execute the action.</p><p>Entry $${prices.entry} · Respin $${prices.reroll} · Lock $${prices.lock} · Unlock $${prices.unlock} · Blow it up $${prices.nuke}. Every Nuke raises all four action prices by $5; entry stays $${prices.entry}. Only registered duos can purchase actions. Wait for staff to finish pairing before sending power-up payments.</p><div data-sw-pay-links></div>`}</div>`}
 ${waiting.length?`<section><h3>Awaiting pairing (${waiting.length})</h3><div class="sw-chips">${waiting.map(n=>`<span>${esc(n)}</span>`).join('')}</div></section>`:''}
 <section><h3>${done?'Official squads':'Current squads'}</h3><div class="sw-grid">${st.teams.map((t,i)=>`<article class="sw-squad ${t.isLocked?'sw-locked':''}"><div class="sw-kicker">SQUAD ${i+1} <span>${t.isLocked?'🔒 Protected':'Unlocked'}</span></div><h4>${esc(t.name)}</h4><p>${t.roster.map(r=>esc(typeof r==='object'?(r.gamertag||r.name):r)).join(' · ')}</p></article>`).join('')||'<p>Squads appear here as each wheel spin selects a partner.</p>'}</div></section>
 ${admin?`<details ${st.phase==='registration'?'open':''}><summary>Registered duos & entry payments</summary><div class="sw-grid">${duos.map(d=>`<article class="sw-squad"><h4>${esc(d.team_name)}</h4><p>${d.roster.map(r=>esc(typeof r==='object'?(r.gamertag||r.name):r)).join(' · ')}</p><b>${d.entry_verified?'✓ Entry verified':`$${prices.entry} entry awaiting verification`}</b>${d.roster.length!==2?'<p class="sw-error">Needs exactly two accepted players. Refresh after fixing registration.</p>':''}</article>`).join('')}</div></details>`:''}
 <details><summary>Activity history (${active.history.length}${active.history.length===100?'+':''})</summary><div class="sw-history">${active.history.map(h=>`<article><b>${h.status==='failed'?'FAILED · ':''}${esc(labels[h.action]||h.action)}</b> ${['entry','reroll','lock','unlock','nuke'].includes(h.action)?`· $${h.amount}`:''} · ${esc(h.summary?.purchaser||name(h.duo_id))}${h.summary?.partner?` → Random partner: ${esc(h.summary.partner)}`:''}${h.summary?.target_squad?` → ${esc(h.summary.target_squad)}`:h.target_id?` → ${esc(st.teams.find(t=>t.id===h.target_id)?.name||h.target_id)}`:''}<small>${esc(new Date(h.created_at).toLocaleString())}${h.method?` · ${esc(h.method)}`:''}${h.reference?` · Ref: ${esc(h.reference)}`:''}${h.actor?` · Staff: ${esc(h.actor)}`:''}${h.note?` · ${esc(h.note)}`:''}${h.error?` · ${esc(h.error)}`:''}</small></article>`).join('')||'<p>No actions yet.</p>'}</div></details></section>`;
 host.onclick=onClick;host.onsubmit=onSubmit;host.onchange=updateForm;
 updateForm();
 if(!admin&&!done)fillPaymentLinks();tick();
 }
 function updateForm(){const form=host?.querySelector('[data-sw-payment]');if(!form)return;const action=form.elements.action.value,buyer=form.elements.duo_id.value,st=active.state;const target=host.querySelector('[data-sw-target]');if(target){const select=target.querySelector('select'),previous=select.value;target.hidden=action!=='unlock';select.required=action==='unlock';select.innerHTML='<option value="">Choose a locked squad</option>'+options(st.teams.filter(t=>t.isLocked&&t.duo1_id!==buyer&&t.duo2_id!==buyer),'id',t=>t.name);select.value=previous;}
 const mine=st.teams.find(t=>t.duo1_id===buyer||t.duo2_id===buyer),unlocked=st.teams.filter(t=>!t.isLocked);let reason='';if(action==='entry'&&!buyer)reason='Every entry is already confirmed.';if(action==='reroll'&&(!mine||mine.isLocked||unlocked.length<2))reason='A respin requires your squad and at least one other squad to be unlocked.';if(action==='lock'&&(!mine||mine.isLocked))reason='The purchasing squad is already locked or has not been formed.';if(action==='unlock'&&!st.teams.some(t=>t.isLocked&&t.duo1_id!==buyer&&t.duo2_id!==buyer))reason='There is no other locked squad to unlock.';if(action==='nuke'&&unlocked.length<2)reason='A blow-up requires at least two unlocked squads.';
 const impact=host.querySelector('[data-sw-impact]');if(impact)impact.textContent=reason||{entry:`Confirm the $${currentPrices().entry} payment for this duo.`,reroll:'A random eligible duo becomes the new partner. The displaced partners form the other squad.',lock:'Protects both duos in the purchasing squad.',unlock:'Removes protection from the selected other squad.',nuke:'Dissolves every unlocked squad. Staff then spin the released duos into new squads.'}[action];form.querySelector('[type="submit"]').dataset.swIneligible=reason;tick();}
 async function fillPaymentLinks(){try{const c=await window.LeagueDB.getLeaguePaymentConfig();const tournaments=active.tournament_id?await window.LeagueDB.getTournaments({ summary: true }):[];const t=tournaments.find(t=>String(t.id)===String(active.tournament_id));if(t?.cashapp_tag)c.cashapp_url='https://cash.app/$'+encodeURIComponent(t.cashapp_tag.replace(/^\$/,''));if(t?.paypal_handle)c.paypal_me_url=/^https:\/\//i.test(t.paypal_handle)?t.paypal_handle:'https://paypal.me/'+encodeURIComponent(t.paypal_handle.replace(/^@/,''));const e=host?.querySelector('[data-sw-pay-links]');if(!e)return;for(const [label,url]of [['Cash App',c.cashapp_url],['PayPal',c.paypal_me_url]]){if(!url||!/^https:\/\/(cash\.app|paypal\.me|www\.paypal\.com)(\/|$)/i.test(url))continue;const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.textContent=label;e.append(a,document.createTextNode(' '));}}catch(_){}}
 async function command(action,args={}){
    if(busy)return;
    busy=true;tick();
    const op=retry||{p_id:active.id,p_action:action,p_args:args,p_operation:crypto.randomUUID(),p_revision:active.revision};
    try{
      const data=await rpc('fcl_switch_command',op);
      const charged=data?.history?.find(h=>h.id===op.p_operation)?.amount ?? currentPrices()[action];
      retry=null;
      accept(data);
      message(`${labels[action]||action} completed${charged?` · $${charged}`:''}.`);
      if(window.DuoSwitchEngine && ['reroll','lock','unlock','nuke'].includes(action)){
        const buyerName = name(args.duo_id);
        const targetSquad = args.target_id ? (active?.state?.teams?.find(t=>t.id===args.target_id)?.name || 'Target Squad') : (action==='nuke'?'All Unlocked Squads':'');
        window.DuoSwitchEngine.postActionAlert({
          id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2,5)}`,
          type: action,
          duo: buyerName,
          target: targetSquad,
          amount: charged || 0,
          created_at: new Date().toISOString()
        });
      }
    }catch(e){
      if(/fetch|network|timeout|connection/i.test(e.message)){
        retry=op;
        message('Connection lost. The action may have completed. Use “Check / retry last action” below; do not record the payment again.',true);
        const b=document.createElement('button');
        b.textContent='Check / retry last action';
        b.onclick=()=>command(op.p_action,op.p_args);
        host.querySelector('[data-sw-message]').append(document.createElement('br'),b);
      }else{
        retry=null;
        message(e.message,true);
        await poll();
      }
    }finally{
      busy=false;tick();
    }
  }
 async function onSubmit(e){if(!e.target.matches('[data-sw-payment]'))return;e.preventDefault();const f=new FormData(e.target),action=f.get('action'),args=Object.fromEntries(f);delete args.action;args.payment_confirmed=f.has('payment_confirmed');if(action!=='unlock')delete args.target_id;
 if(!confirm(`${active.practice?'PRACTICE: ':''}${labels[action]} · $${currentPrices()[action]}\nPurchaser: ${name(args.duo_id)}${action==='unlock'?`\nTarget: ${active.state.teams.find(t=>t.id===args.target_id)?.name||'Not selected'}`:''}\n\n${action==='nuke'?'Every unlocked squad will dissolve. Locked squads stay intact. All four action prices then increase by $5.':action==='reroll'?'The partner is random. Both affected squads will change.':'Apply this action?'}`))return;
 await command(action,args);}
 async function onClick(e){const b=e.target.closest('[data-sw-action]');if(!b||busy)return;const action=b.dataset.swAction;if(action==='watch'){showSpin(true);if(!active.state.active_spin&&!active.state.last_spin){window.DuoSwitchEngine?.openLiveWheelPreview();}return;}
 if(action==='practice'){try{const data=await rpc('fcl_switch_create',{p_tournament:null,p_practice:true});await mount(host,data.id,true,data);}catch(e){message(e.message,true);}return;}
 if(action==='practice_bracket'){busy=true;tick();try{const result=await window.LeagueDB.generateTournamentBracket(active.id,{practice:true,notifyCompetitors:false});if(!result.success)throw Error(result.error);const old=host.querySelector('[data-sw-bracket-preview]');if(old)old.remove();const preview=document.createElement('section');preview.dataset.swBracketPreview='true';preview.innerHTML='<h3>Practice bracket preview · no live tournament changed</h3>'+result.bracket.stages.map(stage=>'<details open><summary>'+esc(stage.name||stage.id)+'</summary>'+stage.rounds.map(round=>'<h4>'+esc(round.name||round.id)+'</h4>'+round.matches.map(m=>'<p>'+esc(m.code||m.id)+' · '+esc(m.team1.name)+' vs '+esc(m.team2.name)+'</p>').join('')).join('')+'</details>').join('');host.append(preview);preview.scrollIntoView({behavior:'smooth',block:'start'});}catch(e){message(e.message,true);}finally{busy=false;tick();}return;}
 if(action==='bracket'){busy=true;tick();try{const result=await window.LeagueDB.generateTournamentBracket(active.tournament_id,{replaceUnstartedBracket:true,finalizedTeams:active.state.teams,switchSessionId:active.id,notifyCompetitors:false});if(!result.success)throw Error(result.error);await poll();message('Official bracket generated. Use Manage matches when ready.');}catch(e){message('Bracket generation failed; squads remain finalized. '+e.message,true);}finally{busy=false;tick();}return;}
 if(action==='matches'){window._switchShowMatches=true;try{await window.adminManageBracket(active.tournament_id,active.title);}finally{window._switchShowMatches=false;}return;}
 if(['finalize','reset','start'].includes(action)&&!confirm({finalize:'Close purchases and make these squads official? This cannot be reopened.',reset:'Reset this practice session? Its history will remain.',start:'Close registration and begin initial pairing? All entries must be verified and rosters complete.'}[action]))return;
 await command(action);}
 async function mount(element,id,admin=false,data=null){clearInterval(timer);clearTimeout(spinTimer);host=element;active=null;host.dataset.swAdmin=String(admin);lastRevision=-1;wasSpinning=false;spinId=null;retry=null;host.innerHTML='<p>Connecting to the live Switch desk…</p>';
 try{let result=data||await rpc('fcl_switch_read',{p_id:String(id)});if(!result){host.innerHTML=admin?`<div class="sw-desk"><h2>Switch tournament setup</h2><p>Start with the current registrations. Entry payments will be confirmed in this desk.</p><button data-sw-create>Set up Switch desk</button><button data-sw-practice>Open practice session</button></div>`:'<p>Staff have not opened the Switch desk yet. This page will update automatically.</p>';
 if(admin){host.querySelector('[data-sw-create]').onclick=async()=>{try{const s=await rpc('fcl_switch_create',{p_tournament:String(id),p_practice:false});await mount(host,s.id,true,s);}catch(e){alert(e.message);}};host.querySelector('[data-sw-practice]').onclick=async()=>{try{const s=await rpc('fcl_switch_create',{p_tournament:null,p_practice:true});await mount(host,s.id,true,s);}catch(e){alert(e.message);}};}else{timer=setInterval(async()=>{if(inFlight||document.hidden||!host?.isConnected)return;inFlight=true;try{const s=await rpc('fcl_switch_read',{p_id:String(id)});if(s)await mount(host,s.id,false,s);}finally{inFlight=false;}},2000);}return;}
 if(accept(result))return;timer=setInterval(()=>{poll();tick();},1000);
 }catch(e){host.innerHTML=`<div class="sw-desk sw-error"><h2>Switch desk unavailable</h2><p>${esc(e.message)}</p><p>Staff: run switch/migration.sql and authorize your Supabase account as described in SWITCH_SETUP.md, then reload.</p></div>`;}}
 window.SwitchTournamentUI={mount,spectatorBracketUrl,async practice(){const modal=document.getElementById('modal-admin-bracket-manager'),element=document.getElementById('admin-bracket-matches-container');if(!modal||!element)return;document.getElementById('admin-bracket-controls').innerHTML='';document.getElementById('admin-bracket-modal-title').textContent='Switch practice';if(!modal.open)modal.showModal();element.innerHTML='<p>Creating isolated practice session…</p>';try{const data=await rpc('fcl_switch_create',{p_tournament:null,p_practice:true});await mount(element,data.id,true,data);}catch(e){element.textContent=e.message;}},async admin(element,tourney){await mount(element,String(tourney.id),true);}};
 // All Switch screens use the durable v2 state, never the legacy payment request flow.
 const engine=window.DuoSwitchEngine;
 if(engine){engine.connectRealtime=()=>{};engine.mountBracketDuoSwitchUI=async function(id,tourney){const el=document.getElementById(id);if(!el)return;if(!String(tourney.format||'').toLowerCase().includes('duo')){el.style.display='none';return;}el.style.display='block';await mount(el,String(tourney.id),false);};}
 const style=document.createElement('link');style.rel='stylesheet';style.href='/switch.css?v=2';document.head.append(style);
 const root=document.querySelector('[data-switch-public]');if(root){const p=new URLSearchParams(location.search),id=p.get('session')||p.get('tournament');if(id)mount(root,id);else root.textContent='Open this page using the tournament’s spectator link.';}
})();
