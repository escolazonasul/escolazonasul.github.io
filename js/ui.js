(function () {
  const app = window.EscolaZonaSul = window.EscolaZonaSul || {};
  const { dom, state } = app;

  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add("is-visible");

    window.setTimeout(() => {
      dom.toast.classList.remove("is-visible");
    }, 2800);
  }

  function hideRegisterSection() {
    if (!dom.registerSection) {
      return;
    }

    dom.registerSection.hidden = true;
  }

  function openRegistrationsPage() {
    window.location.href = "cadastro.html";
  }

  function showRegisterSection() {
    if (!app.auth.isAuthenticated()) {
      app.auth.openAuthModal("login");
      showToast("Faça login para acessar os cadastros.");
      return;
    }

    if (!app.auth.isCurrentUserAdmin()) {
      hideRegisterSection();
      showToast("Apenas administradores podem acessar os cadastros.");
      return;
    }

    if (!dom.registerSection) {
      openRegistrationsPage();
      return;
    }

    dom.registerSection.hidden = false;

    window.requestAnimationFrame(() => {
      dom.registerSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function shuffleGallery() {
    if (!state.gallery.length) {
      app.render.renderGallery();
      showToast("Nenhum item de galeria retornado pela API.");
      return;
    }

    const shuffled = [...state.gallery].sort(() => Math.random() - 0.5);
    app.render.renderGallery(shuffled);
    showToast("Galeria reorganizada com os dados da API.");
  }

  app.ui = {
    hideRegisterSection,
    openRegistrationsPage,
    showRegisterSection,
    showToast,
    shuffleGallery
  };
}());
