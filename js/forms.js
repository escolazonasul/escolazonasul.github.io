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

  function buildForgotPasswordPayload(form) {
    const formData = new FormData(form);
    const email = utils.getFormValue(formData, "email");

    if (!email) {
      throw new Error("Informe o e-mail cadastrado.");
    }

    return { email };
  }

  function buildResetPasswordPayload(form) {
    const formData = new FormData(form);
    const email = utils.getFormValue(formData, "email");
    const code = utils.getFormValue(formData, "codigo");
    const newPassword = utils.getFormValue(formData, "nova_senha");

    if (!email) {
      throw new Error("Informe o e-mail cadastrado.");
    }

    if (!/^\d{6}$/.test(code)) {
      throw new Error("Informe o código de 6 dígitos.");
    }

    if (newPassword.length < 6) {
      throw new Error("A nova senha precisa ter pelo menos 6 caracteres.");
    }

    return {
      email,
      codigo: code,
      nova_senha: newPassword
    };
  }

  function getPasswordResetErrorMessage(error) {
    if (error.status === 503) {
      return "Serviço temporariamente indisponível. Tente novamente em instantes.";
    }

    return error.message;
  }

  function setButtonLoading(button, isLoading, loadingText = "Loading") {
    if (!button) {
      return;
    }

    if (isLoading) {
      button.dataset.defaultLabel = button.dataset.defaultLabel || button.textContent.trim();
      button.disabled = true;
      button.classList.add("is-loading");
      button.innerHTML = `<span class="button__spinner" aria-hidden="true"></span><span>${loadingText}</span>`;
      return;
    }

    button.disabled = false;
    button.classList.remove("is-loading");
    button.textContent = button.dataset.defaultLabel || "";
    delete button.dataset.defaultLabel;
  }

  function setSubmitLoading(form, isLoading, loadingText = "Loading") {
    setButtonLoading(form.querySelector('button[type="submit"]'), isLoading, loadingText);
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

    setSubmitLoading(form, true);

    try {
      const loginPayload = await api.requestApi("/usuarios/login", {
        method: "POST",
        body: JSON.stringify(payload)
      }, { protectedRoute: false });

      auth.saveAuthSession(loginPayload);
      form.reset();
      auth.closeModal();

      if (["cadastro", "enventos", "painel"].includes(dom.page)) {
        if (!auth.isCurrentUserAdmin()) {
          render.renderAdminAccessMessage("Acesso restrito", "Apenas administradores podem acessar esta área.");
          render.renderTableState("Acesso restrito", "Apenas administradores podem acessar esta área.");
          ui.showToast("Apenas administradores podem acessar esta área.");
          return;
        }

        render.clearAdminAccessMessage();

        if (dom.page === "painel") {
          render.renderTableState("Carregando usuários", "Buscando dados na API.");
          await services.loadUsers();
        }

        ui.showToast("Login realizado com sucesso.");
        return;
      }

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
    } finally {
      setSubmitLoading(form, false);
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

  async function handleForgotPasswordSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    let payload;

    try {
      payload = buildForgotPasswordPayload(form);
    } catch (error) {
      ui.showToast(error.message);
      return;
    }

    setSubmitLoading(form, true);

    try {
      const responsePayload = await api.requestApi("/usuarios/esqueci-senha", {
        method: "POST",
        body: JSON.stringify(payload)
      }, { protectedRoute: false });

      ui.showToast(responsePayload?.message || "Se o e-mail estiver cadastrado, um código de redefinição foi enviado.");
      auth.showPasswordResetStep(payload.email);
    } catch (error) {
      ui.showToast(getPasswordResetErrorMessage(error));
    } finally {
      setSubmitLoading(form, false);
    }
  }

  async function handleResetPasswordSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    let payload;

    try {
      payload = buildResetPasswordPayload(form);
    } catch (error) {
      ui.showToast(error.message);
      return;
    }

    setSubmitLoading(form, true);

    try {
      await api.requestApi("/usuarios/redefinir-senha", {
        method: "POST",
        body: JSON.stringify(payload)
      }, { protectedRoute: false });

      form.reset();
      auth.setLoginEmail(payload.email);
      auth.switchAuthTab("login");
      ui.showToast("Senha alterada com sucesso");
    } catch (error) {
      ui.showToast(getPasswordResetErrorMessage(error));
    } finally {
      setSubmitLoading(form, false);
    }
  }

  async function handleRequestNewResetCode() {
    const email = dom.resetPasswordForm.elements.email.value.trim();

    if (!email) {
      auth.showForgotPasswordStep();
      ui.showToast("Informe o e-mail cadastrado.");
      return;
    }

    setButtonLoading(dom.requestNewResetCodeButton, true);

    try {
      const payload = await api.requestApi("/usuarios/esqueci-senha", {
        method: "POST",
        body: JSON.stringify({ email })
      }, { protectedRoute: false });

      dom.resetPasswordForm.elements.codigo.value = "";
      ui.showToast(payload?.message || "Novo código solicitado.");
    } catch (error) {
      ui.showToast(getPasswordResetErrorMessage(error));
    } finally {
      setButtonLoading(dom.requestNewResetCodeButton, false);
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
    handleForgotPasswordSubmit,
    handleGallerySubmit,
    handleLoginSubmit,
    handleLogout,
    handleNoticeSubmit,
    handleRegistrationSubmit,
    handleRequestNewResetCode,
    handleResetPasswordSubmit,
    handleResendValidationCode,
    handleValidationSubmit
  };
}());
