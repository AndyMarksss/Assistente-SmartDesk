"use strict";
// Exibição do chat: rótulos legíveis, ícones, datas e descrição final do chamado.
// Só apresentação: IDs e valores canônicos da matriz não mudam.
(function (desk) {
  const PENDING_LINK = "Ainda não informado";
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
  const sectorIcon = (sector) => (SECTOR_ICONS.find(([pattern]) => pattern.test(sector)) || [])[1];
  const WEEKDAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  function shortDate(iso) {
    const date = new Date(iso + "T12:00:00Z");
    return iso.split("-").reverse().join("/") + " (" + WEEKDAYS[date.getUTCDay()] + ")";
  }
  // Valor de um campo como a pessoa lê: datas em dd/mm/aaaa, link pendente explicado.
  function formatValue(field, value) {
    if (!value) return "";
    if (field?.type === "date" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return shortDate(value);
    if (field?.type === "url" && value === PENDING_LINK) return "Envio depois";
    return value;
  }
  // Texto final do chamado: relato original + perguntas do assistente com as respostas.
  function composeDescription(original, followUps = [], limit = 2000) {
    const answered = followUps.filter((entry) => entry.answer);
    if (!answered.length) return original.slice(0, limit);
    let text = original.trim() + "\n\nPerguntas do assistente:";
    for (const entry of answered) text += "\n• " + entry.question + "\n  Resposta: " + entry.answer;
    return text.length > limit ? text.slice(0, limit - 1) + "…" : text;
  }
  // Conveniência opcional neste dispositivo; nunca enviada a lugar nenhum por si só.
  const profile = {
    key: "smartdesk-profile",
    read() {
      try {
        const value = JSON.parse(localStorage.getItem(this.key) || "null");
        return value &&
          desk.requestPolicy.fullName(value.name) &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email || "") &&
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
  desk.chatFormat = {
    PENDING_LINK,
    displayLabel,
    needLabel,
    AREA_ICONS,
    iconFor,
    sectorIcon,
    shortDate,
    formatValue,
    composeDescription,
    profile,
  };
})(window.SmartDesk);
