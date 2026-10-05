"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const MAX_TOTAL = 20 * 1024 * 1024;
const EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".pdf",
  ".txt",
  ".docx",
  ".xlsx",
]);
const { InvalidRequest, readJSON } = require("./request-body.cjs");
const {
  policy,
  validateSelection,
  validateDescription,
  safeSubject,
  localSubject,
  validateAnswers,
} = require("./ticket-validation.cjs");
function createTicketService({
  root,
  desk,
  provider,
  json,
  storageRoot = path.join(root, "server/data/rascunhos"),
  googleStorage = require("./google-storage.cjs"),
}) {
  return async function handle(req, res, url) {
    if (!["/api/subject", "/api/next-prompt", "/api/drafts", "/api/tickets"].includes(url.pathname))
      return false;
    if (req.method !== "POST") {
      json(res, 405, { error: "Método não permitido." });
      return true;
    }
    try {
      const body = await readJSON(
        req,
        ["/api/drafts", "/api/tickets"].includes(url.pathname) ? 30 * 1024 * 1024 : 65536,
      );
      const item = validateSelection(body, desk);
      if (url.pathname === "/api/next-prompt") {
        // Only trusted selection labels enter this prompt; no arbitrary chat message is accepted.
        const fallback =
          "Você selecionou " +
          item.need +
          ". Descreva brevemente o que aconteceu ou o que precisa. Esse texto será a descrição do chamado.";
        let reply = fallback,
          source = "local";
        if (provider.ready() && typeof provider.nextPrompt === "function")
          try {
            const result = await provider.nextPrompt({ area: item.area, need: item.need });
            if (
              typeof result.reply === "string" &&
              result.reply.trim().length <= 240 &&
              result.reply.trim() &&
              !/[<>\x00-\x08]/.test(result.reply)
            ) {
              reply = result.reply.trim();
              source = "ai";
            }
          } catch {
            /* A predefined prompt remains available. */
          }
        json(res, 200, { reply, source });
        return true;
      }
      const description = validateDescription(body.description);
      const answers = validateAnswers(body.answers, item);
      if (url.pathname === "/api/subject") {
        let subject = localSubject(item),
          source = "local",
          fallback = false;
        if (provider.ready() && typeof provider.subject === "function")
          try {
            const optionAnswers = Object.fromEntries(
              (item.fields || [])
                .filter((field) => field.type === "choice" && answers[field.id])
                .map((field) => [field.label, answers[field.id]]),
            );
            const result = await provider.subject({
              description,
              sector: body.sector,
              area: item.area,
              need: item.need,
              optionAnswers,
            });
            const candidate = safeSubject(result.subject);
            if (!candidate) throw new Error("Invalid subject");
            subject = candidate;
            source = "ai";
          } catch {
            fallback = true;
          }
        json(res, 200, { subject, source, fallback, selectionId: item.id });
        return true;
      }
      if (typeof body.name !== "string" || !body.name.trim() || body.name.length > 100)
        throw new InvalidRequest("Informe seu nome.");
      if (
        body.email !== undefined &&
        (typeof body.email !== "string" ||
          body.email.length > 160 ||
          (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)))
      )
        throw new InvalidRequest("Confira o e-mail.");
      const subject = safeSubject(body.subject);
      if (!subject) throw new InvalidRequest("Confira o assunto de até 80 caracteres.");
      if (!Array.isArray(body.attachments) || body.attachments.length > 5)
        throw new InvalidRequest("Escolha no máximo cinco anexos.");
      let total = 0;
      const files = body.attachments.map((file, index) => {
        if (
          !file ||
          typeof file.name !== "string" ||
          file.name.length > 200 ||
          typeof file.base64 !== "string" ||
          !file.base64 ||
          file.base64.length > 14 * 1024 * 1024 ||
          file.base64.length % 4 ||
          !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(file.base64)
        )
          throw new InvalidRequest("Anexo inválido.");
        const extension = path.extname(file.name).toLowerCase();
        if (!EXTENSIONS.has(extension)) throw new InvalidRequest("Tipo de anexo não permitido.");
        const data = Buffer.from(file.base64, "base64");
        if (!data.length || data.length > 10 * 1024 * 1024)
          throw new InvalidRequest("Cada anexo pode ter até 10 MB.");
        total += data.length;
        if (total > MAX_TOTAL) throw new InvalidRequest("Os anexos juntos podem ter até 20 MB.");
        return {
          name: path.basename(file.name.replaceAll("\\", "/")),
          stored: String(index + 1).padStart(2, "0") + "_anexo" + extension,
          size: data.length,
          data,
        };
      });
      if (url.pathname === "/api/tickets") {
        if (
          body.equipmentIntent !== undefined &&
          !["", "repair", "purchase"].includes(body.equipmentIntent)
        )
          throw new InvalidRequest("Confira o tipo de solicitação do equipamento.");
        if (
          policy.asksEquipmentIntent(item) &&
          !["repair", "purchase"].includes(body.equipmentIntent)
        )
          throw new InvalidRequest("Informe se o item está com defeito ou se é um pedido novo.");
        if (!policy.fullName(body.name)) throw new InvalidRequest("Informe seu nome e sobrenome.");
        if (
          policy.needsAuthorization(item, description, body.equipmentIntent) &&
          (!body.authorization ||
            !["pending", "reported"].includes(body.authorization.status) ||
            (body.authorization.status === "reported" && !policy.fullName(body.authorization.by)))
        )
          throw new InvalidRequest(
            "Informe a autorização da liderança ou marque que está pendente.",
          );
        if (!body.email || !body.email.trim())
          throw new InvalidRequest("Informe seu e-mail institucional.");
        if (!googleStorage.ready())
          throw new InvalidRequest(
            "O recebimento no Google ainda não foi configurado. Seu atendimento continua aqui.",
            503,
          );
        if (typeof body.requestId !== "string" || !/^[a-f0-9-]{36}$/i.test(body.requestId))
          throw new InvalidRequest("Identificação de envio inválida.");
        const authorization = policy.needsAuthorization(item, description, body.equipmentIntent)
          ? {
              status: body.authorization.status,
              by: body.authorization.status === "reported" ? body.authorization.by.trim() : "",
            }
          : null;
        const ticket = {
          authorization,
          requestId: body.requestId,
          name: body.name.trim(),
          email: body.email || "",
          sector: body.sector,
          selectionId: item.id,
          area: item.area,
          need: item.need,
          answers,
          subject,
          description,
          attachments: files.map((file) => ({
            name: file.name,
            base64: file.data.toString("base64"),
          })),
        };
        try {
          const receipt = await googleStorage.submit(ticket);
          json(res, 201, receipt);
        } catch (error) {
          if (error.requiresUpgrade) {
            json(res, 503, { error: error.message });
            return true;
          }
          json(res, 502, {
            error:
              "Não consegui confirmar o recebimento no Google. Seus dados foram mantidos; tente enviar novamente.",
          });
        }
        return true;
      }
      const id = randomUUID(),
        folder = path.join(storageRoot, id);
      await fs.mkdir(folder, { recursive: true });
      for (const file of files)
        await fs.writeFile(path.join(folder, file.stored), file.data, { flag: "wx" });
      const draft = {
        id,
        createdAt: new Date().toISOString(),
        name: body.name.trim(),
        email: body.email || "",
        sector: body.sector,
        selectionId: item.id,
        area: item.area,
        need: item.need,
        answers,
        subject,
        description,
        attachments: files.map(({ data, ...metadata }) => metadata),
        status: "rascunho-local",
      };
      await fs.writeFile(path.join(folder, "chamado.json"), JSON.stringify(draft, null, 2), {
        flag: "wx",
      });
      json(res, 201, { id, status: "rascunho-local", attachmentCount: files.length });
      return true;
    } catch (error) {
      json(res, error instanceof InvalidRequest ? error.status : 500, {
        error:
          error instanceof InvalidRequest
            ? error.message
            : "Não foi possível salvar o rascunho. Tente novamente.",
      });
      return true;
    }
  };
}
module.exports = { createTicketService, safeSubject, validateDescription };
