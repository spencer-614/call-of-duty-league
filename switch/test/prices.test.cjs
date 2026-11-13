const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
test('spectator, staff options, and wheel state use the same escalating prices',()=>{
 const source=fs.readFileSync('switch-client.js','utf8').replace(/\}\)\(\);\s*$/,`window.testAccept=(data,el)=>{host=el;accept(data);};})();`);
 const engine={renderModalPanels(){},syncHistoryAlerts(){}};
 const context={window:{DuoSwitchEngine:engine,LeagueDB:{getLeaguePaymentConfig:async()=>({})}},document:{createElement:()=>({}),head:{append(){}},querySelector:()=>null},Date,URLSearchParams,clearTimeout(){},setTimeout(){},alert(){}};
 vm.runInNewContext(source,context);
 const host={dataset:{},querySelector:()=>null,querySelectorAll:()=>[],innerHTML:''};
 for(const admin of [false,true])for(const n of [0,1,2,6]){
 host.dataset.swAdmin=String(admin);
 context.window.testAccept({id:'s',title:'Test',can_admin:admin,practice:true,revision:n+100*Number(admin),server_now:new Date().toISOString(),history:[],state:{phase:'window',duos:[],teams:[],unpaired:[],blowup_count:n}},host);
 for(const [label,base] of (admin?[['Random respin',10],['Lock squad',15],['Unlock another squad',15],['Blow it up',20]]:[['Respin',10],['Lock',15],['Unlock',15],['Blow it up',20]]))assert.ok(host.innerHTML.includes(`${label}${admin?' ·':''} $${base+5*n}`),label+' '+n);
 assert.equal(engine.currentSwitchState.nuke_fee,20+5*n);assert.equal(engine.currentSwitchState.unlock_fee,15+5*n);
 }
});
