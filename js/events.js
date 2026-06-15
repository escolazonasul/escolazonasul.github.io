(function () {
  const app = window.EscolaZonaSul = window.EscolaZonaSul || {};
  const { auth, dom, forms, ui } = app;

  function on(element, eventName, handler) {
    element?.addEventListener(eventName, handler);
  }

  function getPasswordToggleIcon(isVisible) {
    if (isVisible) {
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M2 2l20 20"></path>
          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"></path>
          <path d="M8.5 5.5A9.8 9.8 0 0 1 12 4c5 0 8.5 4.5 9.5 8a12 12 0 0 1-2.1 3.5"></path>
          <path d="M14.1 14.1A3 3 0 0 1 8.9 8.9"></path>
          <path d="M5.7 5.7A12 12 0 0 0 2.5 12c1 3.5 4.5 8 9.5 8a9.9 9.9 0 0 0 5.2-1.6"></path>
        </svg>
      `;
    }

    return `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M2.5 12c1-3.5 4.5-8 9.5-8s8.5 4.5 9.5 8c-1 3.5-4.5 8-9.5 8s-8.5-4.5-9.5-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `;
  }

  function setPasswordFieldVisibility(input, toggleButton, isVisible) {
    input.type = isVisible ? "text" : "password";
    toggleButton.setAttribute("aria-label", isVisible ? "Ocultar senha" : "Mostrar senha");
    toggleButton.setAttribute("aria-pressed", String(isVisible));
    toggleButton.title = isVisible ? "Ocultar senha" : "Mostrar senha";
    toggleButton.classList.toggle("is-active", isVisible);
    toggleButton.innerHTML = getPasswordToggleIcon(isVisible);
  }

  function enhancePasswordFields() {
    document.querySelectorAll('input[type="password"]').forEach((input) => {
      if (input.closest(".password-field")) {
        return;
      }

      const wrapper = document.createElement("span");
      const toggleButton = document.createElement("button");

      wrapper.className = "password-field";
      input.classList.add("password-field__input");
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);

      toggleButton.className = "password-field__toggle";
      toggleButton.type = "button";
      setPasswordFieldVisibility(input, toggleButton, false);

      toggleButton.addEventListener("click", () => {
        setPasswordFieldVisibility(input, toggleButton, input.type !== "text");
        input.focus();
      });

      input.form?.addEventListener("reset", () => {
        window.setTimeout(() => setPasswordFieldVisibility(input, toggleButton, false), 0);
      });

      wrapper.appendChild(toggleButton);
    });
  }

  function bindEvents() {
    enhancePasswordFields();

    on(dom.openAuthModalButton, "click", () => auth.openAuthModal("login"));
    on(dom.logoutButton, "click", forms.handleLogout);
    on(dom.openAuthModalSecondaryButton, "click", () => {
      dom.quickRegisterForm.scrollIntoView({ behavior: "smooth", block: "center" });
      dom.quickRegisterForm.querySelector("input[name='name']")?.focus();
    });
    on(dom.shuffleGalleryButton, "click", ui.shuffleGallery);
    on(dom.menuButton, "click", () => {
      dom.sidebar.classList.toggle("is-open");
    });

    dom.authTabs.forEach((tab) => {
      tab.addEventListener("click", () => auth.switchAuthTab(tab.dataset.authTab));
    });

    on(dom.forgotPasswordLink, "click", () => auth.showForgotPasswordStep());
    on(dom.backToLoginFromForgotButton, "click", () => auth.switchAuthTab("login"));
    on(dom.requestNewResetCodeButton, "click", forms.handleRequestNewResetCode);

    dom.closeModalElements.forEach((element) => {
      element.addEventListener("click", auth.closeModal);
    });

    dom.navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        dom.navLinks.forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
        dom.sidebar.classList.remove("is-open");

        ui.hideRegisterSection();
      });
    });

    on(dom.loginForm, "submit", forms.handleLoginSubmit);
    on(dom.forgotPasswordForm, "submit", forms.handleForgotPasswordSubmit);
    on(dom.resetPasswordForm, "submit", forms.handleResetPasswordSubmit);
    on(dom.validationForm, "submit", forms.handleValidationSubmit);
    on(dom.resendValidationCodeButton, "click", forms.handleResendValidationCode);
    on(dom.quickRegisterForm, "submit", forms.handleRegistrationSubmit);
    on(dom.modalRegisterForm, "submit", forms.handleRegistrationSubmit);
    on(dom.noticeForm, "submit", forms.handleNoticeSubmit);
    on(dom.eventForm, "submit", forms.handleEventSubmit);
    on(dom.galleryForm, "submit", forms.handleGallerySubmit);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        auth.closeModal();
        dom.sidebar.classList.remove("is-open");
      }
    });
  }

  app.events = {
    bindEvents
  };
}());
