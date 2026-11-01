const {spawnSync}=require('node:child_process');
const path=require('node:path');
const r=spawnSync(process.execPath,['--test',path.join(__dirname,'database.test.cjs')],{stdio:'inherit',env:{...process.env,LEAGUE_TEST_TRANSPORT:'edge'}});
process.exit(r.status??1);
