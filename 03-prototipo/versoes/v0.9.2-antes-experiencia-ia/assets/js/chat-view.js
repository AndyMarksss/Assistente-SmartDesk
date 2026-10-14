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
    function append(text, role = "assistant") {
      const article = document.createElement("article");
      article.className = "message " + role;
      const avatar = document.createElement("span");
      avatar.className = "message-avatar";
      avatar.innerHTML = '<img src="assets/img/assistente.svg" alt="" width="32" height="32" />';
      avatar.setAttribute("aria-hidden", "true");
      const body = document.createElement("div");
      body.className = "message-body";
      const meta = document.createElement("div");
      meta.className = "message-meta";
      meta.textContent = role === "user" ? "Você" : "SmartDesk";
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
          if (token !== revision) return;
          const typing = document.createElement("div");
          typing.className = "typing";
          typing.setAttribute("aria-label", "SmartDesk está digitando");
          typing.innerHTML = "<span></span><span></span><span></span>";
          container.append(typing);
          scroll();
          if (!reducedMotion()) await wait(440);
          typing.remove();
          if (token !== revision) return;
          container.append(article);
          scroll();
          if (!reducedMotion()) await wait(260);
        });
      }
      return bubble;
    }
    return { append, cancel, whenReady };
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
