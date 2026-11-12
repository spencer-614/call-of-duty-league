import {db,rpc,el,node,date,notify,signedIn} from './shared.js';
let busy=false, user, draft=null;
async function refresh() {
 user=await signedIn();el('signed-out').hidden=!!user;el('content').hidden=!user;
 if(!user){notify('Sign in to request your season rank.');return;}
 const s=await rpc('fcl_my_ranking');el('content').hidden=false;
 el('season').textContent=s.season_name||'No active season';
 const pending=s.requests.find(r=>r.status==='pending');
 el('state-title').textContent=s.ranked?'You have already been ranked':pending?'Your placement is under review':'Ready for your placement?';
 el('state-description').textContent=!s.season_id?'Ranking requests will open once staff create an active season.':pending?'Your request is pending. Check back here for the decision.':s.ranked?'You can request a re-rank using the form below.':'Tell the ranking team about your experience and upload your account screenshot.';
 el('placement-section').hidden=!s.season_id||s.ranked||!!pending;el('rerank-section').hidden=!s.season_id||!s.ranked||!!pending;
 const history=el('history');history.replaceChildren();
 for(const r of s.requests){const row=node('div',undefined,'request');row.append(node('strong',r.kind==='placement'?'Placement request':'Re-rank request'),document.createTextNode(' '),node('span',r.status,`badge ${r.status}`),node('p',`Submitted ${date(r.created_at)}${r.reviewed_at?` · Reviewed ${date(r.reviewed_at)}`:''}`));history.append(row);}
 if(!s.requests.length)history.append(node('p','No requests this season yet.'));
 notify('Your ranking status is up to date.');
}
function validateFile(file,required=false){if(!file?.size){if(required)throw Error('Choose your account screenshot.');return;}if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('Use PNG, JPG, or WebP screenshots.');if(file.size>8388608)throw Error('Each screenshot must be 8 MB or smaller.');}
async function upload(file,key){if(!file?.size)return null;if(draft.paths[key])return draft.paths[key];const ext={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'}[file.type];const path=`${user.id}/${draft.id}/${crypto.randomUUID()}.${ext}`;const {error}=await db.storage.from('ranking-evidence').upload(path,file,{contentType:file.type,upsert:false});if(error)throw Error(`Screenshot upload failed: ${error.message}`);draft.paths[key]=path;return path;}
for(const kind of ['placement','rerank']){const form=el(kind);form.addEventListener('input',()=>{if(!busy)draft=null;});form.addEventListener('submit',async event=>{
 event.preventDefault();if(busy)return;
 busy=true;const button=form.querySelector('button');button.disabled=true;const controls=[...form.elements];controls.forEach(c=>c.disabled=true);
 try{
  user=await signedIn();if(!user)throw Error('Sign in again before submitting.');
  // Disabled controls are read directly to preserve their values during upload.
  const answers={};const fields=kind==='placement'?['peak_rank','average_rank','other_leagues','self_placement']:['requested_rank','reason'];for(const field of fields){answers[field]=form.elements.namedItem(field).value.trim();if(!answers[field])throw Error('Complete every required answer.');}
  let accountFile,rankFile;if(kind==='placement'){accountFile=el('account-image').files[0];rankFile=el('rank-image').files[0];validateFile(accountFile,true);validateFile(rankFile);}
  draft??={id:crypto.randomUUID(),paths:{}};notify('Submitting your request. Keep this page open…');
  const account=await upload(accountFile,'account'),rank=await upload(rankFile,'rank');
  await rpc('fcl_submit_ranking',{request_id:draft.id,request_kind:kind,form_answers:answers,account_path:account,rank_path:rank});draft=null;form.reset();await refresh();notify('Request submitted. The ranking team can now review it.');
 }catch(error){notify(error.message);}finally{busy=false;controls.forEach(c=>c.disabled=false);button.disabled=false;}
 });}
el('refresh').onclick=()=>{if(!busy)refresh().catch(e=>notify(e.message));};
refresh().catch(error=>notify(error.message));
