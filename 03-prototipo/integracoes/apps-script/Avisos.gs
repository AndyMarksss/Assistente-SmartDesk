/**
 * Avisos por e-mail ao solicitante (0.13.0): o ticket na abertura e um aviso a cada mudança de
 * etapa. Só número, data, setor, pedido do catálogo e etapa — nunca nome, assunto ou descrição —,
 * para o site público não virar um meio de mandar qualquer texto, desta conta, a qualquer endereço.
 * Domínios fictícios dos testes nunca recebem. A aba Avisos guarda o resultado, sem o endereço.
 * Uma falha no aviso nunca impede o chamado nem a mudança de etapa.
 */
var AVISOS_SITE = "https://andymarksss.github.io/Assistente-SmartDesk/";
var AVISOS_CABECALHO = ["Data", "Chamado", "Aviso", "Resultado"];
// Os mesmos rótulos de LABELS em assets/js/chat-format.js.
var AVISOS_ROTULOS = {
  COMPUTADOR: "Computador",
  INTERNET: "Internet",
  INTRANET: "Intranet",
  "MENTOR WEB": "Mentor Web",
  QUICKBOOKS: "QuickBooks",
  CÂMERAS: "Câmeras",
};
var AVISOS_ETAPAS = {
  "Novos chamados": "na fila da equipe de TI",
  "Em atendimento": "a equipe de TI está cuidando do seu pedido",
  "Aguardando terceiros": "o atendimento depende de um fornecedor ou de outra equipe",
  Empréstimos: "o equipamento está emprestado",
  Agendado: "o atendimento tem data marcada",
  Finalizado: "o pedido foi concluído",
  Cancelado: "o pedido foi cancelado pela equipe",
};
// Domínios de exemplo e de teste: podem não existir ou pertencer a terceiros.
var AVISOS_FICTICIOS =
  /(^|\.)(example|exemplo|teste|test|invalid|localhost|instituicao|dominio)(\.[a-z]{2,})*$/;

/** Rodar uma vez no editor depois de publicar a 0.13.0: autoriza o envio e cria a aba Avisos. */
function autorizarAvisosPorEmail() {
  var props = PropertiesService.getScriptProperties();
  avisoRegistro_(SpreadsheetApp.openById(props.getProperty("SMARTDESK_SHEET_ID")));
  console.log("Avisos por e-mail autorizados. Envios restantes hoje: " + MailApp.getRemainingDailyQuota());
}

function avisoDominioFicticio_(email) {
  var domain = String(email).split("@").pop().trim().toLowerCase();
  return !domain || AVISOS_FICTICIOS.test(domain);
}

function avisoPedido_(area, need) {
  return [String(area)]
    .concat(String(need).split(">"))
    .map(function (part) {
      part = part.trim();
      return AVISOS_ROTULOS[part] || part;
    })
    .join(" › ");
}

function avisoHtml_(text) {
  return String(text).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/** Monta o e-mail: o mesmo conteúdo em texto e em HTML. */
function avisoMensagem_(chamado, etapa, abertura) {
  var quando = new Date(chamado.createdAt),
    aberto = isNaN(quando.getTime())
      ? ""
      : Utilities.formatDate(quando, "America/Sao_Paulo", "dd/MM/yyyy 'às' HH:mm"),
    linhas = [
      ["Chamado", chamado.number],
      ["Aberto em", aberto],
      ["Setor", chamado.sector],
      ["Pedido", avisoPedido_(chamado.area, chamado.need)],
      ["Etapa atual", etapa + " — " + (AVISOS_ETAPAS[etapa] || "situação informada pela equipe")],
    ].filter(function (linha) {
      return linha[1];
    }),
    titulo = abertura ? "Recebemos o seu chamado." : "O seu chamado mudou de etapa.",
    acompanhar =
      "Para acompanhar, abra o SmartDesk, toque em “Acompanhar um chamado” e informe o número " +
      chamado.number +
      " e este e-mail.",
    seguir = abertura ? "Você recebe um aviso sempre que o chamado mudar de etapa." : "",
    rodape =
      "Aviso automático da equipe de TI: não responda a este e-mail. Se você não abriu este chamado, ignore esta mensagem.";
  var texto =
    titulo +
    "\n\n" +
    linhas
      .map(function (linha) {
        return linha[0] + ": " + linha[1];
      })
      .join("\n") +
    "\n\n" +
    acompanhar +
    "\n" +
    AVISOS_SITE +
    (seguir ? "\n\n" + seguir : "") +
    "\n\n" +
    rodape;
  var html =
    '<div style="font-family:Arial,sans-serif;color:#1f2433;max-width:560px">' +
    '<p style="font-size:18px;font-weight:bold;color:#5b3fd0">' +
    avisoHtml_(titulo) +
    "</p>" +
    '<table style="border-collapse:collapse;font-size:15px">' +
    linhas
      .map(function (linha) {
        return (
          '<tr><td style="padding:4px 16px 4px 0;color:#5f6475">' +
          avisoHtml_(linha[0]) +
          '</td><td style="padding:4px 0;font-weight:bold">' +
          avisoHtml_(linha[1]) +
          "</td></tr>"
        );
      })
      .join("") +
    "</table>" +
    '<p style="font-size:15px">' +
    avisoHtml_(acompanhar) +
    '<br><a href="' +
    AVISOS_SITE +
    '">' +
    AVISOS_SITE +
    "</a></p>" +
    (seguir ? '<p style="font-size:15px">' + avisoHtml_(seguir) + "</p>" : "") +
    '<p style="font-size:12px;color:#5f6475">' +
    avisoHtml_(rodape) +
    "</p></div>";
  return {
    subject: abertura
      ? "Chamado " + chamado.number + " recebido — SmartDesk"
      : "Chamado " + chamado.number + ": " + etapa + " — SmartDesk",
    body: texto,
    htmlBody: html,
  };
}

function avisoRegistro_(book) {
  var sheet = book.getSheetByName("Avisos");
  if (!sheet) {
    sheet = book.insertSheet("Avisos");
    texto_(sheet.getRange(1, 1, 1, AVISOS_CABECALHO.length), AVISOS_CABECALHO);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Toda mudança de etapa avisa, inclusive a volta para "Em atendimento" depois de aguardar
// terceiros ou de um agendamento. Não repete a última etapa avisada (a abertura avisa "Novos
// chamados") e, como qualquer pessoa com o link do painel publicado move cartões, manda no
// máximo AVISOS_LIMITE_24H avisos do mesmo chamado em 24 horas, contando a abertura.
var AVISOS_LIMITE_24H = 10;
function avisoHistorico_(sheet, number) {
  var historico = { ultima: "", recentes: 0 },
    desde = Date.now() - 24 * 60 * 60 * 1000;
  if (sheet.getLastRow() < 2) return historico;
  sheet
    .getRange(2, 1, sheet.getLastRow() - 1, AVISOS_CABECALHO.length)
    .getValues()
    .forEach(function (r) {
      if (String(r[1]) !== number || r[3] !== "Enviado") return;
      historico.ultima = r[2] === "Abertura" ? "Novos chamados" : String(r[2]).replace("Etapa: ", "");
      if (Date.parse(String(r[0])) >= desde) historico.recentes++;
    });
  return historico;
}

/**
 * Envia o aviso e registra o resultado na aba Avisos. Devolve "sent", "skipped" ou "failed";
 * nunca lança. Chamar com o bloqueio do script já obtido (recebimento ou gestão).
 */
function avisarSolicitante_(book, chamado, etapa, abertura) {
  var email = String(chamado.email || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "skipped";
  var aviso = abertura ? "Abertura" : "Etapa: " + etapa,
    resultado = "Enviado",
    estado = "sent",
    registro = null,
    historico;
  try {
    registro = avisoRegistro_(book);
    if (!abertura) historico = avisoHistorico_(registro, chamado.number);
    if (avisoDominioFicticio_(email)) {
      resultado = "Não enviado: e-mail fictício";
      estado = "skipped";
    } else if (!abertura && historico.ultima === etapa) {
      return "skipped";
    } else if (!abertura && historico.recentes >= AVISOS_LIMITE_24H) {
      resultado = "Não enviado: limite de " + AVISOS_LIMITE_24H + " avisos do chamado em 24 horas";
      estado = "skipped";
    } else if (MailApp.getRemainingDailyQuota() < 1) {
      resultado = "Não enviado: cota de e-mails do dia esgotada";
      estado = "failed";
    } else {
      var mensagem = avisoMensagem_(chamado, etapa, abertura);
      MailApp.sendEmail({
        to: email,
        subject: mensagem.subject,
        body: mensagem.body,
        htmlBody: mensagem.htmlBody,
        name: "SmartDesk — TI",
      });
    }
  } catch (error) {
    // Sem o endereço nem o conteúdo no registro.
    console.error("SmartDesk: aviso por e-mail não enviado: " + error.name);
    resultado = "Não enviado: falha no envio";
    estado = "failed";
  }
  try {
    if (registro)
      texto_(registro.getRange(registro.getLastRow() + 1, 1, 1, AVISOS_CABECALHO.length), [
        new Date().toISOString(),
        chamado.number,
        aviso,
        resultado,
      ]);
  } catch (error) {
    console.error("SmartDesk: registro do aviso falhou: " + error.name);
  }
  return estado;
}
