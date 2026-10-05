"use strict";
(function (desk) {
  class ApiError extends Error {
    constructor(message, status = 0) {
      super(message);
      this.name = "ApiError";
      this.status = status;
    }
  }

  async function request(
    route,
    { body, timeout = 15000, fetchImpl = window.fetch.bind(window) } = {},
  ) {
    if (window.smartdeskRemote && window.smartdeskPortalSession) {
      const session = await window.smartdeskPortalSession;
      let result;
      try {
        result = await window.smartdeskRemote(
          route,
          { session, payload: body === undefined ? null : body },
          Math.max(timeout, 45000),
        );
      } catch (error) {
        throw new ApiError(error.message);
      }
      if (result.status >= 400) {
        if (result.status === 401) window.smartdeskPortalExpired?.();
        throw new ApiError(
          result.body.error || "Não foi possível concluir esta ação.",
          result.status,
        );
      }
      return result.body;
    }
    if (window.google?.script?.run && window.smartdeskPortalSession) {
      const session = await window.smartdeskPortalSession;
      return new Promise((resolve, reject) => {
        let settled = false;
        const timer = setTimeout(() => {
          settled = true;
          reject(
            new ApiError("A resposta demorou. Seus dados continuam aqui; tente novamente.", 504),
          );
        }, timeout);
        const finish = (error, result) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (error) reject(error);
          else resolve(result);
        };
        window.google.script.run
          .withSuccessHandler((result) => {
            if (
              !result ||
              typeof result.status !== "number" ||
              !result.body ||
              typeof result.body !== "object" ||
              Array.isArray(result.body)
            )
              return finish(new ApiError("O Google retornou uma resposta inválida."));
            if (result.status >= 400) {
              if (result.status === 401) window.smartdeskPortalExpired?.();
              return finish(
                new ApiError(
                  result.body.error || "Não foi possível concluir esta ação.",
                  result.status,
                ),
              );
            }
            finish(null, result.body);
          })
          .withFailureHandler(() =>
            finish(
              new ApiError(
                "Não consegui ler a resposta do Google. Seus dados continuam aqui; tente novamente.",
              ),
            ),
          )
          .smartdeskCall(session, route, body === undefined ? null : body);
      });
    }
    const options = { signal: AbortSignal.timeout(timeout) };
    if (body !== undefined) {
      Object.assign(options, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    const response = await fetchImpl(route, options);
    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new ApiError(
        "Abra o SmartDesk com o servidor iniciado para usar esta função.",
        response.status,
      );
    }
    let result;
    try {
      result = await response.json();
    } catch {
      throw new ApiError(
        "Não consegui ler a resposta do servidor. Seus dados continuam aqui; tente novamente.",
        response.status,
      );
    }
    if (!response.ok)
      throw new ApiError(result?.error || "Não foi possível concluir esta ação.", response.status);
    if (!result || typeof result !== "object" || Array.isArray(result))
      throw new ApiError("O servidor retornou uma resposta inválida.", response.status);
    return result;
  }
  desk.api = { request, ApiError };
})((window.SmartDesk = window.SmartDesk || {}));
