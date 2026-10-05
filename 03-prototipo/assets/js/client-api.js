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
    if (window.smartdeskRemote && window.smartdeskGetSession) {
      let result;
      try {
        const send = async () =>
          window.smartdeskRemote(
            route,
            {
              session: await window.smartdeskGetSession(),
              payload: body === undefined ? null : body,
            },
            Math.max(timeout, 45000),
          );
        result = await send();
        if (result.status === 401) {
          window.smartdeskPortalExpired();
          result = await send();
        }
      } catch (error) {
        throw new ApiError(error.message);
      }
      if (result.status >= 400)
        throw new ApiError(
          result.body.error || "Não foi possível concluir esta ação.",
          result.status,
        );
      return result.body;
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
