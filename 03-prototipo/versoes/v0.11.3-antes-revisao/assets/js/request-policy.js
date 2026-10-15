"use strict";
(function (desk) {
  const fullName = (value) =>
    typeof value === "string" &&
    value.trim().length <= 100 &&
    /^[\p{L}\p{M}]+(?:[’'\-][\p{L}\p{M}]+)*(?:\s+[\p{L}\p{M}]+(?:[’'\-][\p{L}\p{M}]+)*)+$/u.test(
      value.trim(),
    ) &&
    value
      .trim()
      .split(/\s+/)
      .filter((p) => !["de", "da", "do", "das", "dos", "e"].includes(p.toLowerCase())).length >= 2;
  const isRoutineMaintenance = (item) => item.id === "AV-007" || /cabo\s+hdmi/i.test(item.need);
  const asksEquipmentIntent = (item) =>
    ["TI-COMP-001", "TI-COMP-007", "TI-COMP-008"].includes(item.id);
  const needsAuthorization = (item, description = "", intent = "") => {
    if (isRoutineMaintenance(item) || intent === "repair") return false;
    if (intent === "purchase") return true;
    const text = description
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    if (
      /\b(nao|sem)\s+(preciso|quero|necessidade de)?\s*(comprar|compra|adquirir|aquisicao)\b/.test(
        text,
      )
    )
      return false;
    return (
      /\b(comprar|compra|adquirir|aquisicao)\b/.test(text) ||
      /\b(quero|preciso|solicito|solicitar)\b.{0,50}\b(teclado|mouse|headset|fone|notebook|computador|monitor|equipamento|kit)\b.{0,40}\b(novo|nova|novos|novas|sem fio)\b/.test(
        text,
      )
    );
  };
  function localDay(now = new Date()) {
    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
  }
  function dateValue(raw) {
    const v = String(raw).trim();
    let m = v.match(/^(\d{2})[/. -](\d{2})[/. -](\d{4})$/) || v.match(/^(\d{2})(\d{2})(\d{4})$/);
    const iso = m ? m[3] + "-" + m[2] + "-" + m[1] : v;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    const d = new Date(iso + "T12:00:00Z");
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso ? iso : null;
  }
  function timeValue(raw) {
    const v = String(raw).trim();
    const m = v.match(/^(\d{1,2})[:h](\d{2})$/i) || v.match(/^(\d{2})(\d{2})$/);
    if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) return null;
    return m[1].padStart(2, "0") + ":" + m[2];
  }
  const usefulDescription = (value) =>
    typeof value === "string" && (value.match(/[\p{L}]/gu) || []).length >= 3;
  // Defeitos que a própria pessoa pode tentar contornar com segurança. Reservas, compras,
  // acessos, senhas e instalações seguem direto para a equipe, sem dicas da IA.
  const SELF_HELP = [
    "AV-007",
    "IMP-002",
    "IMP-005",
    "IMP-006",
    "IMP-007",
    "IMP-008",
    "IMP-009",
    "GOO-001",
    "GOO-002",
    "GOO-003",
    "GOO-004",
    "GOO-005",
    "GOO-007",
    "GOO-008",
    "GOO-009",
    "GOO-012",
    "TI-COMP-001",
    "TI-COMP-002",
    "TI-COMP-003",
    "TI-COMP-004",
    "TI-COMP-005",
    "TI-COMP-007",
    "TI-COMP-008",
    "TI-NET-001",
    "TI-NET-003",
    "TI-MENT-002",
    "TI-MENT-005",
    "TI-QB-001",
  ];
  const selfHelpEligible = (item, intent = "") =>
    !!item && SELF_HELP.includes(item.id) && intent !== "purchase";
  // Pedidos (reservas, instalações, acessos, criações) não são defeitos: a IA não deve
  // perguntar "qual é o problema" nem sugerir consertos nesses caminhos.
  const REQUESTS = [
    "AV-001",
    "AV-002",
    "AV-003",
    "AV-004",
    "AV-005",
    "AV-006",
    "IMP-001",
    "IMP-003",
    "IMP-010",
    "GOO-010",
    "GOO-011",
    "TI-002",
    "TI-COMP-006",
    "TI-NET-002",
    "TI-INT-001",
    "TI-INT-002",
    "TI-INT-003",
    "TI-MENT-001",
    "TI-MENT-003",
    "TI-MENT-004",
    "TI-MENT-006",
    "TI-MENT-007",
    "TI-MENT-008",
    "TI-QB-002",
    "TI-CAM-001",
  ];
  const requestKind = (item, intent = "") =>
    !item
      ? "outro"
      : item.id === "TI-001"
        ? "dúvida"
        : item.id === "TI-003"
          ? "outro"
          : intent === "purchase" || REQUESTS.includes(item.id)
            ? "solicitação"
            : "problema";
  desk.requestPolicy = {
    selfHelpEligible,
    requestKind,
    dateValue,
    timeValue,
    localDay,
    usefulDescription,
    fullName,
    needsAuthorization,
    asksEquipmentIntent,
    isRoutineMaintenance,
  };
})((window.SmartDesk = window.SmartDesk || {}));
