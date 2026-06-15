(function () {
  const app = window.EscolaZonaSul = window.EscolaZonaSul || {};
  const { data, dom, state, utils } = app;

  function renderListState(container, title, message) {
    if (!container) {
      return;
    }

    container.innerHTML = `
      <div class="empty-state">
        <strong>${utils.escapeHtml(title)}</strong>
        <span>${utils.escapeHtml(message)}</span>
      </div>
    `;
  }

  function renderTableState(title, message) {
    if (!dom.registrationsTable) {
      return;
    }

    dom.registrationsTable.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="empty-state">
            <strong>${utils.escapeHtml(title)}</strong>
            <span>${utils.escapeHtml(message)}</span>
          </div>
        </td>
      </tr>
    `;
  }

  function renderAdminAccessMessage(title, message) {
    if (!dom.adminAccessMessage) {
      return;
    }

    dom.adminAccessMessage.hidden = false;
    dom.adminAccessMessage.innerHTML = `
      <strong>${utils.escapeHtml(title)}</strong>
      <span>${utils.escapeHtml(message)}</span>
    `;
  }

  function clearAdminAccessMessage() {
    if (!dom.adminAccessMessage) {
      return;
    }

    dom.adminAccessMessage.hidden = true;
    dom.adminAccessMessage.innerHTML = "";
  }

  function renderSchools() {
    if (!dom.schoolGrid) {
      return;
    }

    dom.schoolGrid.innerHTML = data.schools.map((school) => `
      <article class="school-card">
        <div class="school-card__image">
          <img src="${utils.escapeAttribute(school.image)}" alt="Imagem ilustrativa da ${utils.escapeAttribute(school.name)}" loading="lazy">
        </div>
        <div class="school-card__body">
          <h3>${utils.escapeHtml(school.name)}</h3>
          <p>${utils.escapeHtml(school.type)}</p>
          <p>${utils.escapeHtml(school.address)} · ${utils.escapeHtml(school.email)}</p>
          <div class="school-card__meta">
            ${school.tags.map((tag) => `<span class="tag">${utils.escapeHtml(tag)}</span>`).join("")}
          </div>
        </div>
      </article>
    `).join("");
  }

  function mapNoticePriority(priority) {
    const normalizedPriority = String(priority || "info").toLowerCase();

    if (normalizedPriority === "urgente" || normalizedPriority === "danger") {
      return "danger";
    }

    if (normalizedPriority === "alerta" || normalizedPriority === "warning") {
      return "warning";
    }

    return "info";
  }

  function renderNotices(items = state.notices) {
    if (!dom.noticeList) {
      return;
    }

    if (!items.length) {
      renderListState(dom.noticeList, "Nenhum aviso encontrado", "A API não retornou avisos para esta sessão.");
      return;
    }

    dom.noticeList.innerHTML = items.map((notice) => {
      const title = utils.getText(notice.titulo || notice.title, "Aviso sem título");
      const message = utils.getText(notice.mensagem || notice.description, "");
      const priority = mapNoticePriority(notice.prioridade || notice.priority);
      const meta = notice.escola || (notice.ativo === false ? "Inativo" : "Ativo");

      return `
        <article class="notice-card notice-card--${priority}">
          <div class="notice-card__body">
            <div class="notice-card__top">
              <h3>${utils.escapeHtml(title)}</h3>
              <time>${utils.escapeHtml(meta)}</time>
            </div>
            <p>${utils.escapeHtml(message)}</p>
          </div>
        </article>
      `;
    }).join("");
  }

  function formatEventDate(dateValue) {
    const rawValue = String(dateValue || "").trim();
    const date = rawValue ? new Date(`${rawValue}T12:00:00`) : null;

    if (!date || Number.isNaN(date.getTime())) {
      return { day: "--", month: "sem data" };
    }

    const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date);
    const month = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date).replace(".", "");

    return { day, month };
  }

  function renderEvents(items = state.events) {
    if (!dom.eventList) {
      return;
    }

    if (!items.length) {
      renderListState(dom.eventList, "Nenhum evento encontrado", "A API não retornou eventos para esta sessão.");
      return;
    }

    dom.eventList.innerHTML = items.map((event) => {
      const date = formatEventDate(event.data_evento || event.date);
      const title = utils.getText(event.titulo || event.title, "Evento sem título");
      const location = utils.getText(event.local || event.location, "Local não informado");
      const description = utils.getText(event.descricao || event.description, "");

      return `
        <article class="event-card">
          <div class="event-date" aria-hidden="true">
            <div>
              <span>${utils.escapeHtml(date.day)}</span>
              <small>${utils.escapeHtml(date.month)}</small>
            </div>
          </div>
          <div>
            <div class="event-card__top">
              <h3>${utils.escapeHtml(title)}</h3>
              <time>${utils.escapeHtml(location)}</time>
            </div>
            <p>${utils.escapeHtml(description)}</p>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderGallery(items = state.gallery) {
    if (!dom.galleryGrid) {
      return;
    }

    if (!items.length) {
      renderListState(dom.galleryGrid, "Nenhum item de galeria encontrado", "A API não retornou imagens para esta sessão.");
      return;
    }

    dom.galleryGrid.innerHTML = items.map((item) => {
      const title = utils.getText(item.titulo || item.title, "Atividade sem título");
      const description = utils.getText(item.descricao || item.description, "");
      const image = utils.normalizeImageUrl(item.imagem_url || item.image);

      return `
        <article class="gallery-card">
          <div class="gallery-card__image">
            <img src="${utils.escapeAttribute(image)}" alt="${utils.escapeAttribute(title)}" loading="lazy">
          </div>
          <div class="gallery-card__body">
            <h3>${utils.escapeHtml(title)}</h3>
            <p>${utils.escapeHtml(description)}</p>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderProfiles() {
    if (!dom.profileList) {
      return;
    }

    dom.profileList.innerHTML = data.profiles.map((profile) => `
      <article class="profile-card">
        <h3>${utils.escapeHtml(profile.title)}</h3>
        <p>${utils.escapeHtml(profile.description)}</p>
      </article>
    `).join("");
  }

  function renderRegistrations(items = state.users) {
    if (!items.length) {
      renderTableState("Nenhum usuário encontrado", "A API não retornou cadastros para esta sessão.");
      return;
    }

    dom.registrationsTable.innerHTML = items.map((registration) => {
      const profile = utils.getText(registration.perfil || registration.profileType, "Usuário");
      const name = utils.getText(registration.nome || registration.name);
      const email = utils.getText(registration.email);
      const phone = utils.getText(registration.telefone || registration.phone);

      return `
        <tr>
          <td><span class="tag">${utils.escapeHtml(profile)}</span></td>
          <td>${utils.escapeHtml(name)}</td>
          <td>${utils.escapeHtml(email)}</td>
          <td>${utils.escapeHtml(phone)}</td>
        </tr>
      `;
    }).join("");
  }

  function updateCounters() {
    const activeNotices = state.notices.filter((notice) => notice.ativo !== false);

    if (dom.schoolCount) {
      dom.schoolCount.textContent = data.schools.length;
    }

    if (dom.noticeCount) {
      dom.noticeCount.textContent = activeNotices.length;
    }

    if (dom.eventCount) {
      dom.eventCount.textContent = state.events.length;
    }
  }

  function renderProtectedUnavailable(message) {
    state.notices = [];
    state.events = [];
    state.gallery = [];
    state.users = [];
    renderListState(dom.noticeList, "Login necessário", message);
    renderListState(dom.eventList, "Login necessário", message);
    renderListState(dom.galleryGrid, "Login necessário", message);
    renderTableState("Login necessário", message);
    updateCounters();
  }

  function renderLoadingStates() {
    renderListState(dom.noticeList, "Carregando avisos", "Buscando dados na API.");
    renderListState(dom.eventList, "Carregando eventos", "Buscando dados na API.");
    renderListState(dom.galleryGrid, "Carregando galeria", "Buscando dados na API.");
    renderTableState("Carregando usuários", "Buscando dados na API.");
  }

  app.render = {
    clearAdminAccessMessage,
    renderAdminAccessMessage,
    renderEvents,
    renderGallery,
    renderListState,
    renderLoadingStates,
    renderNotices,
    renderProfiles,
    renderProtectedUnavailable,
    renderRegistrations,
    renderSchools,
    renderTableState,
    updateCounters
  };
}());
