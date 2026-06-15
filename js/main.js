(function () {
  const app = window.EscolaZonaSul = window.EscolaZonaSul || {};
  const adminPages = ["cadastro", "enventos", "painel"];

  function redirectLegacyRegistrationsHash() {
    if (window.location.hash !== "#cadastros" || adminPages.includes(app.dom.page)) {
      return false;
    }

    window.location.replace("cadastro.html");
    return true;
  }

  function showAdminAccessState(title, message) {
    app.render.renderAdminAccessMessage(title, message);
    app.render.renderTableState(title, message);
  }

  async function initAdminPage() {
    if (!app.auth.isAuthenticated()) {
      showAdminAccessState("Login necessário", "Faça login como Administrador para acessar esta área.");
      app.auth.openAuthModal("login");
      return;
    }

    if (!app.auth.isCurrentUserAdmin()) {
      showAdminAccessState("Acesso restrito", "Apenas administradores podem acessar esta área.");
      app.ui.showToast("Apenas administradores podem acessar esta área.");
      return;
    }

    app.render.clearAdminAccessMessage();

    if (app.dom.page !== "painel") {
      return;
    }

    app.render.renderTableState("Carregando usuários", "Buscando dados na API.");

    try {
      await app.services.loadUsers();
    } catch (error) {
      app.render.renderTableState("Não foi possível carregar usuários", error.message);
      app.ui.showToast("Não foi possível carregar usuários.");
    }
  }

  async function init() {
    if (redirectLegacyRegistrationsHash()) {
      return;
    }

    app.render.renderSchools();
    app.render.renderProfiles();
    app.render.updateCounters();
    app.auth.updateAuthUi();
    app.events.bindEvents();

    if (adminPages.includes(app.dom.page)) {
      await initAdminPage();
      return;
    }

    if (app.auth.isAuthenticated()) {
      await app.services.loadProtectedData();
      return;
    }

    app.render.renderProtectedUnavailable("Faça login para carregar avisos, eventos, galeria e cadastros.");
    app.auth.openAuthModal("login");
  }

  app.main = {
    init
  };

  init().catch((error) => {
    console.error(error);
    app.ui.showToast("Não foi possível iniciar o sistema.");
  });
}());
