"use strict";
(function (desk) {
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
      avatar.innerHTML = '<img src="assets/img/assistente.svg" alt="" width="32" height="32" />';
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
