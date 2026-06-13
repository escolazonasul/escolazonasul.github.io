(function () {
  const app = window.EscolaZonaSul = window.EscolaZonaSul || {};
  const LOCAL_API_BASE_URL = "http://127.0.0.1:8000";
  const PRODUCTION_API_BASE_URL = "https://api-escolazonasul.onrender.com";
  const isLocalFrontend =
    window.location.protocol === "file:" ||
    ["localhost", "127.0.0.1"].includes(window.location.hostname);

  function getApiBaseUrlOverride() {
    try {
      return localStorage.getItem("apiBaseUrl");
    } catch {
      return "";
    }
  }

  app.config = {
    apiBaseUrl: getApiBaseUrlOverride() || (isLocalFrontend ? LOCAL_API_BASE_URL : PRODUCTION_API_BASE_URL),
    storageKeys: {
      authToken: "authToken",
      currentUser: "currentUser",
      legacyActiveUserEmail: "activeUserEmail"
    }
  };
}());
