"use strict";
(function (desk) {
  const byId = (id) => document.getElementById(id);
  const input = byId("chat-input");
  const choices = byId("choices");
  let generation = 0;
  let state;
  let textHandler = null;
  function scroll() { const log = byId("conversation"); log.scrollTop = log.scrollHeight; }
  function message(text, role = "assistant") {
    const article = document.createElement("article"); article.className = "message " + role;
    const avatar = document.createElement("span"); avatar.className = "message-avatar"; avatar.textContent = "✦"; avatar.setAttribute("aria-hidden", "true");
    const body = document.createElement("div"); body.className = "message-body";
    const meta = document.createElement("div"); meta.className = "message-meta"; meta.textContent = role === "user" ? "Você" : "SmartDesk";
    const bubble = document.createElement("div"); bubble.className = "message-bubble"; bubble.textContent = text;
    body.append(meta, bubble); article.append(avatar, body); byId("messages").append(article); scroll();
    return bubble;
  }
  function stage(name) {
    state.stage = name;
    desk.flows.stages.forEach((value, index) => {
      const element = document.querySelector('[data-stage="' + value + '"]');
      element.classList.toggle("done", index < desk.flows.stages.indexOf(name));
      if (value === name) element.setAttribute("aria-current", "step"); else element.removeAttribute("aria-current");
    });
  }
  function context() {
    byId("context-unit").textContent = state.unit || "Ainda não informada";
    byId("context-sector").textContent = state.sector || "Ainda não informado";
    byId("context-need").textContent = state.item?.need || state.manualArea || "Vamos descobrir juntos";
    byId("edit-context").hidden = !state.unit;
  }
  function lock(caption = "ESCOLHA UMA OPÇÃO PARA CONTINUAR") {
    textHandler = null; choices.replaceChildren(); input.disabled = true; input.value = "";
    input.placeholder = "Escolha uma das opções acima para continuar.";
    byId("composer").classList.add("locked"); byId("send").disabled = true;
    byId("prompt-caption").textContent = caption;
    byId("composer-hint").textContent = "A digitação é liberada quando precisamos de mais detalhes.";
    byId("char-count").hidden = true; byId("input-error").textContent = "";
  }
  function choose(options, callback, caption) {
    lock(caption);
    options.forEach((entry, index) => {
      const item = typeof entry === "string" ? { label: entry, value: entry } : entry;
      const button = document.createElement("button"); button.type = "button"; button.className = "choice" + (index === 0 ? " primary" : "");
      const icon = document.createElement("span"); icon.className = "choice-icon"; icon.textContent = item.icon || "↗"; icon.setAttribute("aria-hidden", "true");
      const text = document.createElement("span"); text.textContent = item.label; button.append(icon, text);
      button.addEventListener("click", () => { [...choices.children].forEach((child) => child.disabled = true); message(item.label, "user"); callback(item.value); });
      choices.append(button);
    });
  }
  function freeText(placeholder, callback, max = 2000, hint = "Enter para enviar · Shift + Enter para uma nova linha") {
    lock("AGORA, CONTE COM SUAS PALAVRAS");
    input.disabled = false; input.maxLength = max; input.placeholder = placeholder;
    byId("composer").classList.remove("locked"); byId("composer-hint").textContent = hint;
    byId("char-count").hidden = false; byId("char-count").textContent = "0 / " + max;
    textHandler = callback; input.focus();
  }
  function start() {
    generation++; state = { unit: "", sector: "", description: "", item: null, manualArea: "", location: "", name: "", email: "", extra: "", source: "local" };
    byId("messages").replaceChildren(); byId("welcome").hidden = false;
    byId("engine-badge").textContent = "Base local · demonstração";
    byId("engine-note").textContent = "IA ainda não conectada. Este percurso usa a base inicial de demonstração.";
    context(); stage("context");
    message("Sou o assistente do SmartDesk. Vou fazer uma pergunta por vez e te mostrar opções sempre que possível.\n\nPrimeiro: em qual unidade você está?");
    choose(desk.knowledgeBase.units.map((unit) => ({label:unit,value:unit,icon:"⌂"})), (unit) => { state.unit = unit; context(); askSector(); });
  }
  function askSector() {
    byId("welcome").hidden = true;
    message("Certo. E qual é o seu setor?");
    choose([...desk.flows.sectors, "Outro setor"], (sector) => {
      if (sector === "Outro setor") { message("Qual é o nome do setor?"); freeText("Digite o nome do seu setor…", finishSector, 100); }
      else finishSector(sector);
    });
  }
  function finishSector(sector) { state.sector = sector; context(); askReport(); }
  function askReport() {
    stage("report"); message("Agora me conte: o que está acontecendo ou do que você precisa?\n\nVocê não precisa escolher uma categoria. Eu te ajudo a encontrar o caminho.");
    freeText("Ex.: A impressora está prendendo as folhas…", async (description) => { state.description = description; state.item = null; state.manualArea = ""; await analyze(); });
  }
  async function analyze() {
    stage("classification"); lock("ENTENDENDO SUA SOLICITAÇÃO");
    input.placeholder = "Aguarde enquanto analiso o seu relato…";
    const token = generation;
    const bubble = message("Comparando seu relato com a base de atendimento…");
    bubble.closest(".message").classList.add("typing");
    const result = await desk.assistantEngine.analyze(state);
    if (token !== generation) return;
    bubble.closest(".message").remove();
    state.source = result.source;
    byId("engine-badge").textContent = result.source === "ai" ? "IA conectada" : "Base local · demonstração";
    byId("engine-note").textContent = result.source === "ai" ? "Sugestão da IA, limitada à base de atendimento. Confira antes de confirmar." : "IA ainda não conectada. Este percurso usa a base inicial de demonstração.";
    if (result.status === "suggested") {
      state.item = result.candidates[0].item; context();
      message("Pelo que você contou, sua solicitação parece ser:\n\n" + state.item.area + " → " + state.item.need + "\n\nEntendi corretamente?");
      choose([{label:"Sim, é isso",value:"yes",icon:"✓"}, {label:"Quero corrigir",value:"correct",icon:"↻"}, {label:"Explicar melhor",value:"rewrite",icon:"✎"}], (answer) => answer === "yes" ? askLocationType() : answer === "rewrite" ? askReport() : askArea());
    } else if (result.status === "ambiguous") {
      message("Encontrei mais de uma possibilidade no seu relato. Qual delas você quer tratar primeiro?");
      choose([...result.candidates.map((candidate) => ({label:candidate.item.area + " · " + candidate.item.need, value:candidate.item.id})), {label:"Nenhuma dessas",value:"other"}], (id) => id === "other" ? askArea() : selectItem(id));
    } else {
      message("Ainda não tenho uma correspondência segura na base inicial. Vamos afinar isso juntos.\n\nCom qual assunto sua necessidade está mais relacionada?");
      askArea(false);
    }
  }
  function askArea(withMessage = true) {
    if (withMessage) message("Sem problema. Qual assunto descreve melhor sua necessidade?");
    choose([...desk.flows.areas, "Não sei dizer"], (area) => {
      if (area === "Não sei dizer") { state.item = null; state.manualArea = "A confirmar pelo suporte"; context(); message("Tudo bem. Vou manter o relato original e marcar a classificação para revisão, sem escolher por você."); askLocationType(); return; }
      state.manualArea = area;
      const items = desk.knowledgeBase.items.filter((item) => item.area === area && desk.classifier.isAllowed(item, state.sector));
      message("E qual destas opções se aproxima mais do que você precisa?");
      choose([...items.map((item) => ({label:item.need,value:item.id})), {label:"Outra necessidade",value:"other"}], (id) => {
        if (id === "other") { state.item = null; context(); askLocationType(); } else selectItem(id);
      });
    });
  }
  function selectItem(id) { state.item = desk.knowledgeBase.items.find((item) => item.id === id && desk.classifier.isAllowed(item, state.sector)) || null; context(); askLocationType(); }
  function askLocationType() {
    if (state.location) return askIdentity();
    message("Entendido. Onde está acontecendo ou onde você precisa do atendimento?");
    choose(desk.flows.locationTypes, (type) => {
      message(type === "Sala de aula" ? "Qual é a sala? Se necessário, inclua o bloco ou andar." : "Informe o local ou a identificação do equipamento, se houver.");
      freeText("Ex.: Sala 12, bloco B…", (location) => { state.location = type + ": " + location; askIdentity(); }, 200);
    });
  }
  function askIdentity() {
    if (state.name && state.email) return showSummary();
    message("Já tenho o contexto. Para identificar este atendimento, como posso te chamar?");
    freeText("Seu nome…", (name) => { state.name = name; message("Obrigado, " + name + ". Qual é o seu e-mail institucional?"); freeText("Seu e-mail institucional…", (email) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Informe um e-mail válido, como nome@instituicao.com.br.";
      state.email = email; showSummary();
    }, 160, "Informe o e-mail institucional para o resumo do atendimento."); }, 100);
  }
  function summaryText() {
    return "SmartDesk — Resumo do atendimento\n\n" + [
      ["Nome",state.name],["E-mail",state.email],["Unidade",state.unit],["Setor",state.sector],
      ["Classificação",state.item ? state.item.area + " / " + state.item.need : state.manualArea + " / necessidade a confirmar"],
      ["Local",state.location],["Relato",state.description],["Detalhe adicional",state.extra || "Não informado"],
      ["Origem da análise",state.source === "ai" ? "IA conectada" : "Regras locais de demonstração"]
    ].map(([label,value]) => label + ": " + value).join("\n") + "\n\nResumo local do protótipo. Nenhum chamado foi enviado.";
  }
  function showSummary() {
    stage("summary");
    const bubble = message("Organizei o que você me contou. Confira o resumo abaixo.");
    const card = document.createElement("section"); card.className = "summary-card"; card.setAttribute("aria-label", "Resumo do atendimento");
    const title = document.createElement("h3"); title.textContent = "Seu atendimento, em um só lugar";
    const list = document.createElement("dl");
    [["Solicitante",state.name],["E-mail",state.email],["Unidade",state.unit],["Setor",state.sector],["Necessidade",state.item ? state.item.area + " · " + state.item.need : state.manualArea + " · a confirmar"],["Local",state.location],["Seu relato",state.description], ...(state.extra ? [["Mais detalhes",state.extra]] : [])].forEach(([label,value]) => {
      const dt = document.createElement("dt"); dt.textContent = label; const dd = document.createElement("dd"); dd.textContent = value; list.append(dt,dd);
    });
    card.append(title,list); bubble.append(card); scroll();
    choose([{label:"Baixar resumo",value:"download",icon:"↓"},{label:"Adicionar detalhe",value:"detail",icon:"＋"},{label:"Editar relato",value:"rewrite",icon:"✎"},{label:"Novo atendimento",value:"new",icon:"↗"}], (action) => {
      if (action === "new") return start();
      if (action === "rewrite") return askReport();
      if (action === "detail") { message("Qual detalhe você quer acrescentar?"); return freeText("Conte o detalhe que faltou…", (detail) => { state.extra = state.extra ? state.extra + "\n" + detail : detail; showSummary(); }); }
      const url = URL.createObjectURL(new Blob([summaryText()], {type:"text/plain;charset=utf-8"}));
      const link = document.createElement("a"); link.href = url; link.download = "smartdesk-resumo.txt"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      message("O resumo foi preparado para salvar no seu dispositivo. Nenhum chamado foi enviado ao suporte."); showSummary();
    }, "REVISE E ESCOLHA O PRÓXIMO PASSO");
  }
  byId("composer").addEventListener("submit", (event) => {
    event.preventDefault(); if (!textHandler || input.disabled) return;
    const value = input.value.trim();
    if (!value) { byId("input-error").textContent = "Escreva uma resposta para continuar."; input.focus(); return; }
    byId("input-error").textContent = "";
    const handler = textHandler;
    // Validate email before creating a user message or advancing the conversation.
    if (state.name && !state.email && input.maxLength === 160 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { byId("input-error").textContent = "Informe um e-mail válido, como nome@instituicao.com.br."; input.focus(); return; }
    message(value,"user"); lock(); const result = handler(value);
    if (typeof result === "string") { byId("input-error").textContent = result; }
  });
  input.addEventListener("input", () => { byId("send").disabled = input.disabled || !input.value.trim(); byId("char-count").textContent = input.value.length + " / " + input.maxLength; byId("input-error").textContent = ""; });
  input.addEventListener("keydown", (event) => { if (event.key === "Enter" && !event.shiftKey && !event.isComposing) { event.preventDefault(); byId("composer").requestSubmit(); } });
  byId("new-chat").addEventListener("click", start);
  byId("edit-context").addEventListener("click", () => { generation++; state.item = null; state.manualArea = ""; state.location = ""; stage("context"); message("Vamos ajustar o contexto. Qual é a unidade correta?"); choose(desk.knowledgeBase.units, (unit) => { state.unit = unit; context(); askSector(); }); });
  start();
})(window.SmartDesk);
