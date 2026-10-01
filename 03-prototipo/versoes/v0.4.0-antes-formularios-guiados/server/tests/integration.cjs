const assert=require('node:assert/strict');
const root=require('node:path').resolve(__dirname,'../..');
const {createServer}=require(root+'/server/server.cjs');
const {createProvider}=require(root+'/server/ai-provider.cjs');
const fs=require('node:fs');
let count=0;
async function run(adapter,test){const server=createServer(adapter);await new Promise(r=>server.listen(0,'127.0.0.1',r));try{await test('http://127.0.0.1:'+server.address().port);}finally{await new Promise(r=>server.close(r));}}
const body={description:'Minha impressora está prendendo as folhas.',sector:'Secretaria'};
const post=(url,data=body,headers={})=>fetch(url+'/api/analyze',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(data)});
const check=(actual,expected)=>{assert.deepEqual(actual,expected);count++;};
(async()=>{
 await run({name:'test-local',ready:()=>false},async url=>{
  check((await(await fetch(url+'/api/status')).json()).aiReady,false);
  check((await(await post(url)).json()).candidates[0].item.id,'printer-paper');
  check((await(await post(url,{...body,description:'QuickBooks'})).json()).status,'unknown');
  check((await post(url,{...body,description:''})).status,400);
  check((await post(url,body,{Origin:'https://example.com'})).status,403);
  for(const file of ['/.env','/.env.example','/server/ai-provider.cjs','/versoes/v0.2.0-antes-temas-gemini/index.html'])check((await fetch(url+file)).status,404);
  for(const file of ['/assets/js/theme.js','/assets/vendor/fontawesome/css/solid.min.css','/assets/vendor/fontawesome/webfonts/fa-solid-900.woff2'])check((await fetch(url+file)).status,200);
 });
 let seen;
 const adapter=createProvider({env:{GEMINI_API_KEY:'TEST_NOT_REAL',GEMINI_MODEL:'gemini-3.5-flash-lite'},fetchImpl:async(url,init)=>{seen={url,init};return {ok:true,json:async()=>({candidates:[{content:{parts:[{text:JSON.stringify({itemIds:['printer-paper']})}]}}]})};}});
 await run(adapter,async url=>{check((await(await post(url,{...body,name:'Fictional',email:'fictional@example.com',unit:'unused'})).json()).source,'ai');});
 const payload=JSON.parse(seen.init.body);const sent=JSON.parse(payload.contents[0].parts[0].text);
 check(Object.keys(sent).sort(),['categorias','relato','setor']);check(sent.categorias.some(x=>x.id==='ti-quickbooks'),false);
 check(seen.init.headers['x-goog-api-key'],'TEST_NOT_REAL');check(seen.url.includes('?'),false);
 await run({name:'invalid',ready:()=>true,analyze:async()=>({itemIds:['ti-quickbooks']})},async url=>check((await(await post(url)).json()).fallback,true));
 await run({name:'quota',ready:()=>true,analyze:async()=>{throw new Error('429')}},async url=>check((await(await post(url)).json()).source,'local'));
 check(createProvider({env:{}}).ready(),false);
 check(/Colégio Anglo|Start Anglo/.test(fs.readFileSync(root+'/assets/js/knowledge-base.js','utf8')),false);
 console.log(count+' verificações concluídas; Gemini simulado, nenhuma chave real ou chamada externa.');
})().catch(e=>{console.error(e);process.exitCode=1});
