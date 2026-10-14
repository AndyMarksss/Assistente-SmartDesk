"use strict";
(function (desk) {
  const MAX_FILES = 5;
  const MAX_FILE_BYTES = 10 * 1024 * 1024;
  const MAX_TOTAL_BYTES = 20 * 1024 * 1024;
  const EXTENSIONS = /\.(png|jpe?g|webp|gif|pdf|txt|docx|xlsx)$/i;
  function merge(existing, candidates) {
    const files = [...existing];
    for (const file of candidates) {
      if (!EXTENSIONS.test(file.name) || !file.size || file.size > MAX_FILE_BYTES) {
        return { error: "Escolha imagens, PDF, TXT, DOCX ou XLSX de até 10 MB.", files: existing };
      }
      if (
        !files.some(
          (old) =>
            old.name === file.name &&
            old.size === file.size &&
            old.lastModified === file.lastModified,
        )
      )
        files.push(file);
    }
    if (
      files.length > MAX_FILES ||
      files.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_BYTES
    ) {
      return { error: "Limite: cinco anexos e 20 MB no total.", files: existing };
    }
    return { files, error: "" };
  }
  function serialize(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({ name: file.name, base64: String(reader.result).split(",")[1] });
      reader.onerror = () =>
        reject(new Error("Não consegui ler o anexo. Remova esse arquivo e tente novamente."));
      reader.onabort = reader.onerror;
      reader.readAsDataURL(file);
    });
  }
  desk.attachments = { merge, serialize };
})(window.SmartDesk);
