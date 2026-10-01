"use strict";
function createStorage({env=process.env,fetchImpl=globalThis.fetch}={}){
 const config=()=>({url:String(env.SMARTDESK_APPS_SCRIPT_URL||'').trim(),token:String(env.SMARTDESK_APPS_SCRIPT_TOKEN||'').trim()});
 const ready=()=>{const c=config();return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(c.url)&&c.token.length>=32;};
 return {ready,async submit(ticket){if(!ready())throw Error('Recebimento não configurado');const {url,token}=config();const response=await fetchImpl(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,ticket}),redirect:'follow',signal:AbortSignal.timeout(55000)});if(!response.ok)throw Error('Recebimento indisponível');let output;try{output=await response.json();}catch{throw Error('Resposta de implantação inválida');}if(!output.ok||!/^#\d{3,}$/.test(output.number)||output.requestId!==ticket.requestId)throw Error('Recebimento não confirmado');return {number:output.number,requestId:output.requestId,attachmentCount:Number(output.attachmentCount)||0,status:'enviado'};}};
}
module.exports=createStorage();module.exports.createStorage=createStorage;
