"use strict";
window.SmartDesk = window.SmartDesk || {};
// Base parcial para testar o primeiro percurso. Conferir com a planilha antes da validação.
window.SmartDesk.knowledgeBase = {
  version: "0.1.0",
  source: "Exemplos mencionados no planejamento; matriz completa ainda pendente de importação.",
  units: ["Colégio Anglo Morumbi", "Start Anglo Panamby"],
  sectorExamples: ["Secretaria", "Financeiro", "Marketing", "Coordenação EI"],
  items: [
    { id: "printer-paper", area: "Impressora", need: "Papel atolado", keywords: ["papel atolado", "papel preso", "prendendo as folhas", "prende as folhas", "atolamento", "engasgando", "folhas presas"] },
    { id: "printer-toner", area: "Impressora", need: "Solicitação de Toner / Tinta", keywords: ["toner", "cartucho", "acabou tinta", "repor tinta", "reposição de tinta"] },
    { id: "printer-scanner", area: "Impressora", need: "Scanner não funciona", keywords: ["scanner", "escanear", "digitalizar", "não escaneia"] },
    { id: "printer-general", area: "Impressora", need: "Problema de impressão — confirmar detalhes", keywords: ["impressora", "imprimir", "impressão"], generic: true },
    { id: "av-hdmi", area: "Audiovisual", need: "Troca de cabo HDMI — confirmar causa", keywords: ["hdmi", "cabo do projetor"] },
    { id: "av-projector", area: "Audiovisual", need: "Projetor — confirmar solicitação ou falha", keywords: ["projetor", "projeção", "telão"], generic: true },
    { id: "av-audio", area: "Audiovisual", need: "Caixa de Som / Microfone — confirmar equipamentos", keywords: ["microfone", "caixa de som", "alto falante"] },
    { id: "google-gmail", area: "Google", need: "Gmail", keywords: ["gmail", "email google", "e mail google"] },
    { id: "google-drive", area: "Google", need: "Drive", keywords: ["drive", "google drive"] },
    { id: "google-sheets", area: "Google", need: "Planilhas", keywords: ["google planilhas", "sheets", "planilha google"] },
    { id: "ti-internet", area: "TI", need: "Internet", keywords: ["internet", "wifi", "wi fi", "sem conexão", "rede sem fio"] },
    { id: "ti-computer", area: "TI", need: "Computador — confirmar detalhes", keywords: ["computador", "notebook", "pc", "desktop"], generic: true },
    { id: "ti-quickbooks", area: "TI", need: "QuickBooks", keywords: ["quickbooks", "quick books"], sectors: ["Financeiro"] },
    { id: "ti-cameras", area: "TI", need: "Câmeras", keywords: ["câmera", "câmeras", "camera", "cameras"], sectors: ["Coordenação EI"] }
  ]
};
