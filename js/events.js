(function () {
  const app = window.EscolaZonaSul = window.EscolaZonaSul || {};
  const { auth, dom, forms, ui } = app;

  function bindEvents() {
    dom.openAuthModalButton.addEventListener("click", () => auth.openAuthModal("login"));
    dom.logoutButton.addEventListener("click", forms.handleLogout);
    dom.openAuthModalSecondaryButton.addEventListener("click", () => {
      dom.quickRegisterForm.scrollIntoView({ behavior: "smooth", block: "center" });
      dom.quickRegisterForm.querySelector("input[name='name']")?.focus();
    });
    dom.shuffleGalleryButton.addEventListener("click", ui.shuffleGallery);
    dom.menuButton.addEventListener("click", () => {
      dom.sidebar.classList.toggle("is-open");
    });

    dom.authTabs.forEach((tab) => {
      tab.addEventListener("click", () => auth.switchAuthTab(tab.dataset.authTab));
    });

    dom.closeModalElements.forEach((element) => {
      element.addEventListener("click", auth.closeModal);
    });

    dom.navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        dom.navLinks.forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
        dom.sidebar.classList.remove("is-open");

        if (link.getAttribute("href") === "#cadastros") {
          event.preventDefault();
          ui.showRegisterSection();
          history.replaceState(null, "", "#cadastros");
          return;
        }

        ui.hideRegisterSection();
      });
    });

    dom.registerLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        if (!auth.isAuthenticated()) {
          auth.openAuthModal("register");
          return;
        }

        ui.showRegisterSection();
        history.replaceState(null, "", "#cadastros");
      });
    });

    dom.loginForm.addEventListener("submit", forms.handleLoginSubmit);
    dom.validationForm.addEventListener("submit", forms.handleValidationSubmit);
    dom.resendValidationCodeButton.addEventListener("click", forms.handleResendValidationCode);
    dom.quickRegisterForm.addEventListener("submit", forms.handleRegistrationSubmit);
    dom.modalRegisterForm.addEventListener("submit", forms.handleRegistrationSubmit);
    dom.noticeForm.addEventListener("submit", forms.handleNoticeSubmit);
    dom.eventForm.addEventListener("submit", forms.handleEventSubmit);
    dom.galleryForm.addEventListener("submit", forms.handleGallerySubmit);

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
