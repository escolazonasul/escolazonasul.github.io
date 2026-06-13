(function () {
  const app = window.EscolaZonaSul = window.EscolaZonaSul || {};

  function buildApiUrl(path) {
    const baseUrl = app.config.apiBaseUrl.replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${baseUrl}${normalizedPath}`;
  }

  async function parseResponse(response) {
    const text = await response.text();

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  function extractErrorMessage(payload, fallback) {
    if (!payload) {
      return fallback;
    }

    if (typeof payload === "string") {
      return payload;
    }

    if (typeof payload.detail === "string") {
      return payload.detail;
    }

    if (Array.isArray(payload.detail)) {
      return payload.detail.map((item) => item.msg || item.message).filter(Boolean).join("; ") || fallback;
    }

    if (typeof payload.message === "string") {
      return payload.message;
    }

    return fallback;
  }

  function createApiError(response, payload, path) {
    const message = extractErrorMessage(payload, `Erro ${response.status} ao chamar ${path}.`);
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;

    return error;
  }

  function normalizeListResponse(payload) {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (Array.isArray(payload?.items)) {
      return payload.items;
    }

    if (Array.isArray(payload?.data)) {
      return payload.data;
    }

    if (Array.isArray(payload?.results)) {
      return payload.results;
    }

    return [];
  }

  async function requestApi(path, options = {}, settings = {}) {
    const { protectedRoute = true } = settings;
    const headers = new Headers(options.headers || {});

    if (protectedRoute) {
      const token = app.auth.getAuthToken();

      if (!token) {
        app.auth.handleUnauthorizedSession();
        const error = new Error("Faça login para acessar os dados do sistema.");
        error.status = 401;
        throw error;
      }

      headers.set("Authorization", `Bearer ${token}`);
    }

    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(buildApiUrl(path), {
      ...options,
      headers
    });
    const payload = await parseResponse(response);

    if (!response.ok) {
      const error = createApiError(response, payload, path);

      if (response.status === 401 && protectedRoute) {
        app.auth.handleUnauthorizedSession();
      }

      throw error;
    }

    return payload;
  }

  app.api = {
    buildApiUrl,
    normalizeListResponse,
    requestApi
  };
}());
