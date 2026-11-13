const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');const root=path.resolve(__dirname,'../..');
const load=(f,ctx)=>vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);
class El{
 constructor(tag='div'){this.tag=tag;this.childNodes=[];this.style={};this.dataset={};this._text='';this.value='';}
 append(...x){this.childNodes.push(...x);}replaceChildren(...x){this.childNodes=x;}get textContent(){return this._text+this.childNodes.map(x=>x.textContent||'').join('');}set textContent(v){this._text=v;this.childNodes=[];}set innerHTML(v){this._html=v;this.childNodes=[];}get innerHTML(){return this._html||'';}closest(){return null;}
}
const find=(el,p)=>[...(p(el)?[el]:[]),...el.childNodes.flatMap(x=>find(x,p))];
test('chat uses authenticated Rez and matching registrations despite cached commissioner identity',async()=>{
 const user={id:'rez-id',user_metadata:{gamertag:'Rez'}};const window={supabaseClient:{auth:{getUser:async()=>({data:{user}})}}};
 load('tournament-chat-identity.js',{window,localStorage:{getItem:()=>JSON.stringify({id:'spencer-id',gamertag:'Commissioner Spencer'})}});
 const me=await window.TournamentChatIdentity.current();assert.equal(me.id,'rez-id');assert.equal(me.gamertag,'Rez');
 const regs=[{registered_by:'rez-id',captain_gamertag:'Rez'}];
 assert.equal(window.TournamentChatIdentity.author({sender_id:'rez-id',sender_name:'Commissioner Spencer'},regs),'Rez');
 assert.equal(window.TournamentChatIdentity.name({id:'someone',user_metadata:{gamertag:'SpencerFan'}}),'SpencerFan');
});
test('only public real sessions redirect to the generated bracket, including a late arrival',async()=>{
 const urls=[];const data={id:'s',tournament_id:'t &1',practice:false,server_now:new Date().toISOString(),state:{phase:'finalized',bracket_generated:true}};
 const window={location:{replace:u=>urls.push(u)},supabaseClient:{rpc:async()=>({data})}};
 load('switch-client.js',{window,document:{querySelector:()=>null,createElement:()=>({}),head:{append(){}}},clearInterval(){},clearTimeout(){},setInterval(){throw Error('No polling after navigation');},setTimeout(){},URLSearchParams,location:{search:''}});
 const host=new El();host.hasAttribute=()=>true;await window.SwitchTournamentUI.mount(host,'s');assert.equal(urls[0],'/tournaments/bracket/?tournament=t%20%261');
 const destination=window.SwitchTournamentUI.spectatorBracketUrl;
 assert.equal(destination(data,false),null);assert.equal(destination({...data,practice:true},true),null);assert.equal(destination({...data,state:{phase:'finalized',bracket_generated:false}},true),null);
});
test('overlapping reporting mounts commit one team-labelled form and submit a winner without a screenshot',async()=>{
 let release;const first=new Promise(r=>release=r);let count=0;const saved=[];
 const match={id:'m',team1:{name:'Alpha',score:0},team2:{name:'Bravo',score:0},status:'Scheduled'};
 const client={auth:{getUser:async()=>({data:{user:{id:'rez'}}})},rpc:async()=>({data:++count===1?await first:{match,ready:true,admin:false}}),from:table=>({select(){const q={eq(){return q;},then(resolve){resolve({data:table==='tournament_report_members'?[{user_id:'rez',team:2}]:[]});}};return q;},upsert:async row=>{saved.push(row);return{data:null};}})};
 const window={supabaseClient:client,dispatchEvent(){},addEventListener(){},removeEventListener(){}};
 load('tournament-reports.js',{window,document:{createElement:t=>new El(t)},CustomEvent:class{},alert:m=>{throw Error(m)},crypto:{randomUUID:()=> 'op'}});
 const target=new El();const a=window.TournamentReports.mount(target,'t',match);await new Promise(r=>setImmediate(r));await window.TournamentReports.mount(target,'t',match);
 release({match,ready:true,admin:false});await a;
 assert.equal(find(target,x=>x.tag==='h3').length,1);assert.match(target.textContent,/You are reporting for: Bravo/);assert.equal(find(target,x=>x.type==='file').length,0);
 const select=find(target,x=>x.tag==='select')[0];select.value='2';await find(target,x=>x.tag==='button'&&x.textContent==='Submit map')[0].onclick();
 assert.equal(saved.length,1);assert.equal(saved[0].winner,2);assert.equal(saved[0].team,2);assert.equal(saved[0].screenshot,null);assert.equal(find(target,x=>x.tag==='h3').length,1);
});
test('SQL accepts reports without screenshots and keeps unrelated constraints',async()=>{
 const {PGlite}=require('@electric-sql/pglite');const db=new PGlite();await db.exec("create table tournament_map_reports(id int, screenshot text not null check(screenshot <> ''),winner int check(winner in (1,2)));");
 await db.exec(fs.readFileSync(path.join(root,'repairs/optional-map-screenshots.sql'),'utf8'));
 await db.exec('insert into tournament_map_reports values(1,null,1)');await assert.rejects(db.exec('insert into tournament_map_reports values(2,null,8)'));await db.close();
});
test('the actual chat send method replaces stale caller identity with the authenticated account',async()=>{
 const source=fs.readFileSync(path.join(root,'supabase.js'),'utf8');const a=source.indexOf('  async sendTournamentMatchChat('),b=source.indexOf('\n  },',a)+5;
 const window={dispatchEvent(){}};load('tournament-chat-identity.js',{window});
 const dbClient={auth:{getUser:async()=>({data:{user:{id:'rez',user_metadata:{gamertag:'Rez'}}}})}};
 const service=vm.runInNewContext('({'+source.slice(a,b)+'})',{window,dbClient,localStorage:{setItem(){}},CustomEvent:class{}});
 Object.assign(service,{_getMatchChatRowId:()=> 'chat',getTournamentRegistrations:async()=>[{registered_by:'rez',captain_gamertag:'Rez'}],getMyStaffAccess:async()=>({is_admin:false}),getTournamentMatchChat:async()=>[],_upsertMatchChatRemote:async()=>true});
 const res=await service.sendTournamentMatchChat({tournamentId:'t',matchId:'m',senderId:'old-staff-id',senderName:'Commissioner Spencer',senderRole:'staff',message:'Hi'});
 assert.equal(res.message.sender_id,'rez');assert.equal(res.message.sender_name,'Rez');assert.equal(res.message.sender_role,'combatant');
});
