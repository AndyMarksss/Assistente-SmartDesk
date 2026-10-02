"use strict";
const fs=require('node:fs/promises'),path=require('node:path');
const STAGES=['Novos chamados','Em atendimento','Aguardando terceiros','Empréstimos','Agendado','Finalizado','Cancelado'];
function createManagement({root,json,storage=require('./google-storage.cjs')}){
 const file=path.join(root,'server/data/gestao-simulada.json');let serial=Promise.resolve();
 async function demo(){try{return JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;return [];}}
 async function write(rows){await fs.mkdir(path.dirname(file),{recursive:true});const temp=file+'.tmp';await fs.writeFile(temp,JSON.stringify(rows,null,2));await fs.rename(temp,file);}
 async function cloud(action,payload={}){return storage.manage(action,payload);}
 return async(req,res,url)=>{
  if(!url.pathname.startsWith('/api/admin/'))return false;
  try{
   if(req.method==='GET'&&url.pathname==='/api/admin/tickets'){
    const mode=url.searchParams.get('mode')||'demo';if(!['demo','google'].includes(mode))throw Error('Modo inválido.');
    const tickets=mode==='demo'?await demo():(await cloud('listTickets')).tickets;
    json(res,200,{tickets,stages:STAGES,mode});return true;
   }
   if(req.method!=='POST'||!String(req.headers['content-type']||'').startsWith('application/json')){json(res,405,{error:'Operação não permitida.'});return true;}
   const chunks=[];let size=0;for await(const c of req){size+=c.length;if(size>8192)throw Error('Pedido muito grande.');chunks.push(c);}const body=JSON.parse(Buffer.concat(chunks));
   if(!['demo','google'].includes(body.mode))throw Error('Selecione a origem dos dados.');
   if(url.pathname==='/api/admin/seed'&&body.mode==='demo'){
    const job=serial.then(async()=>{let rows=await demo();if(!rows.length){const subjects=['Projetor sem imagem','Impressora não imprime','Acesso ao Gmail','Conexão instável','Reserva de microfone','Toner magenta','Computador lento','Acesso ao Drive','Notebook para apresentação','Projetor para evento','Papel atolado','Dúvida no sistema'];rows=subjects.map((subject,i)=>({number:'#SIM-'+String(i+1).padStart(3,'0'),requestId:'sim-'+(i+1),name:'Pessoa fictícia '+(i+1),email:'pessoa'+(i+1)+'@example.com',sector:['Secretaria','Financeiro','TI','Marketing'][i%4],area:['Audiovisual','Impressora','Google','TI'][[0,1,2,3,0,1,3,2,3,0,1,3][i]],need:subject,subject,description:'Chamado simulado para demonstração do painel: '+subject+'.',status:STAGES[i%7],createdAt:new Date(Date.now()-(i+1)*3600000*5).toISOString(),answers:{},attachments:[],simulation:true}));await write(rows);}return rows;});serial=job.catch(()=>{});json(res,200,{tickets:await job,mode:'demo'});return true;
   }
   if(url.pathname==='/api/admin/status'){
    if(!STAGES.includes(body.status)||typeof body.requestId!=='string'||body.requestId.length>100)throw Error('Etapa ou chamado inválido.');
    if(body.mode==='google'){const result=await cloud('updateStatus',{requestId:body.requestId,status:body.status,expectedStatus:body.expectedStatus});json(res,200,result);return true;}
    const job=serial.then(async()=>{const rows=await demo(),item=rows.find(t=>t.requestId===body.requestId);if(!item)throw Error('Chamado não encontrado.');if(body.expectedStatus&&body.expectedStatus!==item.status)throw Error('Etapa alterada em outra tela. Atualize o painel.');item.status=body.status;item.updatedAt=new Date().toISOString();await write(rows);return item;});serial=job.catch(()=>{});json(res,200,{ok:true,ticket:await job});return true;
   }
   json(res,404,{error:'Operação não encontrada.'});return true;
  }catch{json(res,502,{error:'Não foi possível concluir. Para dados Google, atualize o Apps Script com Gestao.gs e a nova versão de Código.gs. Para conflito de etapa, atualize o painel.'});return true;}
 };
}
module.exports={createManagement,STAGES};
