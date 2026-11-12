// Run once from the WEBSITE project: node install-ranking.cjs
// Only adds a script tag; preserves all other contents of existing pages.
const fs=require('node:fs'),path=require('node:path');
const root=__dirname,tag='<script src="/ranking/navigation.js?v=1" defer></script>';
for(const rel of ['admin/index.html','profile/index.html']){
 const file=path.join(root,rel);
 if(!fs.existsSync(file)){console.log(`Skipped missing ${rel}; add a link to /${rel.startsWith('admin')?'admin/ranking':'ranking'}/ manually.`);continue;}
 const source=fs.readFileSync(file,'utf8');
 if(source.includes('/ranking/navigation.js')){console.log(`Already linked: ${rel}`);continue;}
 if(!/<\/body>/i.test(source))throw Error(`No closing body tag: ${rel}`);
 if(!fs.existsSync(file+'.before-ranking.bak'))fs.copyFileSync(file,file+'.before-ranking.bak');
 fs.writeFileSync(file,source.replace(/<\/body>/i,tag+'\n</body>'));
 console.log(`Added ranking navigation: ${rel}`);
}
