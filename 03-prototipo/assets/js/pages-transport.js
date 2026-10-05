"use strict";
(function () {
  if (!window.SMARTDESK_SERVICE_URL) return;
  const endpoint = new URL(window.SMARTDESK_SERVICE_URL);
  if (
    endpoint.origin !== "https://script.google.com" ||
    !/^\/macros\/s\/[\w-]+\/exec$/.test(endpoint.pathname) ||
    endpoint.search ||
    endpoint.hash
  )
    throw Error("Endereço Google inválido.");
  const trustedOrigin = (origin) =>
    /^https:\/\/(?:script|[a-z0-9-]+-script)\.googleusercontent\.com$/i.test(origin);
  window.smartdeskRemote = (route, body, timeout = 45000) =>
    new Promise((resolve, reject) => {
      const id = Array.from(crypto.getRandomValues(new Uint8Array(32)), (n) =>
        n.toString(16).padStart(2, "0"),
      ).join("");
      const frame = document.createElement("iframe"),
        form = document.createElement("form"),
        field = document.createElement("textarea");
      frame.name = "smartdesk-" + id;
      frame.hidden = true;
      frame.setAttribute("aria-hidden", "true");
      frame.setAttribute("referrerpolicy", "no-referrer");
      form.hidden = true;
      form.method = "POST";
      form.action = endpoint.href;
      form.target = frame.name;
      field.name = "smartdesk";
      field.value = JSON.stringify({
        protocol: "smartdesk-pages-v1",
        id,
        origin: location.origin,
        route,
        body,
      });
      form.append(field);
      let done = false;
      const finish = (error, result) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        window.removeEventListener("message", receive);
        form.remove();
        frame.remove();
        if (error) reject(error);
        else resolve(result);
      };
      const receive = (event) => {
        const data = event.data;
        if (
          !trustedOrigin(event.origin) ||
          !data ||
          data.protocol !== "smartdesk-pages-v1" ||
          data.id !== id
        )
          return;
        if (
          !Number.isInteger(data.result?.status) ||
          !data.result?.body ||
          typeof data.result.body !== "object" ||
          Array.isArray(data.result.body)
        )
          return finish(Error("O Google retornou uma resposta inválida."));
        finish(null, data.result);
      };
      const timer = setTimeout(
        () =>
          finish(
            Error("O Google não confirmou a resposta. Seus dados continuam aqui; tente novamente."),
          ),
        timeout,
      );
      window.addEventListener("message", receive);
      document.body.append(frame, form);
      try {
        form.submit();
      } catch {
        finish(Error("Não foi possível conectar ao Google."));
      }
    });
})();
