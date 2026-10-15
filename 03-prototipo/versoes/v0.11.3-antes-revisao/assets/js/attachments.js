"use strict";
(function (desk) {
  const MB = 1024 * 1024;
  // Defaults match the local server; the public bridge may announce stricter limits.
  const limits = { files: 5, fileBytes: 10 * MB, totalBytes: 20 * MB };
  const EXTENSIONS = /\.(png|jpe?g|webp|gif|pdf|txt|docx|xlsx)$/i;
  const mb = (bytes) => Math.round(bytes / MB) + " MB";
  function configure(next) {
    for (const key of Object.keys(limits))
      if (Number.isFinite(next?.[key]) && next[key] > 0 && next[key] <= limits[key])
        limits[key] = next[key];
  }
  function describe() {
    return (
      "Até " +
      limits.files +
      " arquivos · " +
      mb(limits.fileBytes) +
      " por arquivo · " +
      mb(limits.totalBytes) +
      " no total."
    );
  }
  function merge(existing, candidates) {
    const files = [...existing];
    for (const file of candidates) {
      if (!EXTENSIONS.test(file.name) || !file.size || file.size > limits.fileBytes) {
        return {
          error: "Escolha imagens, PDF, TXT, DOCX ou XLSX de até " + mb(limits.fileBytes) + ".",
          files: existing,
        };
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
      files.length > limits.files ||
      files.reduce((sum, file) => sum + file.size, 0) > limits.totalBytes
    ) {
      return {
        error: "Limite: " + limits.files + " anexos e " + mb(limits.totalBytes) + " no total.",
        files: existing,
      };
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
  desk.attachments = { merge, serialize, configure, describe };
})(window.SmartDesk);
