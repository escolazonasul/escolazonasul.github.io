(function () {
  const app = window.EscolaZonaSul = window.EscolaZonaSul || {};

  async function init() {
    app.render.renderSchools();
    app.render.renderProfiles();
    app.render.updateCounters();
    app.auth.updateAuthUi();
    app.events.bindEvents();

    if (window.location.hash === "#cadastros" && app.auth.isAuthenticated()) {
      app.ui.showRegisterSection();
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
