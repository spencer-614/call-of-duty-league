const fs=require('node:fs'),path=require('node:path');
const page=path.join(__dirname,'arena/8s/index.html');
if(!fs.existsSync(page))throw Error('Run this installer from the WEBSITE root containing arena/8s/index.html.');
const old=fs.readFileSync(page,'utf8');
if(!old.includes('arena/8s/bridge/')){
 const backup=page+'.before-discord-bridge.bak';if(!fs.existsSync(backup))fs.copyFileSync(page,backup);
 fs.writeFileSync(page,'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Arena 8s</title><meta http-equiv="refresh" content="0;url=/arena/8s/bridge/"></head><body><a href="/arena/8s/bridge/">Open Arena 8s</a></body></html>');
 console.log('Arena 8s now opens the shared Discord queue. Original page backed up locally.');
}else console.log('Arena bridge already installed.');
const profile=path.join(__dirname,'arena/profile/index.html');
if(fs.existsSync(profile)){
 const s=fs.readFileSync(profile,'utf8');
 if(!s.includes('/arena/8s/bridge/profile.js')){
  if(!fs.existsSync(profile+'.before-arena8.bak'))fs.copyFileSync(profile,profile+'.before-arena8.bak');
  fs.writeFileSync(profile,s.replace(/<\/body>/i,'<script src="/arena/8s/bridge/profile.js?v=1" defer></script>\n</body>'));
 }
}
