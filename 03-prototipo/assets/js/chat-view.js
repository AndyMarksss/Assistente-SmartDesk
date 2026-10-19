"use strict";
(function (desk) {
  // Robozinho das mensagens: o mesmo desenho de assistente.svg, inline para o CSS animar olhos,
  // antena e boca. Cada cópia ganha IDs próprios para os gradientes.
  let robots = 0;
  function miniRobot() {
    const id = "mini-robot-" + ++robots;
    return (
      '<svg class="mini-robot" viewBox="0 0 180 180" fill="none" width="32" height="32" focusable="false">' +
      '<defs><linearGradient id="' +
      id +
      '-shell" x1="40" y1="30" x2="135" y2="155" gradientUnits="userSpaceOnUse">' +
      '<stop stop-color="#E5DCFF"/><stop offset="1" stop-color="#A98BEF"/></linearGradient>' +
      '<linearGradient id="' +
      id +
      '-face" x1="52" y1="60" x2="132" y2="113">' +
      '<stop stop-color="#35415B"/><stop offset="1" stop-color="#1A2031"/></linearGradient></defs>' +
      '<path class="mini-sparkle" d="M148 33V23M143 28H153M27 123V115M23 119H31" stroke="#BCA3F7" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M67 144L59 157M113 144L122 156" stroke="#A98BEF" stroke-width="9" stroke-linecap="round"/>' +
      '<g class="mini-core">' +
      '<path d="M89 35V23" stroke="#CBB6FF" stroke-width="6" stroke-linecap="round"/>' +
      '<circle class="mini-light" cx="89" cy="20" r="6" fill="#D7C7FF"/>' +
      '<rect class="mini-ear left" x="22" y="73" width="9" height="28" rx="4.5" fill="#AD8BE8"/>' +
      '<rect class="mini-ear right" x="151" y="73" width="9" height="28" rx="4.5" fill="#AD8BE8"/>' +
      '<rect x="35" y="40" width="112" height="101" rx="30" fill="url(#' +
      id +
      '-shell)"/>' +
      '<path d="M53 47C59 44 65 43 74 43" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>' +
      '<rect x="48" y="57" width="85" height="64" rx="20" fill="url(#' +
      id +
      '-face)"/>' +
      '<g class="mini-gaze">' +
      '<rect class="mini-eye" x="62" y="72" width="11" height="20" rx="5.5" fill="#DFD4FF"/>' +
      '<rect class="mini-eye" x="107" y="72" width="11" height="20" rx="5.5" fill="#DFD4FF"/>' +
      "</g>" +
      '<path class="mini-mouth" d="M78 102C85 109 95 109 102 102" stroke="#C2A5FF" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="90" cy="131" r="3" fill="#654199"/>' +
      "</g></svg>"
    );
  }
  function createMessageStream({
    container,
    scroll,
    reducedMotion,
    wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  }) {
    let revision = 0;
    let queue = Promise.resolve();
    const dismissed = new WeakSet();
    function cancel() {
      revision++;
      queue = Promise.resolve();
      container.querySelectorAll(".typing").forEach((node) => node.remove());
    }
    function whenReady(render) {
      const token = revision;
      return queue.then(() => {
        if (token === revision) render();
      });
    }
    // options.ai marks text written by the model; options.thinking is a temporary status bubble.
    function append(text, role = "assistant", options = {}) {
      const article = document.createElement("article");
      article.className =
        "message " + role + (options.thinking ? " thinking" : "") + (options.ai ? " from-ai" : "");
      const avatar = document.createElement("span");
      avatar.className = "message-avatar";
      // O avatar do usuário fica escondido pelo CSS; só o assistente leva o robô.
      if (role !== "user") avatar.innerHTML = miniRobot();
      avatar.setAttribute("aria-hidden", "true");
      const body = document.createElement("div");
      body.className = "message-body";
      const meta = document.createElement("div");
      meta.className = "message-meta";
      meta.textContent = role === "user" ? "Você" : "SmartDesk";
      if (options.ai) {
        const badge = document.createElement("span");
        badge.className = "ai-badge";
        badge.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> IA';
        badge.setAttribute("title", "Texto sugerido pela IA");
        meta.append(badge);
      }
      const bubble = document.createElement("div");
      bubble.className = "message-bubble";
      bubble.textContent = text;
      body.append(meta, bubble);
      article.append(avatar, body);
      if (role === "user") {
        container.append(article);
        requestAnimationFrame(scroll);
      } else {
        const token = revision;
        queue = queue.then(async () => {
          if (token !== revision || dismissed.has(article)) return;
          if (options.thinking) {
            container.append(article);
            scroll();
            return;
          }
          const typing = document.createElement("div");
          typing.className = "typing";
          typing.setAttribute("aria-label", "SmartDesk está digitando");
          typing.innerHTML = "<span></span><span></span><span></span>";
          container.append(typing);
          scroll();
          if (!reducedMotion()) await wait(440);
          typing.remove();
          if (token !== revision || dismissed.has(article)) return;
          container.append(article);
          scroll();
          if (!reducedMotion()) await wait(260);
        });
      }
      return bubble;
    }
    function dismiss(bubble) {
      // Works before or after the queued message reaches the screen.
      const article = bubble?.parentNode?.parentNode;
      if (!article) return;
      dismissed.add(article);
      article.remove();
    }
    return { append, cancel, whenReady, dismiss };
  }
  function createScrollFollower({
    viewport,
    content,
    dock,
    frame = requestAnimationFrame,
    Observer = window.ResizeObserver,
  }) {
    let following = false,
      scheduled = false;
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      frame(() => {
        scheduled = false;
        viewport.scrollTop = following ? viewport.scrollHeight : 0;
      });
    }
    function follow() {
      following = true;
      schedule();
    }
    function reset() {
      following = false;
      schedule();
    }
    if (Observer) {
      const observer = new Observer(() => {
        if (following) schedule();
      });
      [viewport, content, dock].forEach((element) => observer.observe(element));
    }
    return { schedule, follow, reset };
  }
  desk.chatView = { createMessageStream, createScrollFollower };
})(window.SmartDesk);
