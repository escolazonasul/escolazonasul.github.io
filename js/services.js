(function () {
  const app = window.EscolaZonaSul = window.EscolaZonaSul || {};
  const { api, render, state, ui } = app;

  async function loadNotices() {
    const payload = await api.requestApi("/avisos");
    state.notices = api.normalizeListResponse(payload);
    render.renderNotices();
  }

  async function loadEvents() {
    const payload = await api.requestApi("/eventos");
    state.events = api.normalizeListResponse(payload);
    render.renderEvents();
  }

  async function loadGallery() {
    const payload = await api.requestApi("/galeria");
    state.gallery = api.normalizeListResponse(payload);
    render.renderGallery();
  }

  async function loadUsers() {
    const payload = await api.requestApi("/usuarios");
    state.users = api.normalizeListResponse(payload);
    render.renderRegistrations();
  }

  async function loadProtectedData() {
    if (!app.auth.isAuthenticated()) {
      render.renderProtectedUnavailable("Faça login para carregar avisos, eventos, galeria e cadastros.");
      app.auth.openAuthModal("login");
      return;
    }

    render.renderLoadingStates();

    const tasks = [
      {
        name: "avisos",
        run: loadNotices,
        onError: (error) => {
          state.notices = [];
          render.renderListState(app.dom.noticeList, "Não foi possível carregar avisos", error.message);
        }
      },
      {
        name: "eventos",
        run: loadEvents,
        onError: (error) => {
          state.events = [];
          render.renderListState(app.dom.eventList, "Não foi possível carregar eventos", error.message);
        }
      },
      {
        name: "galeria",
        run: loadGallery,
        onError: (error) => {
          state.gallery = [];
          render.renderListState(app.dom.galleryGrid, "Não foi possível carregar a galeria", error.message);
        }
      },
      {
        name: "usuários",
        run: loadUsers,
        onError: (error) => {
          state.users = [];
          render.renderTableState("Não foi possível carregar usuários", error.message);
        }
      }
    ];
    const results = await Promise.allSettled(tasks.map((task) => task.run()));
    const failures = [];

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        tasks[index].onError(result.reason);
        failures.push(tasks[index].name);
      }
    });

    render.updateCounters();

    if (failures.length) {
      ui.showToast("Alguns dados não foram carregados pela API.");
    }
  }

  app.services = {
    loadEvents,
    loadGallery,
    loadNotices,
    loadProtectedData,
    loadUsers
  };
}());
