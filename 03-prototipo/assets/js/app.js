"use strict";
(function (desk) {
  if (window.smartdeskWrongRuntime) return;
  const F = desk.chatFormat,
    copy = desk.conversationCopy,
    policy = desk.requestPolicy,
    metrics = desk.sessionMetrics;
  const byId = (id) => document.getElementById(id),
    input = byId("chat-input"),
    choices = byId("choices");
  let state,
    generation = 0,
    textHandler = null,
    validator = null,
    saving = false,
    controlVersion = 0,
    history = [];
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const AREA_DESCRIPTIONS = {
    Audiovisual: "Projetor, som, microfone e cabo HDMI.",
    Impressora: "Impressão, papel, toner e tinta.",
    Google: "Gmail, Drive e ferramentas do Google.",
    TI: "Computador, internet, sistemas e acessórios.",
  };
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const icon = (name) => {
    const i = el("i", "fa-solid " + name);
    i.setAttribute("aria-hidden", "true");
    return i;
  };

  // --- Infraestrutura da conversa ---------------------------------------------------------
  const readyControls = (render) => {
    const token = controlVersion,
      g = generation;
    messages.whenReady(() => {
      if (g === generation && token === controlVersion) {
        render();
        dock.style.removeProperty("min-height");
        scroll();
      }
    });
  };
  function checkpoint(render) {
    history.push({
      render,
      state: {
        ...state,
        answers: { ...state.answers },
        prefilled: { ...state.prefilled },
        attachments: [...state.attachments],
        followUps: state.followUps.map((entry) => ({ ...entry })),
        review: state.review && { ...state.review },
      },
    });
  }
  function back() {
    if (saving || history.length < 2) return;
    metrics.back();
    generation++;
    messages.cancel();
    history.pop();
    const previous = history.pop();
    state = previous.state;
    context();
    previous.render();
  }
  const dock = choices.closest(".interaction-dock");
  const follower = desk.chatView.createScrollFollower({
    viewport: byId("conversation"),
    content: byId("messages"),
    dock,
  });
  const scroll = follower.schedule;
  const messages = desk.chatView.createMessageStream({
    container: byId("messages"),
    scroll,
    reducedMotion: reduced,
  });
  const message = (text, role, options) => {
    if (role === "user") follower.follow();
    return messages.append(text, role, options);
  };
  const aiMessage = (text, ai = true) => message(text, "assistant", { ai });
  const thinking = (text) => message(text, "assistant", { thinking: true, ai: true });
  function stage(value) {
    state.stage = value;
    const index = desk.flows.stages.indexOf(value);
    document
      .querySelector(".journey-bar")
      ?.style.setProperty("--progress", (index / (desk.flows.stages.length - 1)) * 100 + "%");
    desk.flows.stages.forEach((name, i) => {
      const node = document.querySelector('[data-stage="' + name + '"]');
      node.classList.toggle("done", i < index);
      const dot = node.querySelector(".journey-dot");
      dot.textContent = i < index ? "✓" : String(i + 1);
      dot.setAttribute("aria-hidden", "true");
      node.setAttribute(
        "aria-label",
        i +
          1 +
          ". " +
          ["Boas-vindas", "Escolhas", "Revisão", "Enviado"][i] +
          (i < index ? " — concluída" : name === value ? " — etapa atual" : " — próxima etapa"),
      );
      if (name === value) node.setAttribute("aria-current", "step");
      else node.removeAttribute("aria-current");
    });
  }
  function context() {
    byId("context-name").textContent = state.name || "Vamos nos conhecer";
    byId("context-email").textContent = state.email || "Ainda não informado";
    byId("context-sector").textContent = state.sector || "Ainda não informado";
    byId("context-need").textContent = state.item
      ? F.needLabel(state.item)
      : state.area || "Vamos descobrir juntos";
    byId("edit-context").hidden = !state.sector;
  }
  // Caixa de texto cresce até 3 linhas visíveis; depois rola por dentro.
  function autoGrow() {
    input.style.height = "auto";
    const style = getComputedStyle(input),
      line = parseFloat(style.lineHeight) || 22,
      limit = line * 3 + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    input.style.height = Math.min(input.scrollHeight, limit) + "px";
    input.style.overflowY = input.scrollHeight > limit ? "auto" : "hidden";
  }
  function lock(caption = "ESCOLHA UMA OPÇÃO PARA CONTINUAR") {
    // Keep the response area stable while replies are queued; release after controls render.
    dock.style.minHeight =
      Math.min(
        dock.getBoundingClientRect().height,
        byId("chat-shell")?.clientHeight * 0.48 || window.innerHeight * 0.48,
      ) + "px";
    dock.setAttribute("aria-busy", "false");
    document.querySelector(".submission-error")?.remove();
    controlVersion++;
    textHandler = null;
    validator = null;
    choices.replaceChildren();
    choices.classList.remove("with-text");
    byId("structured-field").replaceChildren();
    byId("structured-field").classList.remove("structured-temporal", "structured-picker");
    byId("attachment-panel").hidden = true;
    input.disabled = true;
    input.value = "";
    autoGrow();
    input.placeholder = "Campo pausado — use as opções acima.";
    byId("frozen-label").hidden = false;
    byId("edit-context").hidden = history.length < 2 || saving || state.stage === "sent";
    byId("composer").classList.add("locked");
    byId("send").disabled = true;
    byId("prompt-caption").textContent = caption;
    byId("composer-hint").textContent = "A digitação é liberada apenas para os dados do chamado.";
    byId("char-count").hidden = true;
    byId("input-error").textContent = "";
    byId("composer").classList.remove("invalid");
    input.setAttribute("aria-invalid", "false");
    byId("restart-chat").hidden = !history.length || saving || state.stage === "sent";
  }
  function choiceButton(entry, index, onPick) {
    const item = typeof entry === "string" ? { label: entry, value: entry } : entry;
    const button = el(
      "button",
      "choice" + (item.primary ? " primary" : "") + (item.className ? " " + item.className : ""),
    );
    button.type = "button";
    button.style.setProperty("--option-delay", index * 70 + "ms");
    const text = el("span", "", item.label);
    if (item.description) {
      button.classList.add("area-choice");
      text.append(el("small", "", item.description));
    }
    button.append(icon(item.icon || "fa-arrow-right"), text);
    button.addEventListener("click", () => {
      if (saving) return;
      choices.querySelectorAll("button").forEach((node) => (node.disabled = true));
      message(item.label, "user");
      onPick(item.value);
    });
    return button;
  }
  function choose(options, callback, caption) {
    lock(caption);
    readyControls(() => {
      options.forEach((entry, index) => choices.append(choiceButton(entry, index, callback)));
      requestAnimationFrame(scroll);
    });
  }
  // Texto livre, com respostas rápidas opcionais ao lado (ex.: "Não sei o modelo").
  function freeText(
    placeholder,
    callback,
    max = 1000,
    validation = null,
    prefill = "",
    quick = [],
  ) {
    lock("PREENCHA ESTE DADO DO CHAMADO");
    readyControls(() => {
      byId("frozen-label").hidden = true;
      input.disabled = false;
      input.inputMode = placeholder.includes("e-mail") ? "email" : "text";
      input.setAttribute("autocapitalize", placeholder.includes("e-mail") ? "none" : "sentences");
      input.maxLength = max;
      input.placeholder = placeholder;
      input.value = prefill;
      autoGrow();
      byId("composer").classList.remove("locked");
      byId("send").disabled = !prefill.trim();
      byId("composer-hint").textContent = "Enter para enviar · Shift + Enter para uma nova linha";
      byId("char-count").hidden = false;
      byId("char-count").textContent = input.value.length + " / " + max;
      textHandler = callback;
      validator = validation;
      if (quick.length) {
        choices.classList.add("with-text");
        quick.forEach((entry, index) =>
          choices.append(
            choiceButton({ ...entry, className: "quick-reply" }, index, (value) => {
              lock();
              callback(value);
            }),
          ),
        );
      }
      input.focus();
    });
  }
  const { structured, comboBox } = desk.formControls.create({
    policy,
    byId,
    lock,
    readyControls,
    message,
    scroll,
  });
  async function api(route, data) {
    const token = generation;
    const result = await desk.api.request(route, {
      body: data,
      timeout: route === "/api/tickets" ? 65000 : 20000,
    });
    if (
      token === generation &&
      ["/api/subject", "/api/assist", "/api/analyze", "/api/extract"].includes(route)
    )
      setAiStatus(result.source === "ai");
    return result;
  }
  const fullDescription = () => F.composeDescription(state.description, state.followUps);
  const selectionPayload = () => ({
    sector: state.sector,
    selectionId: state.item.id,
    answers: state.answers,
    description: fullDescription(),
    equipmentIntent: state.equipmentIntent || "",
  });
  function setAiStatus(value) {
    const status = value === true ? "online" : value === false ? "unavailable" : value;
    byId("ai-dot").className =
      "online-dot ai-dot " +
      (status === "online"
        ? "online"
        : ["busy", "standby"].includes(status)
          ? "standby"
          : "offline");
    document.body.classList.toggle("ai-busy", status === "busy");
    const label =
      {
        online: "IA conectada",
        busy: "IA organizando seu chamado",
        standby: "IA pronta para ajudar",
        unavailable: "IA indisponível",
        absent: "IA ausente",
      }[status] || "IA ausente";
    byId("ai-status").textContent = label;
    byId("engine-badge").textContent = label;
  }
  async function refreshStatus() {
    const token = generation;
    try {
      const status = await desk.api.request("/api/status");
      if (token !== generation) return;
      setAiStatus(
        status.aiState || (status.aiOnline ? "online" : status.aiReady ? "standby" : "absent"),
      );
      state.ticketsReady = status.ticketsReady === true;
      if (status.limits) desk.attachments.configure(status.limits);
      byId("engine-note").textContent = status.ticketsReady
        ? "Confira os dados antes de enviar. Seu e-mail ficará registrado para o retorno."
        : "O atendimento está disponível. O envio aguarda conexão com o Google.";
    } catch {
      setAiStatus("absent");
      byId("engine-note").textContent = window.smartdeskRemote
        ? "Não consegui confirmar a conexão. Tente novamente em instantes."
        : "Abra o SmartDesk em http://127.0.0.1:4173/ com o servidor iniciado.";
    }
  }

  // --- Início, identificação e acompanhamento --------------------------------------------
  function start() {
    if (saving) return;
    metrics.reset();
    follower.reset();
    dock.style.removeProperty("min-height");
    generation++;
    messages.cancel();
    history = [];
    state = {
      requestId: crypto.randomUUID(),
      name: "",
      email: "",
      sector: "",
      area: "",
      item: null,
      answers: {},
      prefilled: {},
      description: "",
      followUps: [],
      attachments: [],
      subject: "",
      source: "local",
      review: null,
      fromDescribe: false,
      selfHelp: "",
    };
    byId("new-chat").hidden = true;
    byId("mobile-new-chat").hidden = true;
    byId("messages").replaceChildren();
    byId("welcome").hidden = false;
    byId("attachment-input").value = "";
    context();
    stage("context");
    refreshStatus();
    message("Olá! Sou o assistente do SmartDesk. Vamos organizar seu atendimento juntos?");
    offerStart();
  }
  function offerStart() {
    const known = F.profile.read();
    if (known && !state.name) {
      const bubble = message("");
      bubble.append(document.createTextNode("Que bom te ver de novo, "));
      bubble.append(el("strong", "", known.name.split(/\s+/)[0]));
      bubble.append(
        document.createTextNode(
          "! Seus dados estão salvos neste dispositivo. Quer usá-los para pular as perguntas de nome, e-mail e setor?",
        ),
      );
      // Mostra a pergunta mesmo com a abertura grande na tela.
      follower.follow();
    }
    choose(
      [
        ...(known && !state.name
          ? [
              {
                label: "Continuar como " + known.name.split(/\s+/)[0],
                value: "known",
                primary: true,
                icon: "fa-user-check",
              },
              { label: "Sou outra pessoa", value: "other", icon: "fa-user-pen" },
            ]
          : [{ label: "Sim, vamos começar", value: "start", primary: true }]),
        { label: "Acompanhar um chamado", value: "track", icon: "fa-magnifying-glass" },
        { label: "Como funciona?", value: "how", icon: "fa-circle-question" },
      ],
      (answer) => {
        if (answer === "track") return askTrack();
        if (answer === "how") {
          message(
            "Eu te acompanho uma pergunta por vez. Primeiro, seu nome, e-mail institucional e setor. Depois, você escolhe o tipo de ajuda pelos botões ou conta com suas palavras: a IA monta um rascunho do chamado para você conferir.",
          );
          message(
            "Só pergunto o que faltar. Antes de enviar, a IA pode pedir um detalhe e, em defeitos simples, sugerir passos seguros para tentar. Você confere tudo no resumo e recebe um número para acompanhar o chamado depois.",
          );
          message(
            "Para melhorar o atendimento, guardo de forma anônima as etapas e o tempo de cada atendimento — sem nome, e-mail ou o que você escreveu.",
          );
          return offerStart();
        }
        byId("welcome").hidden = true;
        metrics.begin();
        if (answer === "known") {
          Object.assign(state, { name: known.name, email: known.email, sector: known.sector });
          metrics.update({ stage: "identificação" });
          context();
          message("Perfeito! Seus dados estão no resumo ao lado.");
          return askArea();
        }
        if (answer === "other") {
          F.profile.clear();
          message("Tudo bem! Apaguei os dados salvos neste dispositivo.");
        }
        askName();
      },
    );
  }
  function askTrack() {
    byId("welcome").hidden = true;
    checkpoint(askTrack);
    message(
      "Vamos consultar seu chamado. Qual é o número dele? Ele aparece no comprovante, por exemplo #012.",
    );
    freeText(
      "Número do chamado, ex.: #012",
      (value) => askTrackEmail(value.trim()),
      12,
      (value) => (/^#?\s*\d{1,6}$/.test(value.trim()) ? null : "Informe só o número, como #012."),
    );
  }
  function askTrackEmail(number) {
    checkpoint(() => askTrackEmail(number));
    message("E qual e-mail você usou ao abrir o chamado? Ele confirma que o chamado é seu.");
    const known = state.email || F.profile.read()?.email;
    freeText(
      "E-mail usado na abertura…",
      (email) => lookupTicket(number, email.trim().toLowerCase()),
      160,
      (value) => (EMAIL.test(value.trim()) ? null : "Confira o e-mail."),
      "",
      known ? [{ label: "Usar " + known, value: known, icon: "fa-user" }] : [],
    );
  }
  const TRACK_STEPS = [
    ["Recebido", ["Novos chamados"]],
    ["Em andamento", ["Em atendimento", "Aguardando terceiros", "Empréstimos", "Agendado"]],
    ["Finalizado", ["Finalizado"]],
  ];
  function trackCard(ticket) {
    const card = el("section", "receipt-card track-card");
    card.setAttribute("aria-label", "Situação do chamado " + ticket.number);
    const top = el("div", "receipt-top");
    top.append(
      el("small", "", "Chamado"),
      el("strong", "receipt-number", ticket.number),
      el("span", "track-status", ticket.status),
    );
    const need = el("p", "track-need", ticket.area + " · " + ticket.need);
    const steps = el("ol", "receipt-steps");
    const current = TRACK_STEPS.findIndex(([, list]) => list.includes(ticket.status));
    TRACK_STEPS.forEach(([label], index) => {
      const li = el("li", index <= current ? "done" : "");
      li.append(
        icon(index <= current ? "fa-check" : "fa-circle"),
        document.createTextNode(" " + label),
      );
      steps.append(li);
    });
    const opened = Date.parse(ticket.createdAt);
    const note = el(
      "p",
      "receipt-note",
      ticket.status === "Cancelado"
        ? "Este chamado foi cancelado pela equipe."
        : Number.isNaN(opened)
          ? "Situação atual informada pela equipe."
          : "Aberto em " + new Date(opened).toLocaleDateString("pt-BR") + ".",
    );
    card.append(top, need, steps, note);
    return card;
  }
  async function lookupTicket(number, email) {
    lock("CONSULTANDO SEU CHAMADO");
    const token = generation,
      wait = thinking("Consultando o chamado…");
    let ticket = null,
      problem = "";
    try {
      ticket = (await api("/api/track", { number, email })).ticket;
    } catch (error) {
      problem = error.message;
    }
    messages.dismiss(wait);
    if (token !== generation) return;
    if (ticket) message("Encontrei seu chamado:").append(trackCard(ticket));
    else
      message(
        problem ||
          "Não encontrei um chamado com esse número e esse e-mail. Confira os dados no comprovante.",
      );
    choose(
      [
        { label: "Abrir um novo chamado", value: "new", icon: "fa-plus", primary: !ticket },
        { label: "Consultar outro chamado", value: "again", icon: "fa-magnifying-glass" },
      ],
      (value) => (value === "again" ? askTrack() : beginTicket()),
      "O QUE VOCÊ QUER FAZER AGORA?",
    );
  }
  function beginTicket() {
    const known = F.profile.read();
    metrics.begin();
    if (state.name && state.email && state.sector) {
      metrics.update({ stage: "identificação" });
      return askArea();
    }
    if (known) {
      Object.assign(state, { name: known.name, email: known.email, sector: known.sector });
      metrics.update({ stage: "identificação" });
      context();
      message("Vou usar os dados salvos neste dispositivo.");
      return askArea();
    }
    askName();
  }
  function askName() {
    checkpoint(askName);
    message("Vamos começar por você: qual é seu nome e sobrenome?");
    freeText(
      "Seu nome e sobrenome…",
      (name) => {
        state.name = name.trim();
        context();
        const bubble = message("");
        bubble.append(document.createTextNode("Prazer, "));
        bubble.append(el("strong", "", state.name.split(/\s+/)[0]));
        bubble.append(document.createTextNode("! Vamos cuidar disso juntos."));
        askEmail();
      },
      100,
      (value) =>
        policy.fullName(value)
          ? null
          : "Informe seu nome e sobrenome, como você usa no trabalho. Acentos, hífens e apóstrofos são aceitos.",
      state.name,
    );
  }
  function askEmail() {
    checkpoint(askEmail);
    message("Qual é o seu e-mail institucional? Vamos guardá-lo para o retorno deste chamado.");
    freeText(
      "Seu e-mail institucional…",
      (email) => {
        state.email = email.trim().toLowerCase();
        context();
        askSector();
      },
      160,
      (value) =>
        EMAIL.test(value.trim())
          ? null
          : "Esse e-mail parece incompleto. Confira o nome, o @ e o domínio (ex.: nome@instituicao.com.br).",
      state.email,
    );
  }
  function askSector() {
    checkpoint(askSector);
    stage("context");
    message("Agora, em qual setor você trabalha?");
    comboBox(
      "Seu setor",
      desk.flows.sectors.map((value) => ({ value, icon: F.sectorIcon(value) })),
      (sector) => {
        state.sector = sector;
        metrics.update({ stage: "identificação" });
        context();
        askArea();
      },
      { placeholder: "Digite ou escolha seu setor, ex.: secretaria" },
    );
  }

  // --- Caminho: escolhas da matriz ou relato livre com IA ---------------------------------
  function askArea() {
    checkpoint(askArea);
    stage("report");
    message("Qual tipo de ajuda você precisa? Escolha a área ou conte com suas palavras.");
    choose(
      [
        ...desk.flows.areas.map((area) => ({
          label: area,
          value: area,
          description: AREA_DESCRIPTIONS[area],
          icon: F.AREA_ICONS[area],
        })),
        {
          label: "Descrever com minhas palavras",
          value: "__describe",
          description: "Conte o que precisa; a IA monta o rascunho do chamado para você conferir.",
          icon: "fa-wand-magic-sparkles",
          className: "ai-choice",
        },
      ],
      (area) => {
        if (area === "__describe") {
          metrics.chooseMethod("descrição");
          return askDescribe();
        }
        metrics.chooseMethod("botões");
        Object.assign(state, {
          area,
          item: null,
          answers: {},
          prefilled: {},
          equipmentIntent: "",
          authorization: null,
          subject: "",
          review: null,
          followUps: [],
          // Relato já contado continua valendo como descrição.
          description: state.fromDescribe ? state.description : "",
        });
        context();
        askPath([]);
      },
    );
  }
  function askPath(prefix) {
    checkpoint(() => askPath(prefix));
    const allowed = desk.knowledgeBase.items.filter(
      (item) =>
        item.area === state.area &&
        desk.classifier.isAllowed(item, state.sector) &&
        prefix.every((part, i) => item.path[i] === part),
    );
    const labels = [...new Set(allowed.map((item) => item.path[prefix.length]).filter(Boolean))];
    message(
      prefix.length
        ? "Dentro de " +
            prefix.map(F.displayLabel).join(" › ") +
            ", qual destas opções combina com o que está acontecendo?"
        : "Certo, vamos por " +
            state.area +
            ". Qual destas opções tem mais a ver com o que você precisa?",
    );
    choose(
      labels.map((label) => ({
        label: F.displayLabel(label),
        value: label,
        icon: F.iconFor(label, state.area),
      })),
      (value) => {
        const next = [...prefix, value],
          item = allowed.find(
            (entry) =>
              entry.path.length === next.length && next.every((part, i) => entry.path[i] === part),
          );
        if (!item) return askPath(next);
        selectItem(item);
        message(copy.opening(item));
        askEquipmentIntent();
      },
    );
  }
  function selectItem(item, { answers = {}, intent = "", prefilled = {} } = {}) {
    metrics.update({ stage: "caminho", path: item.id });
    Object.assign(state, {
      area: item.area,
      item,
      answers,
      prefilled,
      equipmentIntent: policy.asksEquipmentIntent(item) ? intent : "",
      authorization: null,
      subject: "",
      review: null,
      followUps: [],
    });
    context();
  }
  function askDescribe() {
    checkpoint(askDescribe);
    aiMessage(
      "Conte com suas palavras o que você precisa: o que aconteceu ou o que vai acontecer, quando e onde. Eu monto o rascunho do chamado e você confere antes de seguir.",
    );
    freeText(
      "Ex.: na sexta, às 9h, vou precisar de som e projetor no auditório…",
      (text) => suggestPaths(text.trim()),
      1500,
      (value) =>
        policy.usefulDescription(value)
          ? null
          : "Conte o que acontece ou o que precisa com algumas palavras.",
      state.fromDescribe ? state.description : "",
    );
  }
  async function suggestPaths(text) {
    // Reaproveita a última análise ao voltar uma etapa: sem nova chamada à IA.
    let result = state.suggestion?.text === text ? state.suggestion.result : null;
    if (!result) {
      setAiStatus("busy");
      lock("A IA ESTÁ LENDO SEU RELATO");
      const token = generation,
        wait = thinking("Lendo seu relato e procurando o tipo de atendimento…");
      try {
        result = await api("/api/analyze", { description: text, sector: state.sector });
      } catch {
        result = { ...desk.classifier.classify(text, state.sector), source: "local" };
        if (token === generation) refreshStatus();
      }
      messages.dismiss(wait);
      if (token !== generation) return;
      state.suggestion = { text, result };
    }
    state.description = text;
    state.fromDescribe = true;
    const items = [...new Set((result.candidates || []).map((candidate) => candidate?.item?.id))]
      .map((id) => desk.knowledgeBase.items.find((item) => item.id === id))
      .filter((item) => item && desk.classifier.isAllowed(item, state.sector))
      .slice(0, 3);
    if (!items.length) {
      metrics.update({ aiDraft: "não identificou" });
      message(
        "Não consegui identificar o tipo de atendimento só pelo relato. Vamos escolher juntos pelas opções — seu texto fica guardado como descrição.",
      );
      return askArea();
    }
    if (result.source !== "ai") {
      metrics.update({ aiDraft: "sem IA" });
      return pickLocalGuess(items);
    }
    buildDraft(items[0], items.slice(1), true);
  }
  // Sem IA, a base local só acha palavras parecidas (acertou 38% na avaliação): em vez de montar
  // um rascunho como se tivesse certeza, mostra as possibilidades para a pessoa escolher.
  function pickLocalGuess(items) {
    checkpoint(() => pickLocalGuess(items));
    message(
      "A IA está indisponível agora, então não consigo montar o rascunho sozinho. Pelas palavras do seu relato, pode ser um destes. Se nenhum servir, escolha pelas opções — seu texto fica guardado como descrição.",
    );
    choose(
      [
        ...items.map((item) => ({
          label: item.area + " › " + F.needLabel(item),
          value: item.id,
          icon: F.iconFor(item.need, item.area),
        })),
        { label: "Escolher pelas opções", value: "manual", icon: "fa-list" },
      ],
      (value) => {
        if (value === "manual") return askArea();
        const item = desk.knowledgeBase.items.find((entry) => entry.id === value);
        stage("report");
        selectItem(item);
        message(copy.opening(item));
        askEquipmentIntent();
      },
      "ESCOLHA O TIPO DE ATENDIMENTO",
    );
  }
  async function buildDraft(item, alternatives, fromAI) {
    setAiStatus("busy");
    lock("A IA ESTÁ MONTANDO O RASCUNHO");
    const token = generation,
      wait = thinking("Montando o rascunho do chamado com o que você contou…");
    let draft = { answers: {}, intent: "" };
    try {
      draft = await api("/api/extract", {
        sector: state.sector,
        selectionId: item.id,
        description: state.description,
      });
    } catch {
      if (token === generation) refreshStatus();
    }
    messages.dismiss(wait);
    if (token !== generation) return;
    const answers = draft.answers && typeof draft.answers === "object" ? draft.answers : {};
    selectItem(item, {
      answers: { ...answers },
      intent: draft.intent || "",
      prefilled: Object.fromEntries(Object.keys(answers).map((key) => [key, true])),
    });
    showDraft(alternatives, fromAI);
  }
  function draftCard() {
    const item = state.item,
      card = el("section", "summary-card draft-card");
    card.setAttribute("aria-label", "Rascunho do chamado");
    const head = el("header", "summary-head"),
      titles = el("div"),
      badge = el("span", "summary-ready");
    const tile = el("span", "summary-icon");
    tile.append(icon(F.iconFor(item.need, item.area)));
    titles.append(el("small", "", item.area), el("h3", "", F.needLabel(item)));
    badge.append(icon("fa-wand-magic-sparkles"), document.createTextNode(" Rascunho"));
    head.append(tile, titles, badge);
    const dl = el("dl");
    const row = (label, value, pending) => {
      const wrap = el("div", pending ? "pending" : "");
      wrap.append(el("dt", "", label), el("dd", "", pending ? "Vou perguntar" : value));
      dl.append(wrap);
    };
    if (policy.asksEquipmentIntent(item))
      row(
        "Tipo de pedido",
        state.equipmentIntent === "purchase"
          ? "Item novo ou diferente"
          : state.equipmentIntent === "repair"
            ? "Defeito no item que uso"
            : "",
        !state.equipmentIntent,
      );
    for (const field of item.fields || []) {
      if (field.id === "descricao-do-problema") continue;
      if (field.when && state.answers[field.when.field] !== field.when.equals) continue;
      const value = state.answers[field.id];
      row(field.label, F.formatValue(field, value), !value);
    }
    const story = el("div", "summary-description");
    story.append(
      el("small", "", "Seu relato (vai como descrição)"),
      el("p", "", state.description),
    );
    card.append(head, dl, story);
    return card;
  }
  function showDraft(alternatives = [], fromAI = true) {
    checkpoint(() => showDraft(alternatives, fromAI));
    stage("report");
    const filled = Object.keys(state.answers).length;
    aiMessage(
      filled
        ? "Montei este rascunho com o que você contou. Confira; o que estiver marcado como “Vou perguntar” eu pergunto em seguida."
        : "Pelo que você contou, este é o tipo de atendimento. Confira; os dados que faltam eu pergunto em seguida.",
      fromAI,
    ).append(draftCard());
    choose(
      [
        { label: "Está certo, continuar", value: "ok", icon: "fa-check", primary: true },
        ...(filled ? [{ label: "Corrigir os dados", value: "fix", icon: "fa-pen" }] : []),
        ...alternatives.map((item) => ({
          label: "Na verdade é: " + F.needLabel(item),
          value: "item:" + item.id,
          icon: F.iconFor(item.need, item.area),
        })),
        { label: "Escolher pelas opções", value: "manual", icon: "fa-list" },
      ],
      (value) => {
        if (value.startsWith("item:")) state.switchedDraft = true;
        metrics.update({
          aiDraft:
            value === "manual"
              ? "escolheu pelas opções"
              : value === "fix"
                ? "corrigiu os dados"
                : value.startsWith("item:") || state.switchedDraft
                  ? "trocou pelo sugerido"
                  : "aceito",
        });
        if (value === "manual") return askArea();
        if (value.startsWith("item:"))
          return buildDraft(
            desk.knowledgeBase.items.find((item) => item.id === value.slice(5)),
            alternatives.filter((item) => item.id !== value.slice(5)).concat([state.item]),
            true,
          );
        if (value === "fix") {
          // Refaz as perguntas com os valores da IA já preenchidos para ajustar.
          state.prefilled = {};
          if (policy.asksEquipmentIntent(state.item)) state.equipmentIntent = "";
        }
        message(
          value === "fix"
            ? "Vamos ajustar. Deixei os valores que entendi preenchidos; é só corrigir."
            : "Ótimo! Só faltam alguns detalhes.",
        );
        askEquipmentIntent();
      },
      "CONFIRA O RASCUNHO",
    );
  }

  // --- Dados do chamado --------------------------------------------------------------------
  function askEquipmentIntent() {
    if (!policy.asksEquipmentIntent(state.item) || state.equipmentIntent) return askField(0);
    checkpoint(askEquipmentIntent);
    message(
      "É um problema com o item que você já usa ou você quer solicitar um item novo ou diferente?",
    );
    choose(
      [
        { label: "Meu item está com defeito", value: "repair", icon: "fa-screwdriver-wrench" },
        { label: "Quero um item novo ou diferente", value: "purchase", icon: "fa-cart-shopping" },
      ],
      (intent) => {
        state.equipmentIntent = intent;
        message(
          intent === "repair"
            ? "Entendi. Vamos registrar o defeito para a equipe avaliar o reparo ou a reposição."
            : "Certo. Vamos registrar o que você precisa e quem autorizou esse pedido.",
        );
        askField(0);
      },
    );
  }
  function askField(index) {
    const fields = state.item.fields || [];
    if (index >= fields.length) return afterFields();
    const field = fields[index];
    if (field.when && state.answers[field.when.field] !== field.when.equals) {
      delete state.answers[field.id];
      return askField(index + 1);
    }
    if (state.prefilled[field.id] && state.answers[field.id]) return askField(index + 1);
    checkpoint(() => askField(index));
    const done = (value) => {
      state.answers[field.id] = value;
      askField(index + 1);
    };
    if (field.id === "computador") {
      const hardware = policy.asksEquipmentIntent(state.item);
      message(
        hardware
          ? state.equipmentIntent === "purchase"
            ? "Quem vai usar esse novo item?"
            : "Quem usa o equipamento que está com defeito?"
          : "Quem usa o computador que precisa de atendimento?",
      );
      return choose(
        [
          {
            label: hardware
              ? state.equipmentIntent === "purchase"
                ? "É para mim"
                : "Eu uso esse equipamento"
              : "Eu uso este computador",
            value: state.name,
            icon: "fa-user",
          },
          { label: "Outra pessoa", value: "other", icon: "fa-user-group" },
          { label: "Uso compartilhado", value: "shared", icon: "fa-users" },
        ],
        (value) => {
          if (value === "other")
            return freeText(
              "Nome e sobrenome de quem usa…",
              (owner) => done(owner.trim()),
              100,
              (v) => (policy.fullName(v) ? null : "Informe o nome e sobrenome de quem usa."),
            );
          if (value === "shared")
            return freeText(
              "Onde fica o equipamento compartilhado? Ex.: recepção…",
              (place) => done("Compartilhado — " + place.trim()),
              200,
            );
          done(value);
        },
      );
    }
    message(copy.field(state.item, field));
    if (field.type === "choice")
      return choose(
        field.options.map((option) => ({ label: option, value: option })),
        done,
      );
    if (["date", "time"].includes(field.type))
      return structured(field.label, field.type, null, done, { prefill: state.answers[field.id] });
    const validate = (value) =>
      field.id === "descricao-do-problema" && !policy.usefulDescription(value)
        ? "Me conte o que acontece com o cabo. Só o número da sala não explica o problema."
        : field.type === "email" && !EMAIL.test(value.trim())
          ? "Informe um e-mail válido."
          : field.type === "url" && value !== F.PENDING_LINK && !/^https?:\/\/[^\s]+$/i.test(value)
            ? "Informe um link começando com https:// ou http://."
            : null;
    freeText(
      field.id === "descricao-do-problema"
        ? "Conte o que acontece com o cabo HDMI…"
        : field.label + "…",
      (value) => done(value.trim()),
      1000,
      validate,
      state.answers[field.id] ||
        (field.id === "descricao-do-problema" && state.fromDescribe ? state.description : ""),
      copy.quickReplies(state.item, field, { email: state.email }),
    );
  }
  function afterFields() {
    const describedField = state.item.fields.some((f) => f.id === "descricao-do-problema");
    if (describedField && state.answers["descricao-do-problema"]) {
      state.description = state.answers["descricao-do-problema"];
      return reviewWithAI();
    }
    // Quem contou com as próprias palavras não precisa escrever de novo.
    if (state.fromDescribe && state.description) return reviewWithAI();
    askDescription();
  }
  function setDescription(text) {
    const hasField = state.item.fields.some((f) => f.id === "descricao-do-problema");
    state.description = text.slice(0, hasField ? 1000 : 2000);
    if (hasField) state.answers["descricao-do-problema"] = state.description;
  }
  function askDescription() {
    checkpoint(askDescription);
    message(copy.description(state.item, state.equipmentIntent));
    const optional = copy.detailsOptional(state.item, state.equipmentIntent);
    freeText(
      optional ? "Algum detalhe a mais? (opcional)" : "Conte aqui o que você precisa…",
      (text) => {
        setDescription(text === "__none" ? copy.autoDescription(state.item, state.answers) : text);
        state.review = null;
        reviewWithAI();
      },
      state.item.fields.some((f) => f.id === "descricao-do-problema") ? 1000 : 2000,
      (value) =>
        policy.usefulDescription(value)
          ? null
          : "Conte o que acontece ou o que você precisa. Só um número ou símbolo não explica o chamado.",
      state.description,
      optional ? [{ label: "Sem mais detalhes", value: "__none", icon: "fa-check" }] : [],
    );
  }

  // --- Revisão da IA: coerência, complemento e passos antes do envio -----------------------
  async function reviewWithAI() {
    const key = state.item.id + "|" + state.description + "|" + JSON.stringify(state.answers);
    if (state.review?.key === key) return afterReview();
    setAiStatus("busy");
    lock("A IA ESTÁ CONFERINDO SEU CHAMADO");
    const token = generation,
      wait = thinking("Conferindo se está tudo claro para a equipe…");
    let result = {};
    try {
      result = await api("/api/assist", selectionPayload());
    } catch {
      if (token === generation) refreshStatus();
    }
    messages.dismiss(wait);
    if (token !== generation) return;
    const text = (value) => (typeof value === "string" ? value : "");
    state.review = {
      key,
      question: text(result.question),
      help: text(result.help),
      tips: Array.isArray(result.tips) ? result.tips.filter((t) => typeof t === "string") : [],
      coherent: result.coherent !== false,
      reason: text(result.reason),
      asked: false,
      checked: false,
    };
    afterReview();
  }
  function afterReview() {
    const review = state.review;
    if (!review.coherent && review.reason && !review.checked) return askCoherence();
    if (review.question && !review.asked) return askFollowUp();
    offerTips();
  }
  function askCoherence() {
    checkpoint(askCoherence);
    aiMessage(
      "Antes de continuar, uma conferência: " +
        state.review.reason +
        " Quer escolher outro tipo de atendimento?",
    );
    choose(
      [
        { label: "Escolher outro tipo", value: "change", icon: "fa-route", primary: true },
        { label: "Está certo assim", value: "keep", icon: "fa-check" },
      ],
      (value) => {
        state.review.checked = true;
        metrics.update({ coherence: value === "keep" ? "manteve" : "trocou o tipo" });
        if (value === "keep") return afterReview();
        state.fromDescribe = true;
        message("Tudo bem. Escolha o tipo certo; seu relato continua guardado como descrição.");
        askArea();
      },
      "O RELATO COMBINA COM O PEDIDO?",
    );
  }
  function askFollowUp() {
    checkpoint(askFollowUp);
    const question = state.review.question;
    const bubble = aiMessage(question);
    if (state.review.help) {
      const help = el("small", "ai-help");
      help.append(icon("fa-circle-info"), document.createTextNode(" " + state.review.help));
      bubble.append(help);
    }
    freeText(
      "Sua resposta…",
      (answer) => {
        state.review.asked = true;
        metrics.update({
          followUp:
            answer === "__skip" ? "pulou" : answer === "__unknown" ? "não sabia" : "respondeu",
        });
        if (answer !== "__skip")
          state.followUps.push({
            question,
            answer: answer === "__unknown" ? "Não soube informar." : answer.trim().slice(0, 400),
          });
        offerTips();
      },
      400,
      null,
      "",
      [
        { label: "Não sei", value: "__unknown", icon: "fa-question" },
        { label: "Pular esta pergunta", value: "__skip", icon: "fa-forward" },
      ],
    );
  }
  function logSelfHelp(outcome) {
    // Registro anônimo (setor, caminho e resultado) para medir se as dicas ajudam.
    if (state.selfHelp === outcome) return;
    state.selfHelp = outcome;
    api("/api/selfhelp", {
      sector: state.sector,
      selectionId: state.item.id,
      outcome,
    }).catch(() => {});
  }
  function offerTips() {
    const tips = state.review?.tips || [];
    if (
      !tips.length ||
      !policy.selfHelpEligible(state.item, state.equipmentIntent) ||
      state.selfHelp === "continued"
    )
      return askAuthorization();
    checkpoint(offerTips);
    const bubble = aiMessage("Antes de enviar o chamado, vale tentar estes passos rápidos:");
    const list = el("ol", "tip-list");
    tips.forEach((tip) => list.append(el("li", "", tip)));
    bubble.append(
      list,
      el(
        "small",
        "tip-note",
        "Sugestões da IA. Se não se sentir à vontade com algum passo, é só seguir com o chamado.",
      ),
    );
    choose(
      [
        {
          label: "Não resolveu, seguir com o chamado",
          value: "go",
          icon: "fa-paper-plane",
          primary: true,
        },
        { label: "Resolveu! Não preciso do chamado", value: "solved", icon: "fa-circle-check" },
      ],
      (value) => {
        metrics.update({ tips: value === "solved" ? "resolveu" : "seguiu para o chamado" });
        if (value === "solved") return resolvedBySelf();
        logSelfHelp("continued");
        askAuthorization();
      },
      "OS PASSOS RESOLVERAM?",
    );
  }
  function resolvedBySelf() {
    checkpoint(resolvedBySelf);
    logSelfHelp("resolved");
    metrics.update({ stage: "resolvido sem chamado" });
    message(
      "Que ótimo! Registrei que os passos resolveram, sem abrir chamado. Se voltar a acontecer, é só continuar daqui ou abrir um novo atendimento.",
    );
    byId("new-chat").hidden = false;
    byId("mobile-new-chat").hidden = false;
    choose(
      [
        { label: "Novo atendimento", value: "new", icon: "fa-plus", primary: true },
        { label: "Voltou a acontecer — abrir o chamado", value: "open", icon: "fa-paper-plane" },
      ],
      (value) => {
        if (value === "new") return start();
        logSelfHelp("continued");
        metrics.update({ tips: "seguiu para o chamado", stage: "caminho" });
        message("Sem problema, vamos continuar o chamado de onde paramos.");
        askAuthorization();
      },
      "TUDO CERTO POR AQUI",
    );
  }

  // --- Autorização, anexos, resumo e envio --------------------------------------------------
  function askAuthorization() {
    if (!policy.needsAuthorization(state.item, state.description, state.equipmentIntent)) {
      state.authorization = null;
      return askAttachments();
    }
    checkpoint(askAuthorization);
    message(
      "Para esse pedido de compra ou de um item novo, sua liderança já deu o aval? Vou registrar essa informação para a equipe conferir.",
    );
    choose(
      [
        { label: "Já foi autorizado", value: "yes", icon: "fa-user-check" },
        { label: "Ainda não tenho autorização", value: "no", icon: "fa-hourglass-half" },
      ],
      (answer) => {
        if (answer === "no") {
          state.authorization = { status: "pending", by: "" };
          message(
            "Tudo bem. Vou registrar que a autorização está pendente para a equipe avaliar com sua liderança.",
          );
          return askAttachments();
        }
        message(
          "Quem autorizou? Informe o nome e sobrenome da liderança. Se quiser, anexe a aprovação na próxima etapa.",
        );
        freeText(
          "Nome e sobrenome de quem autorizou…",
          (name) => {
            state.authorization = { status: "reported", by: name.trim() };
            askAttachments();
          },
          100,
          (v) =>
            policy.fullName(v) ? null : "Informe o nome e sobrenome da liderança que autorizou.",
        );
      },
    );
  }
  function askAttachments() {
    checkpoint(askAttachments);
    message(
      state.attachments.length
        ? "Você pode adicionar outro arquivo ou continuar para a revisão."
        : "Quer anexar uma foto ou arquivo? Ajuda a equipe a entender, mas é opcional.",
    );
    askAttachmentsControls();
  }
  function askAttachmentsControls() {
    choose(
      [
        {
          label: state.attachments.length ? "Continuar com os anexos" : "Continuar sem anexo",
          value: "next",
          icon: "fa-check",
          primary: true,
        },
        { label: "Adicionar anexo", value: "add", icon: "fa-paperclip" },
      ],
      (value) => {
        if (value === "add") {
          askAttachmentsControls();
          byId("attachment-input").click();
        } else makeSubject();
      },
    );
    renderAttachments();
  }
  function renderAttachments() {
    const panel = byId("attachment-panel");
    panel.hidden = false;
    panel.replaceChildren(
      el("p", "", desk.attachments.describe() + " Os anexos não são enviados à IA."),
    );
    for (const [index, file] of state.attachments.entries()) {
      const row = el("div", "attachment-row"),
        remove = el("button", "small-action", "Remover");
      remove.type = "button";
      remove.setAttribute("aria-label", "Remover " + file.name);
      remove.addEventListener("click", () => {
        state.attachments.splice(index, 1);
        askAttachmentsControls();
      });
      row.append(el("span", "", file.name + " · " + (file.size / 1024).toFixed(1) + " KB"), remove);
      panel.append(row);
    }
  }
  byId("attachment-input").addEventListener("change", () => {
    const result = desk.attachments.merge(state.attachments, [...byId("attachment-input").files]);
    if (!result.error) state.attachments = result.files;
    byId("attachment-input").value = "";
    askAttachmentsControls();
    byId("input-error").textContent = result.error;
  });
  async function makeSubject() {
    setAiStatus("busy");
    lock("ORGANIZANDO SEU CHAMADO");
    const token = generation;
    let result;
    try {
      result = await api("/api/subject", selectionPayload());
    } catch {
      if (token === generation) setAiStatus(false);
      result = { subject: (state.area + " — " + state.item.need).slice(0, 80), source: "local" };
    }
    if (token !== generation) return;
    state.subject = String(result.subject || state.area + " — " + state.item.need)
      .replace(/[<>\r\n\x00-\x1f]+/g, " — ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80);
    state.source = result.source;
    showSummary();
  }
  function summaryRows() {
    return [
      ["Solicitante", state.name],
      ["E-mail", state.email],
      ["Setor", state.sector],
      ...(state.equipmentIntent
        ? [
            [
              "Tipo de pedido",
              state.equipmentIntent === "purchase" ? "Item novo ou diferente" : "Defeito no item",
            ],
          ]
        : []),
      ...(state.authorization
        ? [
            [
              "Autorização da liderança",
              state.authorization.status === "reported"
                ? "Declarada pelo solicitante — " + state.authorization.by
                : "Pendente de autorização",
            ],
          ]
        : []),
      ...(state.item.fields || [])
        .filter((field) => state.answers[field.id] && field.id !== "descricao-do-problema")
        .map((field) => [
          field.id === "computador" ? "Quem utiliza" : field.label,
          F.formatValue(field, state.answers[field.id]),
          state.prefilled[field.id],
        ]),
    ];
  }
  function showSummary() {
    checkpoint(showSummary);
    stage("summary");
    metrics.update({ stage: "resumo" });
    const bubble = message("Confira seu chamado antes de enviar:");
    const card = el("section", "summary-card");
    card.setAttribute("aria-label", "Resumo do chamado");
    const head = el("header", "summary-head"),
      tile = el("span", "summary-icon"),
      titles = el("div"),
      ready = el("span", "summary-ready");
    tile.append(icon(F.iconFor(state.item.need, state.area)));
    titles.append(el("small", "", state.area), el("h3", "", F.needLabel(state.item)));
    ready.append(icon("fa-circle-check"), document.createTextNode(" Pronto"));
    head.append(tile, titles, ready);
    const dl = el("dl");
    for (const [label, value, byAI] of summaryRows()) {
      const row = el("div"),
        dt = el("dt", "", label);
      if (byAI) {
        const mark = el("span", "ai-mark");
        mark.title = "Preenchido pela IA a partir do seu relato";
        mark.append(icon("fa-wand-magic-sparkles"));
        dt.append(mark);
      }
      row.append(dt, el("dd", "", value));
      dl.append(row);
    }
    const story = el("div", "summary-description");
    story.append(el("small", "", "Descrição"), el("p", "", state.description));
    card.append(head, dl, story);
    const answered = state.followUps.filter((entry) => entry.answer);
    if (answered.length) {
      const block = el("div", "summary-followups");
      block.append(el("small", "", "Perguntas do assistente"));
      const list = el("ul");
      for (const entry of answered) {
        const li = el("li");
        li.append(el("span", "followup-q", entry.question), el("span", "followup-a", entry.answer));
        list.append(li);
      }
      block.append(list);
      card.append(block);
    }
    if (state.attachments.length) {
      const files = el("ul", "summary-files");
      files.setAttribute("aria-label", "Anexos");
      for (const file of state.attachments) {
        const li = el("li");
        li.append(icon("fa-paperclip"), document.createTextNode(" " + file.name));
        files.append(li);
      }
      card.append(files);
    }
    bubble.append(card);
    summaryActions();
  }
  function receiptCard(number) {
    const card = el("section", "receipt-card");
    card.setAttribute("aria-label", "Comprovante do chamado " + number);
    const top = el("div", "receipt-top"),
      copyButton = el("button", "small-action receipt-copy");
    copyButton.type = "button";
    copyButton.append(icon("fa-copy"), el("span", "", " Copiar"));
    copyButton.addEventListener("click", async () => {
      const label = copyButton.querySelector("span");
      try {
        await navigator.clipboard.writeText(number);
        label.textContent = " Copiado!";
      } catch {
        label.textContent = " Selecione e copie";
      }
      setTimeout(() => (label.textContent = " Copiar"), 2200);
    });
    top.append(
      el("small", "", "Número do chamado"),
      el("strong", "receipt-number", number),
      copyButton,
    );
    const steps = el("ol", "receipt-steps");
    [
      ["Recebido", "fa-check", true],
      ["Em andamento", "fa-screwdriver-wrench", false],
      ["Finalizado", "fa-flag-checkered", false],
    ].forEach(([text, glyph, done]) => {
      const li = el("li", done ? "done" : "");
      li.append(icon(glyph), document.createTextNode(" " + text));
      steps.append(li);
    });
    card.append(
      top,
      steps,
      el(
        "p",
        "receipt-note",
        "A equipe usará " +
          state.email +
          " para o retorno. Para ver a situação depois, use “Acompanhar um chamado” com este número.",
      ),
    );
    return card;
  }
  // Teste com usuários (0.12): nota de facilidade e comentário opcional, guardados só nas
  // métricas anônimas do atendimento (nunca no chamado nem na IA).
  function askEase() {
    message("Antes de terminar, uma pergunta rápida: quão fácil foi abrir este chamado?");
    choose(
      [
        ...[
          [5, "Muito fácil", "fa-face-grin-stars"],
          [4, "Fácil", "fa-face-smile"],
          [3, "Mais ou menos", "fa-face-meh"],
          [2, "Difícil", "fa-face-frown"],
          [1, "Muito difícil", "fa-face-tired"],
        ].map(([value, label, glyph]) => ({
          label: value + " · " + label,
          value: String(value),
          icon: glyph,
        })),
        { label: "Prefiro não responder", value: "skip", icon: "fa-forward" },
      ],
      (value) => {
        if (value === "skip") return afterSent();
        metrics.update({ ease: Number(value) });
        askMissing(Number(value));
      },
      "SUA OPINIÃO AJUDA A MELHORAR",
    );
  }
  function askMissing(ease) {
    message(
      ease >= 4
        ? "Obrigado! Algo poderia ser ainda mais fácil?"
        : "Obrigado pela sinceridade. O que faltou ou atrapalhou?",
    );
    freeText(
      "Conte em poucas palavras, sem nomes… (opcional)",
      (text) => {
        if (text !== "__none") metrics.update({ comment: text.trim().slice(0, 300) });
        message("Anotado. Obrigado por ajudar a melhorar o SmartDesk!");
        afterSent();
      },
      300,
      null,
      "",
      [{ label: "Nada a acrescentar", value: "__none", icon: "fa-check" }],
    );
  }
  function afterSent() {
    const known = F.profile.read();
    const remembered =
      known &&
      known.email === state.email &&
      known.name === state.name &&
      known.sector === state.sector;
    choose(
      [
        { label: "Novo atendimento", value: "new", icon: "fa-plus", primary: true },
        remembered
          ? {
              label: "Esquecer meus dados deste dispositivo",
              value: "forget",
              icon: "fa-user-xmark",
            }
          : {
              label: "Lembrar nome, e-mail e setor neste dispositivo",
              value: "remember",
              icon: "fa-user-check",
            },
      ],
      (value) => {
        if (value === "new") return start();
        if (value === "remember")
          message(
            F.profile.save(state)
              ? "Pronto! Na próxima vez, você pula as perguntas de nome, e-mail e setor e vai direto ao que precisa. Use só em um dispositivo pessoal."
              : "Este navegador não permitiu salvar os dados. Tudo bem, é só informar de novo na próxima vez.",
          );
        else {
          F.profile.clear();
          message("Feito. Seus dados não ficam mais salvos neste dispositivo.");
        }
        afterSent();
      },
      "ATENDIMENTO ENVIADO",
    );
  }
  function summaryActions(failure = "") {
    choose(
      [
        {
          label: failure ? "Tentar enviar novamente" : "Enviar chamado",
          value: "send",
          icon: "fa-paper-plane",
          primary: true,
        },
        { label: "Editar descrição", value: "edit", icon: "fa-pen" },
        ...(state.attachments.length
          ? [{ label: "Revisar anexos", value: "files", icon: "fa-paperclip" }]
          : []),
      ],
      (action) => {
        if (action === "edit") {
          state.fromDescribe = false;
          return askDescription();
        }
        if (action === "files") return askAttachments();
        sendTicket();
      },
      failure
        ? "ENVIO NÃO CONFIRMADO · SEUS DADOS CONTINUAM AQUI"
        : "SEUS DADOS ESTÃO PRONTOS PARA ENVIO",
    );
    if (failure)
      readyControls(() => {
        const alert = el("p", "submission-error", failure);
        alert.setAttribute("role", "alert");
        choices.before(alert);
      });
  }
  async function sendTicket() {
    if (saving || state.receipt) return;
    saving = true;
    lock("ENVIANDO SEU CHAMADO");
    const pending = el("div", "sending-status"),
      spinner = el("span", "sending-spinner");
    pending.setAttribute("role", "status");
    pending.setAttribute("aria-live", "polite");
    spinner.setAttribute("aria-hidden", "true");
    pending.append(spinner, el("span", "", "Enviando seu chamado… Aguarde a confirmação."));
    choices.append(pending);
    dock.setAttribute("aria-busy", "true");
    byId("frozen-label").hidden = true;
    byId("edit-context").hidden = true;
    try {
      const attachments = await Promise.all(state.attachments.map(desk.attachments.serialize));
      const result = await api("/api/tickets", {
        ...selectionPayload(),
        requestId: state.requestId,
        name: state.name,
        email: state.email,
        authorization: state.authorization,
        subject: state.subject,
        attachments,
        ...(metrics.participant ? { participant: metrics.participant } : {}),
      });
      if (
        result.status !== "enviado" ||
        result.requestId !== state.requestId ||
        typeof result.number !== "string" ||
        !result.number.trim()
      )
        throw new Error("Não consegui confirmar o recebimento. Seus dados continuam aqui.");
      state.receipt = result;
      try {
        sessionStorage.setItem("smartdesk-sent", "1");
      } catch {}
      stage("sent");
      const confirmation = message(
        "Chamado " + result.number + " enviado! Seus dados foram registrados com sucesso.",
      );
      confirmation.parentNode.parentNode.classList.add("sent");
      confirmation.append(receiptCard(result.number));
      metrics.sent(result.number);
      saving = false;
      askEase();
      byId("new-chat").hidden = false;
      byId("mobile-new-chat").hidden = false;
    } catch (error) {
      saving = false;
      const detail =
        error.name === "TimeoutError" || error.name === "TypeError"
          ? "A conexão não respondeu. Não consegui confirmar o recebimento. Tente novamente; seus dados continuam aqui."
          : error.message || "Não consegui confirmar o recebimento. Seus dados continuam aqui.";
      message("O envio não foi confirmado. " + detail);
      summaryActions(detail);
    }
  }

  // --- Campo de texto ------------------------------------------------------------------------
  byId("composer").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!textHandler || input.disabled) return;
    const value = input.value;
    if (!value.trim()) {
      showInputError("Preencha este dado para continuar.");
      return;
    }
    const error = validator?.(value);
    if (error) {
      showInputError(error);
      return;
    }
    const callback = textHandler;
    message(value, "user");
    lock();
    callback(value);
  });
  function showInputError(error) {
    byId("input-error").textContent = error ? "⚠ " + error : "";
    byId("composer").classList.toggle("invalid", !!error);
    input.setAttribute("aria-invalid", String(!!error));
  }
  input.addEventListener("input", () => {
    autoGrow();
    byId("send").disabled = !input.value.trim();
    byId("char-count").textContent = input.value.length + " / " + input.maxLength;
    if (input.getAttribute("aria-invalid") === "true")
      showInputError(
        validator?.(input.value) ||
          (!input.value.trim() ? "Preencha este dado para continuar." : ""),
      );
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      byId("composer").requestSubmit();
    }
  });
  byId("new-chat").addEventListener("click", start);
  byId("mobile-new-chat").addEventListener("click", start);
  byId("edit-context").addEventListener("click", back);
  byId("restart-chat").addEventListener("click", start);
  // Sessão de teste (link com ?p=P01): mostra o código para o facilitador conferir.
  if (metrics.participant) {
    const badge = el("span", "test-badge", "Teste " + metrics.participant);
    badge.title =
      "Sessão de teste com usuários: o código marca os chamados e as métricas desta aba.";
    byId("ai-status").parentNode.append(badge);
  }
  start();
  setInterval(refreshStatus, 30000);
})(window.SmartDesk);
