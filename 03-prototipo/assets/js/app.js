"use strict";
(function (desk) {
  if (window.smartdeskWrongRuntime) return;
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
  // Display only: canonical labels and IDs stay untouched for validation and the spreadsheet.
  const LABELS = {
    COMPUTADOR: "Computador",
    INTERNET: "Internet",
    INTRANET: "Intranet",
    "MENTOR WEB": "Mentor Web",
    QUICKBOOKS: "QuickBooks",
    CÂMERAS: "Câmeras",
  };
  const displayLabel = (label) => LABELS[label] || label;
  const needLabel = (item) => item.path.map(displayLabel).join(" › ");
  const AREA_ICONS = {
    Audiovisual: "fa-video",
    Impressora: "fa-print",
    Google: "fa-envelope",
    TI: "fa-computer",
  };
  const PATH_ICONS = [
    [/rede|conectad/i, "fa-network-wired"],
    [/wi-?fi|internet|login de acesso/i, "fa-wifi"],
    [/^não liga$/i, "fa-power-off"],
    [/intranet|^sites$/i, "fa-globe"],
    [/mentor/i, "fa-graduation-cap"],
    [/quickbooks/i, "fa-calculator"],
    [/câmeras/i, "fa-video"],
    [/dúvidas/i, "fa-circle-question"],
    [/sugest/i, "fa-lightbulb"],
    [/outros/i, "fa-ellipsis"],
    [/headset|fone/i, "fa-headphones"],
    [/mouse/i, "fa-computer-mouse"],
    [/teclado/i, "fa-keyboard"],
    [/cd\/dvd/i, "fa-compact-disc"],
    [/lentid/i, "fa-gauge"],
    [/programas|software|instala/i, "fa-download"],
    [/chromebook|notebook/i, "fa-laptop"],
    [/reserva/i, "fa-calendar-check"],
    [/toner|tinta/i, "fa-fill-drip"],
    [/papel|atolad/i, "fa-file"],
    [/scanner/i, "fa-file-import"],
    [/grampo/i, "fa-paperclip"],
    [/mancha/i, "fa-droplet"],
    [/lâmpada|estufa/i, "fa-fire"],
    [/projetor/i, "fa-display"],
    [/microfone/i, "fa-microphone"],
    [/caixa de som/i, "fa-volume-high"],
    [/hdmi|cabo/i, "fa-plug"],
    [/gmail/i, "fa-envelope"],
    [/drive/i, "fa-folder-open"],
    [/planilhas/i, "fa-table"],
    [/documentos|relatório/i, "fa-file-lines"],
    [/apresenta/i, "fa-display"],
    [/agendas/i, "fa-calendar-days"],
    [/classroom/i, "fa-chalkboard-user"],
    [/grupos/i, "fa-people-group"],
    [/senha/i, "fa-key"],
    [/notas|diário/i, "fa-book"],
    [/remanejamento/i, "fa-right-left"],
    [/erro/i, "fa-triangle-exclamation"],
    [/login|acesso/i, "fa-user-plus"],
    [/atualiza/i, "fa-pen-to-square"],
    [/solicita/i, "fa-inbox"],
    [/computador/i, "fa-computer"],
    [/impressora|imprime/i, "fa-print"],
  ];
  const iconFor = (label, area) =>
    (PATH_ICONS.find(([pattern]) => pattern.test(label)) || [])[1] ||
    AREA_ICONS[area] ||
    "fa-arrow-right";
  const SECTOR_ICONS = [
    [/^coordenação/i, "fa-chalkboard-user"],
    [/^orientação/i, "fa-compass"],
    [/cobrança|financeiro/i, "fa-coins"],
    [/compras/i, "fa-cart-shopping"],
    [/direção/i, "fa-building-columns"],
    [/enfermaria/i, "fa-kit-medical"],
    [/esporte/i, "fa-futbol"],
    [/inspetoria/i, "fa-clipboard-list"],
    [/limpeza/i, "fa-broom"],
    [/marketing/i, "fa-bullhorn"],
    [/portaria/i, "fa-door-open"],
    [/recursos humanos/i, "fa-people-group"],
    [/maker/i, "fa-screwdriver-wrench"],
    [/secretaria/i, "fa-folder-open"],
    [/provas/i, "fa-file-pen"],
    [/^te$/i, "fa-microchip"],
    [/^ti$/i, "fa-laptop-code"],
  ];
  // Quick paths taken from the matrix test scenarios; each still respects sector rules.
  const SHORTCUTS = [
    ["IMP-008", "Papel atolado"],
    ["IMP-010", "Toner ou tinta"],
    ["TI-NET-003", "Wi-Fi com problema"],
    ["TI-COMP-004", "Computador lento"],
    ["GOO-011", "Esqueci a senha do Google"],
    ["GOO-010", "Reservar Chromebook"],
  ];
  // Opt-in convenience on this device only; never sent anywhere by itself.
  const profile = {
    key: "smartdesk-profile",
    read() {
      try {
        const value = JSON.parse(localStorage.getItem(this.key) || "null");
        return value &&
          desk.requestPolicy.fullName(value.name) &&
          EMAIL.test(value.email || "") &&
          desk.flows.sectors.includes(value.sector)
          ? value
          : null;
      } catch {
        return null;
      }
    },
    save(value) {
      try {
        localStorage.setItem(
          this.key,
          JSON.stringify({ name: value.name, email: value.email, sector: value.sector }),
        );
        return true;
      } catch {
        return false;
      }
    },
    clear() {
      try {
        localStorage.removeItem(this.key);
      } catch {}
    },
  };
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
      state: { ...state, answers: { ...state.answers }, attachments: [...state.attachments] },
    });
  }
  function back() {
    if (saving || history.length < 2) return;
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
      const el = document.querySelector('[data-stage="' + name + '"]');
      el.classList.toggle("done", i < index);
      const dot = el.querySelector(".journey-dot");
      dot.textContent = i < index ? "✓" : String(i + 1);
      dot.setAttribute("aria-hidden", "true");
      el.setAttribute(
        "aria-label",
        i +
          1 +
          ". " +
          ["Boas-vindas", "Escolhas", "Revisão", "Enviado"][i] +
          (i < index ? " — concluída" : name === value ? " — etapa atual" : " — próxima etapa"),
      );
      if (name === value) el.setAttribute("aria-current", "step");
      else el.removeAttribute("aria-current");
    });
  }
  function context() {
    byId("context-name").textContent = state.name || "Vamos nos conhecer";
    byId("context-email").textContent = state.email || "Ainda não informado";
    byId("context-sector").textContent = state.sector || "Ainda não informado";
    byId("context-need").textContent = state.item
      ? needLabel(state.item)
      : state.area || "Vamos descobrir juntos";
    byId("edit-context").hidden = !state.sector;
  }
  function lock(caption = "ESCOLHA UMA OPÇÃO PARA CONTINUAR") {
    // Keep the response area stable while replies are queued; release after controls render.
    dock.style.minHeight =
      Math.min(
        dock.getBoundingClientRect().height,
        byId("chat-shell")?.clientHeight * 0.48 || window.innerHeight * 0.48,
      ) + "px";
    byId("choices").closest(".interaction-dock").setAttribute("aria-busy", "false");
    document.querySelector(".submission-error")?.remove();
    controlVersion++;
    textHandler = null;
    validator = null;
    choices.replaceChildren();
    byId("structured-field").replaceChildren();
    byId("structured-field").classList.remove("structured-temporal", "structured-picker");
    byId("attachment-panel").hidden = true;
    input.disabled = true;
    input.value = "";
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
  function choose(options, callback, caption) {
    lock(caption);
    readyControls(() => {
      let shortcuts = null;
      options.forEach((entry, index) => {
        const item = typeof entry === "string" ? { label: entry, value: entry } : entry;
        const button = document.createElement("button");
        button.type = "button";
        button.style.setProperty("--option-delay", index * 70 + "ms");
        button.className =
          "choice" +
          (item.primary ? " primary" : "") +
          (item.className ? " " + item.className : "") +
          (item.group === "shortcut" ? " shortcut-choice" : "");
        const icon = document.createElement("i");
        icon.className = "fa-solid " + (item.icon || "fa-arrow-right");
        icon.setAttribute("aria-hidden", "true");
        const text = document.createElement("span");
        text.textContent = item.label;
        if (item.description) {
          button.classList.add("area-choice");
          const detail = document.createElement("small");
          detail.textContent = item.description;
          text.append(detail);
        }
        button.append(icon, text);
        button.addEventListener("click", () => {
          if (saving) return;
          choices.querySelectorAll("button").forEach((el) => (el.disabled = true));
          message(item.label, "user");
          callback(item.value);
        });
        if (item.group === "shortcut") {
          if (!shortcuts) {
            shortcuts = document.createElement("div");
            shortcuts.className = "choice-shortcuts";
            shortcuts.setAttribute("role", "group");
            shortcuts.setAttribute("aria-label", "Atalhos rápidos");
            const title = document.createElement("span");
            title.className = "shortcut-title";
            title.innerHTML = '<i class="fa-solid fa-bolt" aria-hidden="true"></i> Atalhos';
            shortcuts.append(title);
            choices.append(shortcuts);
          }
          shortcuts.append(button);
        } else choices.insertBefore(button, shortcuts);
      });
      requestAnimationFrame(scroll);
    });
  }
  function freeText(placeholder, callback, max = 1000, validation = null, prefill = "") {
    lock("PREENCHA ESTE DADO DO CHAMADO");
    readyControls(() => {
      byId("frozen-label").hidden = true;
      input.disabled = false;
      input.inputMode = placeholder.includes("e-mail") ? "email" : "text";
      input.setAttribute("autocapitalize", placeholder.includes("e-mail") ? "none" : "sentences");
      input.maxLength = max;
      input.placeholder = placeholder;
      input.value = prefill;
      byId("composer").classList.remove("locked");
      byId("send").disabled = !prefill.trim();
      byId("composer-hint").textContent = "Enter para enviar · Shift + Enter para uma nova linha";
      byId("char-count").hidden = false;
      byId("char-count").textContent = input.value.length + " / " + max;
      textHandler = callback;
      validator = validation;
      input.focus();
    });
  }
  const { structured, picker } = desk.formControls.create({
    policy: desk.requestPolicy,
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
      timeout: route === "/api/tickets" ? 65000 : 15000,
    });
    if (
      token === generation &&
      ["/api/subject", "/api/next-prompt", "/api/assist", "/api/analyze"].includes(route)
    )
      setAiStatus(result.source === "ai");
    return result;
  }
  const selectionPayload = () => ({
    sector: state.sector,
    selectionId: state.item.id,
    answers: state.answers,
    description: state.description,
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
  function start() {
    if (saving) return;
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
      description: "",
      attachments: [],
      subject: "",
      source: "local",
      draftId: null,
      review: null,
      fromDescribe: false,
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
    const known = profile.read();
    if (known && !state.name) {
      const bubble = message("");
      bubble.append(document.createTextNode("Que bom te ver de novo, "));
      const strong = document.createElement("strong");
      strong.textContent = known.name.split(/\s+/)[0];
      bubble.append(
        strong,
        document.createTextNode("! Posso usar os dados que você salvou neste dispositivo?"),
      );
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
          : [{ label: "Sim, vamos começar", value: "Sim, vamos começar", primary: true }]),
        "Como funciona?",
      ],
      (answer) => {
        if (answer === "known") {
          byId("welcome").hidden = true;
          Object.assign(state, { name: known.name, email: known.email, sector: known.sector });
          context();
          message(
            "Perfeito! Seus dados estão no resumo ao lado. Vamos direto ao que você precisa.",
          );
          return askArea();
        }
        if (answer === "other") {
          profile.clear();
          byId("welcome").hidden = true;
          message("Tudo bem! Apaguei os dados salvos neste dispositivo.");
          return askName();
        }
        if (answer === "Como funciona?") {
          message(
            "Eu te acompanho uma pergunta por vez. Primeiro, informe seu nome e sobrenome, e-mail institucional e setor.",
          );
          message(
            "Depois, toque nos botões para escolher o tipo de ajuda — ou conte com suas palavras e deixe a IA sugerir o caminho. Quando aparecer um campo de texto, preencha apenas o que a pergunta pede.",
          );
          message(
            "Depois da descrição, a IA pode pedir um detalhe que faltou e sugerir passos rápidos e seguros. Antes de enviar, conferimos tudo juntos; Voltar uma etapa corrige uma resposta e Recomeçar abre o atendimento do zero.",
          );
          return offerStart();
        }
        byId("welcome").hidden = true;
        askName();
      },
    );
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
        const strong = document.createElement("strong");
        strong.textContent = state.name.split(/\s+/)[0];
        bubble.append(strong, document.createTextNode("! Vamos cuidar disso juntos."));
        askEmail();
      },
      100,
      (value) =>
        desk.requestPolicy.fullName(value)
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
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
          ? null
          : "Esse e-mail parece incompleto. Confira o nome, o @ e o domínio (ex.: nome@instituicao.com.br).",
      state.email,
    );
  }
  function askSector() {
    checkpoint(askSector);
    stage("context");
    message("Agora, em qual setor você trabalha? Escolha na lista abaixo.");
    picker(
      "Seu setor",
      desk.flows.sectors.map((value) => ({
        value,
        icon: (SECTOR_ICONS.find(([pattern]) => pattern.test(value)) || [])[1],
      })),
      (sector) => {
        state.sector = sector;
        context();
        askArea();
      },
      { placeholder: "Digite para buscar, ex.: secretaria" },
    );
  }
  function askArea() {
    checkpoint(askArea);
    stage("report");
    message(
      "Qual tipo de ajuda você precisa? Veja os exemplos abaixo e escolha a opção mais próxima.",
    );
    choose(
      [
        ...desk.flows.areas.map((area) => ({
          label: area,
          value: area,
          description: {
            Audiovisual: "Projetor, som, microfone e cabo HDMI.",
            Impressora: "Impressão, papel, toner e tinta.",
            Google: "Gmail, Drive e ferramentas do Google.",
            TI: "Computador, internet, sistemas e acessórios.",
          }[area],
          icon: AREA_ICONS[area],
        })),
        {
          label: "Descrever com minhas palavras",
          value: "__describe",
          description: "Conte o que houve e a IA sugere o caminho.",
          icon: "fa-wand-magic-sparkles",
          className: "ai-choice",
        },
        ...SHORTCUTS.map(([id, label]) => ({
          id,
          label,
          value: "item:" + id,
          icon: iconFor(desk.knowledgeBase.items.find((item) => item.id === id)?.need || "", ""),
          group: "shortcut",
        })).filter((entry) =>
          desk.classifier.isAllowed(
            desk.knowledgeBase.items.find((item) => item.id === entry.id),
            state.sector,
          ),
        ),
      ],
      (area) => {
        if (area === "__describe") return askDescribe();
        if (area.startsWith("item:"))
          return pickItem(desk.knowledgeBase.items.find((item) => item.id === area.slice(5)));
        state.equipmentIntent = "";
        state.authorization = null;
        state.area = area;
        state.item = null;
        state.answers = {};
        state.subject = "";
        state.draftId = null;
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
            prefix.map(displayLabel).join(" › ") +
            ", qual destas opções combina com o que está acontecendo?"
        : "Certo, vamos por " +
            state.area +
            ". Qual destas opções tem mais a ver com o que você precisa?",
    );
    choose(
      labels.map((label) => ({
        label: displayLabel(label),
        value: label,
        icon: iconFor(label, state.area),
      })),
      (value) => {
        if (value === "__back") return prefix.length ? askPath(prefix.slice(0, -1)) : askArea();
        const next = [...prefix, value],
          item = allowed.find(
            (item) =>
              item.path.length === next.length && next.every((part, i) => item.path[i] === part),
          );
        if (!item) return askPath(next);
        pickItem(item);
      },
    );
  }
  function pickItem(item) {
    state.area = item.area;
    state.item = item;
    state.answers = {};
    state.equipmentIntent = "";
    state.authorization = null;
    state.subject = "";
    state.review = null;
    state.draftId = null;
    context();
    message(desk.conversationCopy.opening(item));
    askEquipmentIntent();
  }
  // Optional shortcut beside the guided choices: the model only suggests allowed paths.
  function askDescribe() {
    checkpoint(askDescribe);
    aiMessage(
      "Conte com suas palavras o que está acontecendo. Eu sugiro o tipo de atendimento e você confirma antes de seguir.",
    );
    freeText(
      "Ex.: a impressora da secretaria está prendendo as folhas…",
      (text) => suggestPaths(text.trim()),
      600,
      (value) =>
        desk.requestPolicy.usefulDescription(value)
          ? null
          : "Conte o que acontece com algumas palavras para eu encontrar o caminho.",
      state.fromDescribe ? state.description : "",
    );
  }
  async function suggestPaths(text) {
    // Reuse the last suggestion when returning with Voltar: no second model call.
    let result = state.suggestion?.text === text ? state.suggestion.result : null;
    if (!result) {
      setAiStatus("busy");
      lock("A IA ESTÁ LENDO SEU RELATO");
      const token = generation,
        wait = thinking("Lendo seu relato e procurando o melhor caminho…");
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
      message(
        "Não encontrei um caminho seguro só pelo relato. Vamos escolher juntos pelas opções — guardei seu texto para a descrição.",
      );
      return askArea();
    }
    checkpoint(() => suggestPaths(text));
    aiMessage(
      items.length === 1
        ? "Pelo que você contou, este parece ser o caminho certo:"
        : "Encontrei estes caminhos. Qual combina mais com o seu caso?",
      result.source === "ai",
    );
    choose(
      [
        ...items.map((item, index) => ({
          label: needLabel(item),
          value: "item:" + item.id,
          description: item.area + (index === 0 ? " · mais provável" : ""),
          icon: iconFor(item.need, item.area),
          primary: index === 0,
        })),
        { label: "Nenhum desses — escolher pelas opções", value: "__manual", icon: "fa-list" },
      ],
      (value) => {
        if (value === "__manual") return askArea();
        pickItem(desk.knowledgeBase.items.find((item) => item.id === value.slice(5)));
      },
      "CONFIRME O CAMINHO SUGERIDO",
    );
  }
  function askEquipmentIntent() {
    if (!desk.requestPolicy.asksEquipmentIntent(state.item)) return askField(0);
    checkpoint(askEquipmentIntent);
    message(
      "É um problema com o item que você já usa ou você quer solicitar um item novo ou diferente?",
    );
    choose(
      [
        { label: "Meu item está com defeito", value: "repair" },
        { label: "Quero um item novo ou diferente", value: "purchase" },
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
      if (
        state.item.fields.some((f) => f.id === "descricao-do-problema") &&
        state.answers["descricao-do-problema"]
      ) {
        state.description = state.answers["descricao-do-problema"];
        return reviewWithAI();
      }
      return askDescription();
    }
    const field = fields[index];
    if (field.when && state.answers[field.when.field] !== field.when.equals)
      return askField(index + 1);
    checkpoint(() => askField(index));
    if (field.id === "computador") {
      const hardware = desk.requestPolicy.asksEquipmentIntent(state.item);
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
          },
          { label: "Outra pessoa", value: "other" },
          { label: "Uso compartilhado", value: "shared" },
        ],
        (value) => {
          if (value === "other")
            return freeText(
              "Nome e sobrenome de quem usa o computador…",
              (owner) => {
                state.answers[field.id] = owner.trim();
                askField(index + 1);
              },
              100,
              (v) =>
                desk.requestPolicy.fullName(v)
                  ? null
                  : "Informe o nome e sobrenome de quem usa o computador.",
            );
          if (value === "shared")
            return freeText(
              "Onde fica o computador compartilhado? Ex.: recepção…",
              (place) => {
                state.answers[field.id] = "Compartilhado — " + place;
                askField(index + 1);
              },
              200,
            );
          state.answers[field.id] = value;
          askField(index + 1);
        },
      );
    }
    message(desk.conversationCopy.field(state.item, field));
    const done = (value) => {
      state.answers[field.id] = value;
      askField(index + 1);
    };
    if (field.type === "choice") return choose(field.options, done);
    if (["date", "time"].includes(field.type))
      return structured(field.label, field.type, null, done);
    const validate = (value) =>
      field.id === "descricao-do-problema" && !desk.requestPolicy.usefulDescription(value)
        ? "Me conte o que acontece com o cabo. Só o número da sala não explica o problema."
        : field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Informe um e-mail válido."
          : field.type === "url" && !/^https?:\/\/[^\s]+$/i.test(value)
            ? "Informe um link começando com https:// ou http://."
            : null;
    freeText(
      field.id === "descricao-do-problema"
        ? "Conte o que acontece com o cabo HDMI…"
        : field.label + "…",
      done,
      1000,
      validate,
      state.answers[field.id] ||
        (field.id === "descricao-do-problema" && state.fromDescribe ? state.description : ""),
    );
  }
  function askDescription() {
    checkpoint(askDescription);
    message(desk.conversationCopy.description(state.item, state.equipmentIntent));
    if (state.fromDescribe && state.description)
      message("Já deixei o que você escreveu no campo abaixo. Ajuste se quiser e envie.");
    freeText(
      "Conte aqui o problema ou pedido…",
      (description) => {
        state.description = description;
        if (state.item.fields.some((f) => f.id === "descricao-do-problema"))
          state.answers["descricao-do-problema"] = description;
        state.subject = "";
        state.draftId = null;
        reviewWithAI();
      },
      state.item.fields.some((f) => f.id === "descricao-do-problema") ? 1000 : 2000,
      (value) =>
        desk.requestPolicy.usefulDescription(value)
          ? null
          : "Conte o que acontece ou o que você precisa. Só um número ou símbolo não explica o chamado.",
      state.description,
    );
  }
  function setDescription(text) {
    const hasField = state.item.fields.some((f) => f.id === "descricao-do-problema");
    state.description = text.slice(0, hasField ? 1000 : 2000);
    if (hasField) state.answers["descricao-do-problema"] = state.description;
  }
  async function reviewWithAI() {
    const key = state.item.id + "|" + state.description;
    if (state.review?.key === key) return offerTips();
    setAiStatus("busy");
    lock("A IA ESTÁ REVISANDO SEU RELATO");
    const token = generation,
      wait = thinking("Conferindo se falta algum detalhe para a equipe…");
    let result = {};
    try {
      result = await api("/api/assist", selectionPayload());
    } catch {
      if (token === generation) refreshStatus();
    }
    messages.dismiss(wait);
    if (token !== generation) return;
    state.review = {
      key,
      question: typeof result.question === "string" ? result.question : "",
      tips: Array.isArray(result.tips) ? result.tips.filter((t) => typeof t === "string") : [],
    };
    if (state.review.question) return askFollowUp();
    offerTips();
  }
  function askFollowUp() {
    checkpoint(askFollowUp);
    const question = state.review.question;
    aiMessage(question);
    freeText(
      "Sua resposta…",
      (answer) => {
        setDescription(state.description + "\n\nComplemento: " + question + " " + answer.trim());
        state.review.key = state.item.id + "|" + state.description;
        offerTips();
      },
      400,
    );
    readyControls(() => {
      const skip = document.createElement("button");
      skip.type = "button";
      skip.className = "choice skip-choice";
      skip.innerHTML = '<i class="fa-solid fa-forward" aria-hidden="true"></i>';
      const label = document.createElement("span");
      label.textContent = "Pular esta pergunta";
      skip.append(label);
      skip.addEventListener("click", () => {
        message("Prefiro pular", "user");
        lock();
        offerTips();
      });
      choices.append(skip);
    });
  }
  function offerTips() {
    const tips = state.review?.tips || [];
    if (!tips.length || !desk.requestPolicy.selfHelpEligible(state.item, state.equipmentIntent))
      return askAuthorization();
    checkpoint(offerTips);
    const bubble = aiMessage("Enquanto a equipe não chega, vale tentar:");
    const list = document.createElement("ol");
    list.className = "tip-list";
    tips.forEach((tip) => {
      const li = document.createElement("li");
      li.textContent = tip;
      list.append(li);
    });
    const note = document.createElement("small");
    note.className = "tip-note";
    note.textContent =
      "Sugestões da IA. Se não se sentir à vontade com algum passo, siga direto para o chamado.";
    bubble.append(list, note);
    choose(
      [
        { label: "Continuar com o chamado", value: "go", icon: "fa-paper-plane", primary: true },
        { label: "Resolveu! Não preciso mais", value: "solved", icon: "fa-circle-check" },
      ],
      (value) => (value === "solved" ? resolvedBySelf() : askAuthorization()),
      "AS DICAS AJUDARAM?",
    );
  }
  function resolvedBySelf() {
    checkpoint(resolvedBySelf);
    message(
      "Que ótimo! Como resolveu por aqui, nenhum chamado foi enviado. Se voltar a acontecer, é só abrir um novo atendimento.",
    );
    choose(
      [
        { label: "Novo atendimento", value: "new", icon: "fa-plus", primary: true },
        { label: "Abrir o chamado mesmo assim", value: "open", icon: "fa-paper-plane" },
      ],
      (value) => (value === "new" ? start() : askAuthorization()),
      "ATENDIMENTO ENCERRADO SEM CHAMADO",
    );
  }
  function askAuthorization() {
    if (
      !desk.requestPolicy.needsAuthorization(state.item, state.description, state.equipmentIntent)
    ) {
      state.authorization = null;
      return askAttachments();
    }
    checkpoint(askAuthorization);
    message(
      "Para esse pedido de compra ou de um item novo, sua liderança já deu o aval? Vou registrar essa informação para a equipe conferir.",
    );
    choose(["Já foi autorizado", "Ainda não tenho autorização"], (answer) => {
      if (answer === "Ainda não tenho autorização") {
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
          desk.requestPolicy.fullName(v)
            ? null
            : "Informe o nome e sobrenome da liderança que autorizou.",
      );
    });
  }
  function askAttachments() {
    checkpoint(askAttachments);
    message(
      state.attachments.length
        ? "Você pode adicionar outro arquivo ou continuar para a revisão."
        : "Você tem uma foto ou arquivo que ajude a mostrar isso? Pode anexar agora ou seguir sem anexo.",
    );
    askAttachmentsControls();
  }
  function askAttachmentsControls() {
    choose(
      [
        { label: "Adicionar anexo", value: "add", icon: "fa-paperclip" },
        {
          label: state.attachments.length ? "Continuar com os anexos" : "Continuar sem anexo",
          value: "next",
          icon: "fa-check",
        },
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
    panel.replaceChildren();
    const note = document.createElement("p");
    note.textContent = desk.attachments.describe() + " Os anexos não são enviados à IA.";
    panel.append(note);
    for (const [index, file] of state.attachments.entries()) {
      const row = document.createElement("div");
      row.className = "attachment-row";
      const label = document.createElement("span");
      label.textContent = file.name + " · " + (file.size / 1024).toFixed(1) + " KB";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "small-action";
      remove.textContent = "Remover";
      remove.setAttribute("aria-label", "Remover " + file.name);
      remove.addEventListener("click", () => {
        state.attachments.splice(index, 1);
        state.draftId = null;
        askAttachmentsControls();
      });
      row.append(label, remove);
      panel.append(row);
    }
  }
  byId("attachment-input").addEventListener("change", () => {
    const result = desk.attachments.merge(state.attachments, [...byId("attachment-input").files]);
    if (!result.error) {
      state.attachments = result.files;
      state.draftId = null;
    }
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
      ["Área", state.area],
      ["Necessidade", needLabel(state.item)],
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
          field.id === "computador" ? "Quem utiliza o computador" : field.label,
          state.answers[field.id],
        ]),
      ["Descrição", state.description],
      ...(state.attachments.length
        ? [["Anexos", state.attachments.map((file) => file.name).join("\n")]]
        : []),
    ];
  }
  function showSummary() {
    checkpoint(showSummary);
    stage("summary");
    const bubble = message("Confira seu chamado antes de enviar:");
    const card = document.createElement("section");
    card.className = "summary-card";
    card.setAttribute("aria-label", "Resumo do chamado");
    const head = document.createElement("header");
    head.className = "summary-head";
    const icon = document.createElement("span");
    icon.className = "summary-icon";
    icon.innerHTML =
      '<i class="fa-solid ' + iconFor(state.item.need, state.area) + '" aria-hidden="true"></i>';
    const titles = document.createElement("div");
    const kicker = document.createElement("small");
    kicker.textContent = state.area;
    const heading = document.createElement("h3");
    heading.textContent = needLabel(state.item);
    titles.append(kicker, heading);
    const ready = document.createElement("span");
    ready.className = "summary-ready";
    ready.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Pronto';
    head.append(icon, titles, ready);
    const dl = document.createElement("dl");
    for (const [label, value] of summaryRows()) {
      if (["Descrição", "Anexos", "Área", "Necessidade"].includes(label)) continue;
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = value;
      row.append(dt, dd);
      dl.append(row);
    }
    const story = document.createElement("div");
    story.className = "summary-description";
    const storyLabel = document.createElement("small");
    storyLabel.textContent = "Descrição";
    const storyText = document.createElement("p");
    storyText.textContent = state.description;
    story.append(storyLabel, storyText);
    card.append(head, dl, story);
    if (state.attachments.length) {
      const files = document.createElement("ul");
      files.className = "summary-files";
      files.setAttribute("aria-label", "Anexos");
      for (const file of state.attachments) {
        const li = document.createElement("li");
        li.innerHTML = '<i class="fa-solid fa-paperclip" aria-hidden="true"></i>';
        li.append(document.createTextNode(" " + file.name));
        files.append(li);
      }
      card.append(files);
    }
    bubble.append(card);
    summaryActions();
  }
  function receiptCard(number) {
    const card = document.createElement("section");
    card.className = "receipt-card";
    card.setAttribute("aria-label", "Comprovante do chamado " + number);
    const top = document.createElement("div");
    top.className = "receipt-top";
    const label = document.createElement("small");
    label.textContent = "Número do chamado";
    const value = document.createElement("strong");
    value.className = "receipt-number";
    value.textContent = number;
    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "small-action receipt-copy";
    copy.innerHTML = '<i class="fa-solid fa-copy" aria-hidden="true"></i> <span>Copiar</span>';
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(number);
        copy.querySelector("span").textContent = "Copiado!";
      } catch {
        copy.querySelector("span").textContent = "Selecione e copie";
      }
      setTimeout(() => (copy.querySelector("span").textContent = "Copiar"), 2200);
    });
    top.append(label, value, copy);
    const steps = document.createElement("ol");
    steps.className = "receipt-steps";
    [
      ["Recebido", "fa-check", true],
      ["Em atendimento", "fa-screwdriver-wrench", false],
      ["Finalizado", "fa-flag-checkered", false],
    ].forEach(([text, glyph, done]) => {
      const li = document.createElement("li");
      if (done) li.className = "done";
      li.innerHTML = '<i class="fa-solid ' + glyph + '" aria-hidden="true"></i>';
      li.append(document.createTextNode(" " + text));
      steps.append(li);
    });
    const note = document.createElement("p");
    note.className = "receipt-note";
    note.textContent = "A equipe usará " + state.email + " para o retorno deste chamado.";
    card.append(top, steps, note);
    return card;
  }
  function afterSent() {
    const known = profile.read();
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
              label: "Lembrar meus dados neste dispositivo",
              value: "remember",
              icon: "fa-user-check",
            },
      ],
      (value) => {
        if (value === "new") return start();
        if (value === "remember") {
          message(
            profile.save(state)
              ? "Pronto! Na próxima vez, você começa direto pela escolha da área. Use só em um dispositivo pessoal."
              : "Este navegador não permitiu salvar os dados. Tudo bem, é só informar de novo na próxima vez.",
          );
        } else {
          profile.clear();
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
        if (action === "edit") return askDescription();
        if (action === "files") return askAttachments();
        sendTicket();
      },
      failure
        ? "ENVIO NÃO CONFIRMADO · SEUS DADOS CONTINUAM AQUI"
        : "SEUS DADOS ESTÃO PRONTOS PARA ENVIO",
    );
    if (failure)
      readyControls(() => {
        const alert = document.createElement("p");
        alert.className = "submission-error";
        alert.setAttribute("role", "alert");
        alert.textContent = failure;
        choices.before(alert);
      });
  }
  async function sendTicket() {
    if (saving || state.receipt) return;
    saving = true;
    lock("ENVIANDO SEU CHAMADO");
    const pending = document.createElement("div");
    pending.className = "sending-status";
    pending.setAttribute("role", "status");
    pending.setAttribute("aria-live", "polite");
    const spinner = document.createElement("span");
    spinner.className = "sending-spinner";
    spinner.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.textContent = "Enviando seu chamado… Aguarde a confirmação.";
    pending.append(spinner, label);
    choices.append(pending);
    choices.closest(".interaction-dock").setAttribute("aria-busy", "true");
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
      });
      if (
        result.status !== "enviado" ||
        result.requestId !== state.requestId ||
        typeof result.number !== "string" ||
        !result.number.trim()
      )
        throw new Error("Não consegui confirmar o recebimento. Seus dados continuam aqui.");
      state.receipt = result;
      stage("sent");
      const confirmation = message(
        "Chamado " + result.number + " enviado! Seus dados foram registrados com sucesso.",
      );
      confirmation.parentNode.parentNode.classList.add("sent");
      confirmation.append(receiptCard(result.number));
      saving = false;
      afterSent();
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
  start();
  setInterval(refreshStatus, 30000);
})(window.SmartDesk);
