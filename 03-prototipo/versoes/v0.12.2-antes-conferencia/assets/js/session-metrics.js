"use strict";
// Teste com usuários (0.12): métricas anônimas de cada atendimento — etapa alcançada, como a
// pessoa escolheu o caminho, o que fez com a IA, quantas vezes voltou, tempo até enviar e a
// nota de facilidade. Nunca nome, e-mail ou o texto do relato. O link ?p=P01 marca o
// participante; o código vale para a aba inteira (sessionStorage).
(function (desk) {
  const KEY = "smartdesk-participante";
  const normalize = (value) => {
    const match = /^p?\s*0*(\d{1,3})$/i.exec(String(value || "").trim());
    return match ? "P" + match[1].padStart(2, "0") : "";
  };
  function readParticipant() {
    try {
      const fromLink = new URLSearchParams(location.search).get("p");
      if (fromLink !== null) {
        const code = normalize(fromLink);
        if (code) sessionStorage.setItem(KEY, code);
        else sessionStorage.removeItem(KEY);
        return code;
      }
      return normalize(sessionStorage.getItem(KEY));
    } catch {
      return "";
    }
  }
  const participant = readParticipant();
  let current = null,
    timer = 0;

  function send() {
    timer = 0;
    if (!current) return;
    const { startedAt, ...payload } = current;
    desk.api.request("/api/metrics", { body: payload, timeout: 20000 }).catch(() => {});
  }
  // Junta mudanças rápidas (ex.: etapa + caminho) num envio só.
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(send, 500);
  }
  function begin() {
    if (current) return;
    current = {
      sessionId: crypto.randomUUID(),
      participant,
      device: matchMedia("(pointer: coarse)").matches ? "celular" : "computador",
      startedAt: Date.now(),
      stage: "início",
      method: "",
      path: "",
      aiDraft: "",
      coherence: "",
      followUp: "",
      tips: "",
      backs: 0,
      ticket: "",
      secondsToSend: null,
      ease: 0,
      comment: "",
    };
    schedule();
  }
  function update(changes) {
    if (!current) return;
    Object.assign(current, changes);
    schedule();
  }
  desk.sessionMetrics = {
    participant,
    begin,
    update,
    // Novo atendimento: o anterior fica registrado na última etapa que alcançou.
    reset() {
      if (timer) send();
      current = null;
    },
    back() {
      if (current) update({ backs: current.backs + 1 });
    },
    chooseMethod(value) {
      if (!current) return;
      update({
        method:
          value === "botões" && current.method === "descrição" ? "descrição, depois botões" : value,
      });
    },
    sent(number) {
      if (!current) return;
      update({
        stage: "enviado",
        ticket: number,
        secondsToSend: Math.round((Date.now() - current.startedAt) / 1000),
      });
    },
  };
})(window.SmartDesk);
