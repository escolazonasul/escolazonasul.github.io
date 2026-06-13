(function () {
  const app = window.EscolaZonaSul = window.EscolaZonaSul || {};
  const { api, auth, dom, render, services, ui, utils } = app;

  function buildUserPayload(form) {
    const formData = new FormData(form);
    const password = utils.getFormValue(formData, "senha");
    const passwordConfirmation = utils.getFormValue(formData, "confirmSenha");
    const profile = form === dom.modalRegisterForm ? "Usuário" : utils.getFormValue(formData, "profileType");

    if (password.length < 6) {
      throw new Error("A senha precisa ter pelo menos 6 caracteres.");
    }

    if (formData.has("confirmSenha") && password !== passwordConfirmation) {
      throw new Error("A confirmação de senha precisa ser igual à senha.");
    }

    return {
      nome: utils.getFormValue(formData, "name"),
      email: utils.getFormValue(formData, "email"),
      telefone: utils.getFormValue(formData, "phone"),
      perfil: profile,
      senha: password
    };
  }

  function buildLoginPayload(form) {
    const formData = new FormData(form);
    const password = utils.getFormValue(formData, "senha");

    if (password.length < 6) {
      throw new Error("A senha precisa ter pelo menos 6 caracteres.");
    }

    return {
      email: utils.getFormValue(formData, "email"),
      senha: password
    };
  }

  function getUserCreationRequest(form) {
    if (form === dom.modalRegisterForm) {
      return {
        path: "/usuarios/cadastro",
        protectedRoute: false,
        successMessage: "Cadastro criado. Valide o código enviado por e-mail."
      };
    }

    if (!auth.isAuthenticated() || !auth.isCurrentUserAdmin()) {
      throw new Error("Faça login como Administrador para cadastrar este perfil.");
    }

    return {
      path: "/usuarios",
      protectedRoute: true,
      successMessage: "Cadastro criado. Valide o código enviado por e-mail."
    };
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    let payload;

    try {
      payload = buildLoginPayload(form);
    } catch (error) {
      ui.showToast(error.message);
      return;
    }

    try {
      const loginPayload = await api.requestApi("/usuarios/login", {
        method: "POST",
        body: JSON.stringify(payload)
      }, { protectedRoute: false });

      auth.saveAuthSession(loginPayload);
      form.reset();
      auth.closeModal();
      await services.loadProtectedData();
      ui.showToast("Login realizado com sucesso.");
    } catch (error) {
      const shouldValidateEmail = error.status === 403 && /valid/i.test(error.message);

      if (shouldValidateEmail) {
        auth.showValidationStep(payload.email);
        ui.showToast("Cadastro pendente de validação.");
        return;
      }

      ui.showToast(error.message);
    }
  }

  async function handleRegistrationSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    let payload;

    try {
      payload = buildUserPayload(form);
    } catch (error) {
      ui.showToast(error.message);
      return;
    }

    try {
      const userCreationRequest = getUserCreationRequest(form);

      await api.requestApi(userCreationRequest.path, {
        method: "POST",
        body: JSON.stringify(payload)
      }, { protectedRoute: userCreationRequest.protectedRoute });

      form.reset();

      if (auth.isAuthenticated()) {
        await services.loadUsers().catch(() => null);
      }

      ui.showToast(userCreationRequest.successMessage);
      auth.showValidationStep(payload.email);
    } catch (error) {
      ui.showToast(error.message);
    }
  }

  async function handleValidationSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = utils.getFormValue(formData, "email");
    const code = utils.getFormValue(formData, "codigo");

    if (!/^\d{6}$/.test(code)) {
      ui.showToast("Informe o código de 6 dígitos.");
      return;
    }

    try {
      await api.requestApi("/usuarios/validar-cadastro", {
        method: "POST",
        body: JSON.stringify({
          email,
          codigo: code
        })
      }, { protectedRoute: false });

      dom.validationForm.reset();
      auth.setLoginEmail(email);
      auth.switchAuthTab("login");
      ui.showToast("Cadastro validado. Faça login para continuar.");
    } catch (error) {
      ui.showToast(error.message);
    }
  }

  async function handleResendValidationCode() {
    const email = dom.validationForm.elements.email.value.trim();

    if (!email) {
      ui.showToast("Informe o e-mail do cadastro.");
      return;
    }

    try {
      const payload = await api.requestApi("/usuarios/reenviar-codigo-validacao", {
        method: "POST",
        body: JSON.stringify({ email })
      }, { protectedRoute: false });

      ui.showToast(payload?.message || "Novo código solicitado.");
    } catch (error) {
      ui.showToast(error.message);
    }
  }

  async function handleNoticeSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      titulo: utils.getFormValue(formData, "titulo"),
      mensagem: utils.getFormValue(formData, "mensagem"),
      prioridade: utils.getFormValue(formData, "prioridade"),
      escola: utils.getFormValue(formData, "escola"),
      ativo: formData.has("ativo")
    };

    try {
      await api.requestApi("/avisos", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      form.reset();
      form.elements.ativo.checked = true;
      await services.loadNotices();
      render.updateCounters();
      ui.showToast("Aviso cadastrado na API.");
    } catch (error) {
      ui.showToast(error.message);
    }
  }

  async function handleEventSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      titulo: utils.getFormValue(formData, "titulo"),
      descricao: utils.getFormValue(formData, "descricao"),
      data_evento: utils.getFormValue(formData, "data_evento"),
      local: utils.getFormValue(formData, "local"),
      escola: utils.getFormValue(formData, "escola")
    };

    try {
      await api.requestApi("/eventos", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      form.reset();
      await services.loadEvents();
      render.updateCounters();
      ui.showToast("Evento cadastrado na API.");
    } catch (error) {
      ui.showToast(error.message);
    }
  }

  async function handleGallerySubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      titulo: utils.getFormValue(formData, "titulo"),
      descricao: utils.getFormValue(formData, "descricao"),
      imagem_url: utils.getFormValue(formData, "imagem_url"),
      escola: utils.getFormValue(formData, "escola")
    };

    try {
      await api.requestApi("/galeria", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      form.reset();
      await services.loadGallery();
      ui.showToast("Item de galeria cadastrado na API.");
    } catch (error) {
      ui.showToast(error.message);
    }
  }

  function handleLogout() {
    auth.clearAuthSession();
    ui.hideRegisterSection();
    render.renderProtectedUnavailable("Faça login para carregar avisos, eventos, galeria e cadastros.");
    auth.openAuthModal("login");
    ui.showToast("Sessão encerrada.");
  }

  app.forms = {
    handleEventSubmit,
    handleGallerySubmit,
    handleLoginSubmit,
    handleLogout,
    handleNoticeSubmit,
    handleRegistrationSubmit,
    handleResendValidationCode,
    handleValidationSubmit
  };
}());
