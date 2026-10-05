/** Ponte privada de resposta: a interface permanece no GitHub Pages. */
function pagesRequest_(event) {
  var expected = PropertiesService.getScriptProperties().getProperty("SMARTDESK_PAGES_ORIGIN") || "https://andymarksss.github.io";
  if (!/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(expected)) return resposta_({ok:false,error:"Origem Pages não configurada."});
  var request, result;
  try {
    var input = event.parameter.smartdesk;
    if (typeof input !== "string" || input.length > 30 * 1024 * 1024) throw Error("Pedido inválido.");
    request = JSON.parse(input);
    if (request.protocol !== "smartdesk-pages-v1" || !/^[a-f0-9]{64}$/.test(request.id) || request.origin !== expected)
      throw Error("Origem não autorizada.");
    if (request.route === "/auth/login") {
      var login = smartdeskLogin(request.body?.password);
      result = {status: login.session ? 200 : 401, body:login};
    } else {
      result = smartdeskCall(request.body?.session, request.route, request.body?.payload);
    }
  } catch (error) {
    // Nunca refletir o pedido original, contatos, senha ou detalhes internos.
    if (!request || !/^[a-f0-9]{64}$/.test(request.id) || request.origin !== expected)
      return resposta_({ok:false,error:"Pedido não autorizado."});
    result = {status:400,body:{error:"Não foi possível processar este pedido."}};
  }
  var packet = JSON.stringify({protocol:"smartdesk-pages-v1",id:request.id,result:result}).replace(/</g,"\\u003c").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029");
  // Apenas a resposta técnica pode ser incorporada; nenhum chat/painel é servido pelo Google.
  return HtmlService.createHtmlOutput("<!doctype html><html><body><script>window.top.postMessage(" + packet + "," + JSON.stringify(expected) + ");</script></body></html>")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
