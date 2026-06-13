(function () {
  const app = window.EscolaZonaSul = window.EscolaZonaSul || {};

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  function getText(value, fallback = "Não informado") {
    const text = String(value ?? "").trim();

    return text || fallback;
  }

  function normalizeImageUrl(value) {
    const fallbackImage = "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80";
    const candidate = String(value || "").trim();

    if (!candidate) {
      return fallbackImage;
    }

    try {
      const url = new URL(candidate, window.location.href);

      if (url.protocol === "http:" || url.protocol === "https:") {
        return url.href;
      }
    } catch {
      return fallbackImage;
    }

    return fallbackImage;
  }

  function getFormValue(formData, fieldName) {
    return String(formData.get(fieldName) || "").trim();
  }

  app.utils = {
    escapeHtml,
    escapeAttribute,
    getText,
    normalizeImageUrl,
    getFormValue
  };
}());
