const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
function setup(pathname='/tournaments/') {
 let answer=null,error=null;
 const nodes={},appended=[],events={};
 const document={body:{innerHTML:'',append:x=>appended.push(x)},title:'',addEventListener:(n,f)=>events[n]=f,querySelector:()=>null,createElement:()=>({}),getElementById:id=>nodes[id]};
 const window={supabaseClient:{rpc:async()=>({data:answer,error})}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'switch-public.js'),'utf8'),{window,document,location:{pathname},console:{warn(){}}});
 return {api:window.SwitchPublic,nodes,document,appended,events,set:(phase,extra={})=>{answer={id:'session-1',practice:false,state:{phase,...extra}};error=null;},fail:()=>{error={message:'offline'};}};
}
const t={id:'tourney &1',format:'Duo Switch (All Modes)',status:'Registration Open'};
test('Switch card follows durable registration, pairing, purchases, repair and final bracket phases',async()=>{
 const s=setup();s.set('registration');await s.api.refresh([t]);assert.equal(s.api.action(t),null);
 for(const phase of ['pairing','window','repairing','finalized']){
  s.set(phase);await s.api.refresh([t]);const a=s.api.action(t);
  assert.equal(a.label,'Watch Live Wheel Spins');assert.equal(a.href,'/tournaments/switch/index.html?tournament=tourney%20%261');
 }
 s.set('finalized',{bracket_generated:true});await s.api.refresh([t]);assert.equal(s.api.action(t).kind,'bracket');
 assert.equal(s.api.action({...t,format:'4v4 CDL Variant'}),null);
});
test('refresh updates open details and a network error retains last known closed-registration state',async()=>{
 const s=setup();s.set('pairing');assert.equal(await s.api.refresh([t]),true);assert.equal(await s.api.refresh([t]),false);
 s.nodes['modal-detail-bracket-link']={style:{}};s.nodes['modal-detail-register-btn']={style:{}};
 s.api.updateDetails(t);assert.equal(s.nodes['modal-detail-register-btn'].style.display,'none');assert.equal(s.nodes['modal-detail-bracket-link'].textContent,'Watch Live Wheel Spins');
 s.fail();await s.api.refresh([t]);assert.equal(s.api.action(t).kind,'wheel');
 assert.equal(s.api.spectatorUrl('session &1',true),'/tournaments/switch/index.html?session=session%20%261');
});
test('hub fallback at an old spectator URL mounts the read-only spectator screen',()=>{
 const s=setup('/tournaments/switch/');s.events.DOMContentLoaded();assert.equal(s.api.isSpectatorRoute,true);
 assert.match(s.document.body.innerHTML,/data-switch-public/);assert.match(s.appended[0].src,/switch-client.js/);
 const hub=setup();hub.events.DOMContentLoaded();assert.equal(hub.appended.length,0);
});
test('spectator directory, explicit index and clean server routes serve the actual spectator page',async()=>{
 const express=require('express'),app=express();
 const serverText=fs.readFileSync(path.join(root,'server.js'),'utf8');
 const routes=vm.runInNewContext(serverText.match(/const HIERARCHY_ROUTES = ([\s\S]*?);/)[1]);
 for(const r of routes)app.get([r.path,r.path+'/'],(_,res)=>res.sendFile(path.join(root,r.file)));
 app.use(express.static(root));const server=app.listen(0);await new Promise(r=>server.once('listening',r));
 try{for(const p of ['/tournaments/switch/','/tournaments/switch','/tournaments/switch/index.html']){
  const res=await fetch('http://127.0.0.1:'+server.address().port+p+'?session=test');assert.equal(res.status,200);assert.match(await res.text(),/data-switch-public/);
 }}finally{await new Promise(r=>server.close(r));}
});
