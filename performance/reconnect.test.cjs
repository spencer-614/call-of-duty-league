const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const source=fs.readFileSync('switch-client.js','utf8');
function setup(handler){
 let time=100000;const calls=[];const notice={textContent:'',className:''};
 const host={isConnected:true,querySelector:()=>notice};
 const ctx=vm.createContext({Date:{now:()=>time,parse:Date.parse},AbortController,setTimeout,clearTimeout,console:{warn(){}},document:{hidden:false},host,active:{id:'s',revision:3},lastRevision:3,latestOK:time,offset:0,inFlight:false,tick(){},
 db:()=>({rpc:(name,args)=>({abortSignal:async signal=>{calls.push(name);return handler(name,args,signal);}})}),
 message:(text)=>{notice.textContent=text;}});
 ctx.accept=data=>{ctx.latestOK=time;ctx.active=data;};
 vm.runInContext(source.slice(source.indexOf(' function connectionState()'),source.indexOf(' function tick()')),ctx);
 vm.runInContext(source.slice(source.indexOf(' let lastPoll ='),source.indexOf(" document.addEventListener?.('visibilitychange'")),ctx);
 return {ctx,calls,notice,time:t=>{time=t;},poll:()=>vm.runInContext('poll()',ctx),state:()=>vm.runInContext('connectionState()',ctx)};
}
test('brief delay shows syncing, prolonged loss pauses actions; unchanged read restores health',async()=>{
 const s=setup(()=>({data:{unchanged:true,server_now:new Date(106000).toISOString()}}));
 s.time(106000);assert.equal(s.state().stale,false);assert.match(s.state().label,/Syncing/);
 s.time(116000);assert.equal(s.state().stale,true);await s.poll();assert.equal(s.state().stale,false);assert.match(s.state().label,/Live/);
});
test('missing lightweight function falls back immediately and subsequent polls use full reader',async()=>{
 const s=setup(name=>name==='fcl_switch_poll'?{error:{code:'42883',message:'function missing'}}:{data:{id:'s',revision:3}});
 await s.poll();assert.deepEqual(s.calls,['fcl_switch_poll','fcl_switch_read']);s.time(103000);await s.poll();assert.equal(s.calls.at(-1),'fcl_switch_read');assert.equal(s.calls.length,3);
});
test('transient poll errors fall back; full failure exposes reason and next success clears it',async()=>{
 let failing=true;
 const s=setup(name=>failing?{error:{message:name==='fcl_switch_poll'?'poll failure':'database unavailable'}}:{data:{unchanged:true,server_now:new Date(103000).toISOString()}});
 await s.poll();assert.match(s.notice.textContent,/database unavailable/);assert.equal(s.ctx.inFlight,false);
 failing=false;s.time(103000);await s.poll();assert.equal(s.notice.textContent,'');assert.equal(s.calls.at(-1),'fcl_switch_poll');
});
test('hidden tabs do not request data',async()=>{
 const s=setup(()=>{throw Error('should not fetch');});s.ctx.document.hidden=true;await s.poll();assert.equal(s.calls.length,0);
});
test('a stalled read aborts and releases the poll for recovery',async()=>{
 const s=setup((name,args,signal)=>new Promise(resolve=>signal.addEventListener('abort',()=>resolve({error:{message:'read timed out'}}),{once:true})));
 s.ctx.setTimeout=fn=>setTimeout(fn,1);
 await s.poll();assert.equal(s.ctx.inFlight,false);assert.match(s.notice.textContent,/timed out/);
});
