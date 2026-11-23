import {readFileSync,readdirSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
const types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',svg:'image/svg+xml'};
const assets=Object.fromEntries(readdirSync('public').filter(f=>types[f.split('.').pop()]).map(f=>['/'+f,{type:types[f.split('.').pop()],body:readFileSync('public/'+f,'utf8')}]));
rmSync('dist',{recursive:true,force:true});mkdirSync('dist/server',{recursive:true});mkdirSync('dist/.openai',{recursive:true});writeFileSync('dist/server/index.js','const ASSETS = '+JSON.stringify(assets)+';\n'+readFileSync('worker/index.js','utf8'));writeFileSync('dist/.openai/hosting.json',readFileSync('.openai/hosting.json'));
