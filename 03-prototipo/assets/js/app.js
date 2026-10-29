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
    // Trilha da barra lateral: o que já foi informado fica preenchido e o próximo, destacado.
    const filled = {
      name: !!state.name,
      email: !!state.email,
      sector: !!state.sector,
      need: !!state.item,
    };
    const steps = [...document.querySelectorAll(".context-step")];
    let current = false,
      done = 0;
    steps.forEach((step) => {
      const ok = filled[step.dataset.step];
      step.classList.toggle("is-filled", ok);
      step.classList.toggle("is-current", !ok && !current);
      if (!ok) current = true;
      else done++;
    });
    placeContextLine();
    // Cartão "Seu chamado": anel de progresso, contagem e um título que acompanha o momento.
    const count = byId("context-count"),
      ring = byId("context-ring"),
      title = byId("context-title"),
      sent = state.receipt?.number;
    if (count) count.textContent = done + "/" + steps.length;
    if (ring) {
      ring.style.setProperty("--p", steps.length ? done / steps.length : 0);
      ring.classList.toggle("is-sent", !!sent);
    }
    if (title)
      title.textContent = sent
        ? "Chamado " + sent + " enviado"
        : done === steps.length
          ? "Quase pronto"
          : done
            ? "Em andamento"
            : "Vamos começar";
  }
  // A linha preenchida vai do primeiro ícone até o da etapa atual (ou o último, se completo).
  // Em pixels, porque um e-mail ou necessidade longos ocupam duas linhas.
  function placeContextLine() {
    const steps = [...document.querySelectorAll(".context-step")];
    if (!steps.length) return;
    const done = steps.filter((step) => step.classList.contains("is-filled")).length,
      target = steps[Math.min(done, steps.length - 1)],
      list = steps[0].parentElement;
    list.style.setProperty("--context-fill", target.offsetTop - steps[0].offsetTop + "px");
    list.style.setProperty("--context-track", steps.at(-1).offsetTop - steps[0].offsetTop + "px");
    // Picote do cartão "Seu chamado": os recortes laterais acompanham a altura do cabeçalho.
    const card = list.closest(".chamado-card"),
      head = card?.querySelector(".chamado-head");
    if (head) card.style.setProperty("--notch", head.offsetHeight + 1 + "px");
    fitSidebar();
  }
  // A barra lateral nunca rola: se um e-mail ou uma necessidade longos ocuparem mais linhas e o
  // conteúdo não couber, saem primeiro "O que a TI atende", depois a dica e, por último, o rodapé.
  function fitSidebar() {
    const side = document.querySelector(".sidebar");
    if (!side || !side.offsetParent) return;
    const optional = [".sidebar-areas", ".sidebar-tip", ".sidebar-footer"]
      .map((selector) => side.querySelector(selector))
      .filter(Boolean);
    optional.forEach((node) => node.classList.remove("is-squeezed"));
    for (const node of optional) {
      if (side.scrollHeight <= side.clientHeight) break;
      node.classList.add("is-squeezed");
    }
  }
  if (window.ResizeObserver && document.querySelector(".context-steps")) {
    const watch = new ResizeObserver(placeContextLine);
    watch.observe(document.querySelector(".context-steps"));
    watch.observe(document.querySelector(".sidebar"));
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
  // A primeira tela não rola: enquanto só há a saudação, o quadro de boas-vindas sobe de nível
  // (data-fit, atmosphere.css) até ele e a mensagem caberem na conversa. Refeito quando a
  // conversa muda de altura (barra do navegador no celular, opções da saudação, janela). Se nem
  // o nível mais enxuto couber, a conversa desce até a mensagem.
  function fitWelcome() {
    const welcome = byId("welcome"),
      log = byId("conversation");
    if (welcome.hidden || byId("messages").querySelectorAll(".message").length > 1) return;
    for (let level = 0; level <= 5; level++) {
      if (level) welcome.dataset.fit = level;
      else delete welcome.dataset.fit;
      if (log.scrollHeight <= log.clientHeight) return;
    }
    follower.follow();
  }
  const opening = new ResizeObserver(() => fitWelcome());
  opening.observe(byId("conversation"));
  opening.observe(byId("messages"));
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
      autoDescribed: false,
      selfHelp: "",
      declined: [],
      keepAnswered: false,
      // 0.12.18 — caminho da IA: o que o rascunho entendeu (entendimento, relato completo,
      // outro pedido, dicas), perguntas de descrição já feitas e se a nota já foi pedida.
      draftInfo: null,
      complemented: [],
      easeAsked: false,
    };
    byId("new-chat").hidden = true;
    byId("mobile-new-chat").hidden = true;
    byId("messages").replaceChildren();
    byId("welcome").hidden = false;
    byId("attachment-input").value = "";
    context();
    stage("context");
    refreshStatus();
    const saved = F.profile.read();
    if (saved) {
      const bubble = message("");
      bubble.append(document.createTextNode("Olá, "));
      bubble.append(el("strong", "", saved.name.split(/\s+/)[0]));
      bubble.append(
        document.createTextNode(
          "! Que bom te ver de novo. Seus dados estão salvos neste dispositivo: quer usá-los para pular nome, e-mail e setor?",
        ),
      );
    } else message("Olá! Sou o assistente do SmartDesk. Vamos organizar seu atendimento juntos?");
    messages.whenReady(() => requestAnimationFrame(fitWelcome));
    offerStart();
  }
  function offerStart() {
    const known = F.profile.read();
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
        if (answer === "start") return askName();
        useProfile(answer, known);
      },
    );
  }
  // Dados salvos neste dispositivo: usar ou começar como outra pessoa (na abertura e ao abrir
  // um chamado depois de acompanhar outro).
  function useProfile(answer, known) {
    if (answer === "known") {
      Object.assign(state, { name: known.name, email: known.email, sector: known.sector });
      metrics.update({ stage: "identificação" });
      context();
      message("Perfeito! Seus dados estão no resumo ao lado.");
      return askArea();
    }
    F.profile.clear();
    message("Tudo bem! Apaguei os dados salvos neste dispositivo.");
    askName();
  }
  function askProfile(known) {
    checkpoint(() => askProfile(known));
    message("Seus dados estão salvos neste dispositivo. Quer usá-los neste chamado?");
    choose(
      [
        {
          label: "Continuar como " + known.name.split(/\s+/)[0],
          value: "known",
          primary: true,
          icon: "fa-user-check",
        },
        { label: "Sou outra pessoa", value: "other", icon: "fa-user-pen" },
      ],
      (answer) => useProfile(answer, known),
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
    // Quem acompanhou um chamado pode não ser a mesma pessoa dos dados salvos.
    if (known) return askProfile(known);
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
    let result =
      state.suggestion?.text === text && state.suggestion.sector === state.sector
        ? state.suggestion.result
        : null;
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
      state.suggestion = { text, sector: state.sector, result };
    }
    state.description = text;
    state.fromDescribe = true;
    const items = [...new Set((result.candidates || []).map((candidate) => candidate?.item?.id))]
      .map((id) => desk.knowledgeBase.items.find((item) => item.id === id))
      .filter((item) => item && desk.classifier.isAllowed(item, state.sector))
      .slice(0, 3);
    if (!items.length) {
      metrics.update({ aiDraft: "não identificou" });
      // Sem caminho da TI para o relato: orienta para a equipe certa ou para o setor que tem esse
      // atendimento, em vez de só voltar às opções.
      const team = result.source === "ai" ? policy.otherTeam(text) : "",
        restricted = team ? null : desk.classifier.classify(text, state.sector).blocked[0]?.item;
      if (restricted) return askRestricted(restricted, text);
      message(
        team
          ? "Pelo que você contou, isso parece ser assunto " +
              team +
              ", não da TI: vale procurar essa equipe. Se for algo de TI, escolha pelas opções — seu texto fica guardado como descrição."
          : "Não consegui identificar o tipo de atendimento só pelo relato. Vamos escolher juntos pelas opções — seu texto fica guardado como descrição.",
      );
      return askArea();
    }
    if (result.source !== "ai") {
      metrics.update({ aiDraft: "sem IA" });
      return pickLocalGuess(items);
    }
    buildDraft(items[0], items.slice(1), true);
  }
  const sectorList = (list) => (list.length > 1 ? "os setores " : "o setor ") + list.join(", ");
  // O relato fala de um atendimento exclusivo de outro setor (ex.: QuickBooks, do Financeiro).
  function askRestricted(item, text) {
    checkpoint(() => askRestricted(item, text));
    message(
      "Pelo seu relato, parece ser " +
        F.needLabel(item) +
        ", que é atendido só para " +
        sectorList(item.sectors) +
        ". Seu setor está como " +
        state.sector +
        ".",
    );
    choose(
      [
        { label: "Corrigir meu setor", value: "sector", icon: "fa-building", primary: true },
        { label: "Escolher pelas opções", value: "manual", icon: "fa-list" },
      ],
      (value) => {
        if (value === "manual") return askArea();
        message("Em qual setor você trabalha?");
        comboBox(
          "Seu setor",
          desk.flows.sectors.map((sector) => ({ value: sector, icon: F.sectorIcon(sector) })),
          (sector) => {
            state.sector = sector;
            context();
            suggestPaths(text);
          },
          { placeholder: "Digite ou escolha seu setor, ex.: secretaria" },
        );
      },
      "O SETOR ESTÁ CERTO?",
    );
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
    // O que a IA entendeu do relato. `question` é a pergunta de descrição que ela conferiu (nos
    // periféricos, a de item novo, a única que não é opcional).
    state.draftInfo = {
      understanding: typeof draft.understanding === "string" ? draft.understanding : "",
      complete: typeof draft.complete === "boolean" ? draft.complete : null,
      question: copy.flowQuestion(item, policy.asksEquipmentIntent(item) ? "purchase" : ""),
      otherRequest: draft.otherRequest === true,
      tips: Array.isArray(draft.tips) ? draft.tips.filter((tip) => typeof tip === "string") : [],
    };
    showDraft(alternatives, fromAI);
  }
  // Caminho da IA: a pergunta de descrição do caminho pelos botões, quando ainda não foi feita e
  // a IA não confirmou que o relato já responde a ela.
  function complementQuestion() {
    const question = copy.flowQuestion(state.item, state.equipmentIntent),
      info = state.draftInfo;
    if (!question || state.complemented.includes(question)) return "";
    return info && info.question === question && info.complete === true ? "" : question;
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
    if (complementQuestion()) row("Mais detalhes", "", true);
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
    const filled = Object.keys(state.answers).length,
      info = state.draftInfo || {},
      understood = (info.understanding || "").replace(/^Você(?=\s)/, "você");
    aiMessage(
      (understood ? "Entendi: " + understood + " " : "") +
        (filled
          ? "Montei este rascunho com o que você contou. Confira; o que estiver marcado como “Vou perguntar” eu pergunto em seguida."
          : (understood ? "Este" : "Pelo que você contou, este") +
            " é o tipo de atendimento. Confira; os dados que faltam eu pergunto em seguida."),
      fromAI,
    ).append(draftCard());
    // Dois pedidos no mesmo relato: um chamado para cada, o segundo logo depois do envio.
    if (info.otherRequest && !state.secondRequest)
      aiMessage(
        "Você também contou outro pedido. Cada pedido vira um chamado: vamos fechar este primeiro e, depois do envio, eu te ajudo a abrir o outro com o mesmo relato.",
        fromAI,
      );
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
        // Defeito simples: as dicas vêm antes dos dados — se resolver, ninguém preenche nada.
        const tips = state.draftInfo?.tips || [],
          tipsFirst = tips.length && policy.selfHelpEligible(state.item, state.equipmentIntent);
        if (value === "fix")
          message("Vamos ajustar. Deixei os valores que entendi preenchidos; é só corrigir.");
        else if (!tipsFirst) message("Ótimo! Só faltam alguns detalhes.");
        offerTips(tips, askEquipmentIntent, true);
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
    if (index >= fields.length) {
      state.keepAnswered = false;
      return afterFields();
    }
    const field = fields[index];
    if (field.when && state.answers[field.when.field] !== field.when.equals) {
      delete state.answers[field.id];
      return askField(index + 1);
    }
    if ((state.prefilled[field.id] || state.keepAnswered) && state.answers[field.id])
      return askField(index + 1);
    checkpoint(() => askField(index));
    askFieldValue(field, (value) => {
      state.answers[field.id] = value;
      askField(index + 1);
    });
  }
  // Pergunta um campo do chamado; a resposta atual vem preenchida (texto, data e hora) ou em
  // destaque (escolhas), para corrigir sem apagar.
  function askFieldValue(field, done) {
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
    // Ao corrigir o rascunho, a opção que a IA entendeu já vem destacada.
    if (field.type === "choice")
      return choose(
        field.options.map((option) => ({
          label: option,
          value: option,
          primary: option === state.answers[field.id],
        })),
        done,
      );
    if (["date", "time"].includes(field.type)) {
      // Atendimento para hoje: o horário não pode ser um que já passou.
      const day = state.item.fields.find((other) => other.type === "date");
      return structured(field.label, field.type, null, done, {
        prefill: state.answers[field.id],
        notBefore:
          field.type === "time" && day && state.answers[day.id] === policy.localDay()
            ? policy.localTime()
            : "",
      });
    }
    const validate = (value) =>
      field.id === "descricao-do-problema" && !policy.usefulDescription(value)
        ? "Me conte o que acontece com o cabo. Só o número da sala não explica o problema."
        : field.type === "email" && !EMAIL.test(value.trim())
          ? "Informe um e-mail válido."
          : field.type === "url" && value !== F.PENDING_LINK && !/^https?:\/\/[^\s]+$/i.test(value)
            ? "Informe um link começando com https:// ou http://."
            : field.type === "tel" && !policy.phoneValue(value)
              ? "Informe o telefone com DDD, por exemplo (11) 91234-5678."
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
  // --- Correção pontual no resumo ------------------------------------------------------------
  // A pessoa escolhe o dado; texto vem preenchido para ajustar e escolhas mostram as opções com
  // a atual em destaque. Depois volta ao resumo (com o assunto refeito quando o pedido muda).
  function askCorrection() {
    checkpoint(askCorrection);
    message(
      "Qual dado você quer corrigir? O que já está preenchido vem junto, para você só ajustar.",
    );
    const fields = (state.item.fields || []).filter(
      (field) =>
        field.id !== "descricao-do-problema" &&
        (!field.when || state.answers[field.when.field] === field.when.equals),
    );
    const followUps = state.followUps.filter((entry) => entry.answer);
    const short = (text) => (text.length > 34 ? text.slice(0, 33).trim() + "…" : text);
    const updated = (refreshSubject) => {
      message("Pronto, atualizei o resumo.");
      return refreshSubject ? makeSubject() : showSummary();
    };
    choose(
      [
        { label: "Nome", value: "name", icon: "fa-user" },
        { label: "E-mail", value: "email", icon: "fa-envelope" },
        { label: "Setor", value: "sector", icon: "fa-building" },
        ...fields.map((field) => ({
          label: field.id === "computador" ? "Quem utiliza" : field.label,
          value: "field:" + field.id,
          icon: "fa-pen-to-square",
        })),
        { label: "Descrição", value: "description", icon: "fa-align-left" },
        ...followUps.map((entry, index) => ({
          label: "Resposta: " + short(entry.question),
          value: "follow:" + index,
          icon: "fa-comment",
        })),
        { label: "Voltar ao resumo", value: "back", icon: "fa-arrow-left" },
      ],
      (choice) => {
        if (choice === "back") return showSummary();
        if (choice === "name") {
          message("Qual é o nome e sobrenome certo?");
          return freeText(
            "Seu nome e sobrenome…",
            (name) => {
              state.name = name.trim();
              context();
              updated(false);
            },
            100,
            (value) =>
              policy.fullName(value)
                ? null
                : "Informe seu nome e sobrenome, como você usa no trabalho.",
            state.name,
          );
        }
        if (choice === "email") {
          message("Qual é o e-mail certo para o retorno?");
          return freeText(
            "Seu e-mail institucional…",
            (email) => {
              state.email = email.trim().toLowerCase();
              context();
              updated(false);
            },
            160,
            (value) =>
              EMAIL.test(value.trim())
                ? null
                : "Esse e-mail parece incompleto. Confira o nome, o @ e o domínio.",
            state.email,
          );
        }
        if (choice === "sector") {
          message("Em qual setor você trabalha? Hoje está " + state.sector + ".");
          return comboBox(
            "Seu setor",
            desk.flows.sectors.map((value) => ({ value, icon: F.sectorIcon(value) })),
            (sector) => {
              if (desk.classifier.isAllowed(state.item, sector)) {
                state.sector = sector;
                context();
                return updated(true);
              }
              sectorConflict(sector);
            },
            { placeholder: "Digite ou escolha seu setor, ex.: secretaria" },
          );
        }
        if (choice === "description") {
          message("Ajuste a descrição como preferir:");
          return freeText(
            "Conte aqui o que você precisa…",
            (text) => {
              setDescription(text);
              state.autoDescribed = false;
              updated(true);
            },
            state.item.fields.some((f) => f.id === "descricao-do-problema") ? 1000 : 2000,
            (value) =>
              policy.usefulDescription(value)
                ? null
                : "Conte o que acontece ou o que você precisa. Só um número ou símbolo não explica o chamado.",
            state.description,
          );
        }
        if (choice.startsWith("follow:")) {
          const entry = followUps[Number(choice.slice(7))];
          message(entry.question);
          return freeText(
            "Sua resposta…",
            (answer) => {
              entry.answer = answer.trim();
              updated(true);
            },
            500,
            null,
            entry.answer,
          );
        }
        editField(fields.find((field) => "field:" + field.id === choice));
      },
      "QUAL DADO VOCÊ QUER CORRIGIR?",
    );
  }
  // O setor novo não tem este tipo de atendimento (ex.: QuickBooks é só do Financeiro): antes,
  // o resumo aceitava e o envio era recusado com "Selecione uma necessidade permitida".
  function sectorConflict(sector) {
    const previous = state.sector;
    checkpoint(() => sectorConflict(sector));
    message(
      F.needLabel(state.item) +
        " é atendido só para " +
        sectorList(state.item.sectors) +
        ". Com o setor " +
        sector +
        ", este tipo de atendimento não fica disponível.",
    );
    choose(
      [
        {
          label: "Mudar para " + sector + " e escolher outro tipo",
          value: "change",
          icon: "fa-route",
          primary: true,
        },
        { label: "Manter o setor " + previous, value: "keep", icon: "fa-check" },
      ],
      (value) => {
        if (value === "keep") {
          message("Certo, mantive o setor " + previous + ".");
          return showSummary();
        }
        state.sector = sector;
        state.fromDescribe = !!state.description;
        context();
        message(
          "Tudo bem. Escolha o tipo de atendimento; seu relato continua guardado como descrição.",
        );
        askArea();
      },
      "O SETOR COMBINA COM O PEDIDO?",
    );
  }
  // Corrige um campo; se a resposta muda quem depende dele (ex.: evento → roteiro), pergunta o
  // que passou a valer e descarta o que deixou de valer.
  function editField(field) {
    askFieldValue(field, (value) => {
      state.answers[field.id] = value;
      delete state.prefilled[field.id];
      const dependents = (state.item.fields || []).filter(
        (other) => other.when && other.when.field === field.id,
      );
      for (const other of dependents)
        if (value !== other.when.equals) delete state.answers[other.id];
      const next = dependents.find(
        (other) => value === other.when.equals && !state.answers[other.id],
      );
      if (next) return editField(next);
      // Data trocada para hoje com um horário que já passou: pergunta o horário de novo.
      const hour = (state.item.fields || []).find((other) => other.type === "time");
      if (field.type === "date" && hour && policy.pastTimeToday(value, state.answers[hour.id])) {
        message("Esse horário já passou hoje. Escolha um novo horário.");
        return editField(hour);
      }
      if (state.autoDescribed) setDescription(copy.autoDescription(state.item, state.answers));
      message("Pronto, atualizei o resumo.");
      makeSubject();
    });
  }
  function afterFields() {
    const describedField = state.item.fields.some((f) => f.id === "descricao-do-problema");
    if (describedField && state.answers["descricao-do-problema"]) {
      state.description = state.answers["descricao-do-problema"];
      return reviewWithAI();
    }
    // A descrição montada pelo "Sem mais detalhes" acompanha o tipo e as respostas atuais: a
    // pessoa pode ter trocado o tipo depois do alerta da IA (o #017 ficou com o texto do tipo
    // anterior). Se o tipo novo pede descrição, ela é perguntada de novo.
    if (state.autoDescribed) {
      if (copy.detailsOptional(state.item, state.equipmentIntent)) {
        setDescription(copy.autoDescription(state.item, state.answers));
        return reviewWithAI();
      }
      state.autoDescribed = false;
      state.description = "";
    }
    // Quem contou com as próprias palavras não escreve de novo: só responde ao que faltar.
    if (state.fromDescribe && state.description) return askComplement();
    askDescription();
  }
  // Caminho da IA: o relato é a descrição, mas a pergunta de descrição do caminho pelos botões
  // (ex.: local, atividade e pessoas numa reserva) ainda é feita quando o relato não responde a
  // ela. A resposta entra como pergunta do assistente, junto do relato.
  function askComplement() {
    const question = complementQuestion();
    if (!question) return reviewWithAI();
    checkpoint(askComplement);
    message("Para completar o chamado, mais um detalhe. " + question);
    freeText(
      "Sua resposta…",
      (answer) => {
        state.complemented = [...state.complemented, question];
        if (answer !== "__none")
          state.followUps.push({ question, answer: answer.trim().slice(0, 400) });
        reviewWithAI();
      },
      400,
      (value) =>
        policy.usefulDescription(value)
          ? null
          : "Conte com algumas palavras ou toque em “Já contei tudo”.",
      "",
      [{ label: "Já contei tudo", value: "__none", icon: "fa-check" }],
    );
  }
  function setDescription(text) {
    const hasField = state.item.fields.some((f) => f.id === "descricao-do-problema");
    state.description = text.slice(0, hasField ? 1000 : 2000);
    if (hasField) state.answers["descricao-do-problema"] = state.description;
  }
  function askDescription() {
    checkpoint(askDescription);
    message(copy.description(state.item, state.equipmentIntent, state.answers));
    const optional = copy.detailsOptional(state.item, state.equipmentIntent);
    freeText(
      optional ? "Algum detalhe a mais? (opcional)" : "Conte aqui o que você precisa…",
      (text) => {
        setDescription(text === "__none" ? copy.autoDescription(state.item, state.answers) : text);
        state.autoDescribed = text === "__none";
        // Se o tipo mudar depois para um com a mesma pergunta, ela não é feita de novo.
        state.complemented = [
          ...state.complemented,
          copy.flowQuestion(state.item, state.equipmentIntent),
        ];
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
  // Conferências locais, antes da revisão da IA e depois de cada resposta a ela: o relato pede
  // mais equipamentos do que o tipo escolhido, ou fala em evento com a resposta "Não".
  function checkConsistency(resume) {
    const texts = [state.description, ...state.followUps.map((entry) => entry.answer)],
      allowed = desk.knowledgeBase.items.filter((item) =>
        desk.classifier.isAllowed(item, state.sector),
      ),
      fuller = policy.fullerItem(state.item, texts, allowed);
    if (fuller && !state.declined.includes(fuller.item.id)) {
      offerFuller(fuller, resume);
      return true;
    }
    if (
      policy.eventMismatch(state.item, state.answers, texts) &&
      !state.declined.includes("evento")
    ) {
      confirmEvent(resume);
      return true;
    }
    return false;
  }
  // Depois de trocar o tipo ou confirmar o evento, só pergunta o que ainda falta. Não usa
  // `prefilled`, que no resumo marca o que veio da IA.
  function askMissingFields() {
    state.keepAnswered = true;
    if (state.description) state.fromDescribe = true;
    askField(0);
  }
  function offerFuller({ item, extra }, resume) {
    checkpoint(() => offerFuller({ item, extra }, resume));
    message(
      "Você também citou " +
        extra.join(" e ") +
        ". Para a equipe separar tudo, quer mudar o pedido para “" +
        F.needLabel(item) +
        "”?",
    );
    choose(
      [
        {
          label: "Mudar para " + F.needLabel(item),
          value: "switch",
          icon: F.iconFor(item.need, item.area),
          primary: true,
        },
        { label: "Manter " + F.needLabel(state.item), value: "keep", icon: "fa-check" },
      ],
      (value) => {
        state.declined = [...state.declined, item.id];
        if (value === "keep") return resume();
        const kept = {
          answers: { ...state.answers },
          prefilled: { ...state.prefilled },
          followUps: state.followUps,
          intent: state.equipmentIntent,
        };
        selectItem(item, { answers: kept.answers, intent: kept.intent, prefilled: kept.prefilled });
        state.followUps = kept.followUps;
        message(
          "Pronto, o pedido agora é " +
            F.needLabel(item) +
            ". O que você já respondeu continua valendo.",
        );
        askMissingFields();
      },
      "O PEDIDO ESTÁ COMPLETO?",
    );
  }
  function confirmEvent(resume) {
    checkpoint(() => confirmEvent(resume));
    message(
      "No seu relato aparece um evento, mas a resposta para “É para um evento?” foi “Não”. É para um evento?",
    );
    choose(
      [
        { label: "Sim, é para um evento", value: "Sim", icon: "fa-calendar-check", primary: true },
        { label: "Não é um evento", value: "Não", icon: "fa-xmark" },
      ],
      (value) => {
        state.declined = [...state.declined, "evento"];
        if (value === "Não") return resume();
        state.answers = { ...state.answers, evento: "Sim" };
        askMissingFields();
      },
      "CONFIRME O EVENTO",
    );
  }
  async function reviewWithAI() {
    if (checkConsistency(reviewWithAI)) return;
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
        message(
          state.autoDescribed
            ? "Tudo bem. Escolha o tipo certo e eu refaço a descrição com as novas respostas."
            : "Tudo bem. Escolha o tipo certo; seu relato continua guardado como descrição.",
        );
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
        if (!checkConsistency(offerTips)) offerTips();
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
  // Dicas seguras da IA. Na revisão, antes de enviar; no caminho da IA (`early`), logo depois de
  // confirmar o rascunho, antes de perguntar os dados — se resolver, ninguém preenche nada.
  function offerTips(tips = state.review?.tips || [], next = askAuthorization, early = false) {
    if (
      !tips.length ||
      !policy.selfHelpEligible(state.item, state.equipmentIntent) ||
      state.selfHelp === "continued"
    )
      return next();
    checkpoint(() => offerTips(tips, next, early));
    const bubble = aiMessage(
      early
        ? "Antes de completar o chamado, vale tentar estes passos rápidos:"
        : "Antes de enviar o chamado, vale tentar estes passos rápidos:",
    );
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
          label: early ? "Não resolveu, completar o chamado" : "Não resolveu, seguir com o chamado",
          value: "go",
          icon: "fa-paper-plane",
          primary: true,
        },
        { label: "Resolveu! Não preciso do chamado", value: "solved", icon: "fa-circle-check" },
      ],
      (value) => {
        metrics.update({ tips: value === "solved" ? "resolveu" : "seguiu para o chamado" });
        if (value === "solved") return resolvedBySelf(next);
        logSelfHelp("continued");
        if (early) message("Certo, vamos completar o chamado.");
        next();
      },
      "OS PASSOS RESOLVERAM?",
    );
  }
  // "Resolveu!": nada é enviado. A nota de facilidade também vale aqui (antes só aparecia depois
  // de um envio, e quem resolvia pelas dicas ficava fora da métrica de facilidade).
  function resolvedBySelf(next = askAuthorization) {
    checkpoint(() => resolvedBySelf(next));
    logSelfHelp("resolved");
    metrics.update({ stage: "resolvido sem chamado" });
    message("Que ótimo! Registrei que os passos resolveram, sem abrir chamado.");
    byId("new-chat").hidden = false;
    byId("mobile-new-chat").hidden = false;
    askEase(() => afterResolved(next), true);
  }
  function afterResolved(next) {
    message("Se voltar a acontecer, é só continuar daqui ou abrir um novo atendimento.");
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
        next();
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
    // O assunto só muda quando o pedido muda: revisar anexos ou trocar o nome não chama a IA.
    const key = [
      state.item.id,
      state.equipmentIntent,
      fullDescription(),
      JSON.stringify(state.answers),
    ].join("|");
    if (state.subject && state.subjectKey === key) return showSummary();
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
    // Assunto local (IA fora do ar) não fica guardado: a próxima vez tenta a IA de novo.
    state.subjectKey = result.source === "ai" ? key : "";
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
  // `solved`: a pessoa resolveu pelas dicas, sem chamado. A nota é pedida uma vez por conversa.
  function askEase(next = afterSent, solved = false) {
    if (state.easeAsked) return next();
    state.easeAsked = true;
    message(
      solved
        ? "Uma pergunta rápida: quão fácil foi resolver por aqui?"
        : "Antes de terminar, uma pergunta rápida: quão fácil foi abrir este chamado?",
    );
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
        if (value === "skip") return next();
        metrics.update({ ease: Number(value) });
        askMissing(Number(value), next);
      },
      "SUA OPINIÃO AJUDA A MELHORAR",
    );
  }
  function askMissing(ease, next = afterSent) {
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
        next();
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
    const other = otherRequestItem();
    choose(
      [
        ...(other !== undefined
          ? [
              {
                label: "Abrir o outro pedido que você contou",
                value: "other",
                icon: "fa-share",
                primary: true,
              },
            ]
          : []),
        { label: "Novo atendimento", value: "new", icon: "fa-plus", primary: other === undefined },
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
        if (value === "other") return openOtherRequest(other);
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
  // Segundo pedido do mesmo relato (a IA avisou no rascunho): o próximo caminho sugerido para o
  // relato, ou null para escolher pelas opções; undefined quando não há outro pedido ou quando
  // este já é o segundo chamado do relato.
  function otherRequestItem() {
    if (!state.draftInfo?.otherRequest || !state.receipt || state.secondRequest) return undefined;
    return (
      (state.suggestion?.result?.candidates || [])
        .map((candidate) =>
          desk.knowledgeBase.items.find((item) => item.id === candidate?.item?.id),
        )
        .find(
          (item) =>
            item && item.id !== state.item.id && desk.classifier.isAllowed(item, state.sector),
        ) || null
    );
  }
  // Novo chamado na mesma conversa, com os dados da pessoa e o mesmo relato.
  function openOtherRequest(item) {
    metrics.reset();
    metrics.begin();
    metrics.update({ stage: "identificação" });
    metrics.chooseMethod("descrição");
    Object.assign(state, {
      requestId: crypto.randomUUID(),
      area: "",
      item: null,
      answers: {},
      prefilled: {},
      description: state.suggestion?.text || state.description,
      followUps: [],
      attachments: [],
      subject: "",
      subjectKey: "",
      source: "local",
      review: null,
      receipt: null,
      equipmentIntent: "",
      authorization: null,
      fromDescribe: true,
      autoDescribed: false,
      selfHelp: "",
      declined: [],
      keepAnswered: false,
      switchedDraft: false,
      draftInfo: null,
      complemented: [],
      secondRequest: true,
    });
    byId("new-chat").hidden = true;
    byId("mobile-new-chat").hidden = true;
    context();
    stage("report");
    message("Vamos abrir o outro pedido. Uso o mesmo relato e os seus dados.");
    if (!item) {
      message("Escolha o tipo de atendimento pelas opções; seu relato continua guardado.");
      return askArea();
    }
    buildDraft(item, [], true);
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
        { label: "Corrigir um dado", value: "edit", icon: "fa-pen" },
        ...(state.attachments.length
          ? [{ label: "Revisar anexos", value: "files", icon: "fa-paperclip" }]
          : []),
      ],
      (action) => {
        if (action === "edit") return askCorrection();
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
      context();
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
