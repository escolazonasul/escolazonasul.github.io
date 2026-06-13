(function () {
  const app = window.EscolaZonaSul = window.EscolaZonaSul || {};
  const { config, dom, state } = app;
  const storageKeys = config.storageKeys;

  function getStorageItem(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function setStorageItem(key, value) {
    localStorage.setItem(key, value);
  }

  function removeStorageItem(key) {
    localStorage.removeItem(key);
  }

  function getAuthToken() {
    return getStorageItem(storageKeys.authToken) || "";
  }

  function getCurrentUser() {
    const storedUser = getStorageItem(storageKeys.currentUser);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      removeStorageItem(storageKeys.currentUser);
      return null;
    }
  }

  function isAuthenticated() {
    return Boolean(getAuthToken());
  }

  function isCurrentUserAdmin() {
    const user = state.currentUser || getCurrentUser();

    return user?.perfil === "Administrador";
  }

  function updateAuthUi() {
    const user = state.currentUser || getCurrentUser();
    const hasToken = isAuthenticated();
    const isAdmin = hasToken && user?.perfil === "Administrador";

    dom.adminOnlyElements.forEach((element) => {
      element.hidden = !isAdmin;
    });

    if (!isAdmin) {
      app.ui?.hideRegisterSection?.();
    }

    if (hasToken && user) {
      const label = user.nome || user.email || "usuário";
      dom.authStatus.hidden = false;
      dom.authStatus.textContent = `Login com sucesso: ${label}`;
      dom.authStatus.title = user.email || "";
      dom.openAuthModalButton.hidden = true;
      dom.logoutButton.hidden = false;
      return;
    }

    dom.authStatus.hidden = true;
    dom.authStatus.textContent = "";
    dom.authStatus.title = "";
    dom.openAuthModalButton.hidden = false;
    dom.logoutButton.hidden = true;
  }

  function saveAuthSession(payload) {
    const token = payload?.access_token;
    const user = payload?.usuario;

    if (!token || !user) {
      throw new Error("Resposta de login incompleta.");
    }

    setStorageItem(storageKeys.authToken, token);
    setStorageItem(storageKeys.currentUser, JSON.stringify(user));
    removeStorageItem(storageKeys.legacyActiveUserEmail);
    state.currentUser = user;
    updateAuthUi();
  }

  function clearAuthSession() {
    removeStorageItem(storageKeys.authToken);
    removeStorageItem(storageKeys.currentUser);
    removeStorageItem(storageKeys.legacyActiveUserEmail);
    state.currentUser = null;
    updateAuthUi();
  }

  function setLoginEmail(email) {
    dom.loginForm.elements.email.value = email || "";
  }

  function setValidationEmail(email) {
    dom.validationForm.elements.email.value = email || "";
    dom.validationForm.elements.codigo.value = "";
  }

  function switchAuthTab(tabName) {
    const modalCopy = {
      login: {
        eyebrow: "Login",
        title: "Acesse sua conta"
      },
      register: {
        eyebrow: "Novo cadastro",
        title: "Adicionar novo contato"
      },
      validation: {
        eyebrow: "Validação",
        title: "Validar cadastro"
      }
    };

    dom.authPanels.forEach((panel) => {
      panel.hidden = panel.dataset.authPanel !== tabName;
    });

    dom.authTabs.forEach((tab) => {
      const isActive = tab.dataset.authTab === tabName || (tabName === "validation" && tab.dataset.authTab === "register");
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    dom.authModalEyebrow.textContent = modalCopy[tabName].eyebrow;
    dom.authModalTitle.textContent = modalCopy[tabName].title;

    window.requestAnimationFrame(() => {
      const panel = document.querySelector(`[data-auth-panel="${tabName}"]`);
      const firstField = panel?.querySelector("input:not([readonly]), select, button");
      firstField?.focus();
    });
  }

  function openAuthModal(tabName = "login") {
    switchAuthTab(tabName);
    dom.authModal.classList.add("is-open");
    dom.authModal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    dom.authModal.classList.remove("is-open");
    dom.authModal.setAttribute("aria-hidden", "true");
  }

  function showValidationStep(email) {
    setValidationEmail(email);
    openAuthModal("validation");
  }

  function handleUnauthorizedSession() {
    clearAuthSession();
    app.render.renderProtectedUnavailable("Sua sessão expirou. Faça login novamente.");
    openAuthModal("login");
  }

  state.currentUser = getCurrentUser();

  app.auth = {
    clearAuthSession,
    closeModal,
    getAuthToken,
    getCurrentUser,
    handleUnauthorizedSession,
    isAuthenticated,
    isCurrentUserAdmin,
    openAuthModal,
    saveAuthSession,
    setLoginEmail,
    showValidationStep,
    switchAuthTab,
    updateAuthUi
  };
}());
