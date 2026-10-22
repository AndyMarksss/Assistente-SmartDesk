"use strict";
(function () {
  let session = "",
    pending = null;
  try {
    session = sessionStorage.getItem("smartdesk-evaluation-session") || "";
  } catch {}
  window.smartdeskPortalExpired = () => {
    session = "";
    try {
      sessionStorage.removeItem("smartdesk-evaluation-session");
    } catch {}
    pending = null;
  };
  window.smartdeskGetSession = async () => {
    if (session) return session;
    if (!pending)
      pending = window
        .smartdeskRemote("/auth/session", {})
        .then((result) => {
          if (result.status !== 200 || !/^[a-f0-9]{64}$/i.test(result.body?.session || ""))
            throw Error(result.body?.error || "Não consegui conectar ao Google. Tente novamente.");
          session = result.body.session;
          try {
            sessionStorage.setItem("smartdesk-evaluation-session", session);
          } catch {}
          return session;
        })
        .catch((error) => {
          pending = null;
          throw error;
        });
    return pending;
  };
})();
