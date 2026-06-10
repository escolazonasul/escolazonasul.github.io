const schools = [
  {
    name: "CEMEI Morumbi",
    type: "Creche / Educação Infantil",
    email: "cemeimorumbi@escola.local",
    phone: "(00) 90000-1001",
    address: "Comunidade Zona Sul",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80",
    tags: ["Educação infantil", "Atividades", "Famílias"]
  },
  {
    name: "EMEF Veremundo Toth, Dom",
    type: "Ensino Fundamental",
    email: "veremundototh@escola.local",
    phone: "(00) 90000-1002",
    address: "Comunidade Zona Sul",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80",
    tags: ["Escola pública", "Eventos", "Comunidade"]
  }
];

const profiles = [
  {
    title: "Administrador",
    description: "Gerencia escolas, avisos, agenda, galeria e cadastros."
  },
  {
    title: "Professor",
    description: "Acompanha turmas, eventos pedagógicos e comunicados."
  },
  {
    title: "Usuários (Pais)",
    description: "Recebem avisos importantes, acompanham agenda e atividades."
  }
];

const notices = [
  {
    title: "Hoje não haverá aula devido à forte chuva",
    date: "10/06/2026",
    description: "A unidade informa suspensão das atividades presenciais para segurança das crianças e famílias.",
    priority: "danger"
  },
  {
    title: "Reunião de professores",
    date: "12/06/2026",
    description: "Encontro pedagógico às 14h para alinhamento das atividades da próxima semana.",
    priority: "info"
  },
  {
    title: "Queda de energia no período da manhã",
    date: "13/06/2026",
    description: "A equipe administrativa avisará as famílias caso o atendimento precise ser reorganizado.",
    priority: "warning"
  }
];

const events = [
  {
    title: "Festa Junina",
    date: "2026-06-28",
    location: "Pátio da escola",
    description: "Apresentações das turmas, comidas típicas e participação das famílias."
  },
  {
    title: "Semana da Leitura",
    date: "2026-08-12",
    location: "Biblioteca",
    description: "Rodas de história, empréstimo de livros e atividades com professores."
  },
  {
    title: "Festa de Final de Ano",
    date: "2026-12-10",
    location: "Quadra da comunidade",
    description: "Encerramento do ano letivo com apresentações e confraternização."
  }
];

const galleryItems = [
  {
    title: "Pintura coletiva",
    description: "Atividade de cores e coordenação motora.",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Hora da leitura",
    description: "Momento de histórias em sala.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Brincadeiras no pátio",
    description: "Integração e movimento ao ar livre.",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Projeto alimentação",
    description: "Aprendizado sobre alimentos saudáveis.",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80"
  }
];

const initialRegistrations = [
  {
    profileType: "Administrador",
    name: "Coordenação Escola Zona Sul",
    email: "admin@escolazonasul.local",
    phone: "(00) 90000-0000"
  },
  {
    profileType: "Professor",
    name: "Professor(a) Responsável",
    email: "professor@escolazonasul.local",
    phone: ""
  },
  {
    profileType: "Usuário (Pai/Mãe)",
    name: "Família cadastrada",
    email: "familia@exemplo.local",
    phone: "(00) 98888-7777"
  }
];

const storageKey = "crecheComunitariaCadastros";

const schoolGrid = document.querySelector("#schoolGrid");
const noticeList = document.querySelector("#noticeList");
const eventList = document.querySelector("#eventList");
const galleryGrid = document.querySelector("#galleryGrid");
const profileList = document.querySelector("#profileList");
const registrationsTable = document.querySelector("#registrationsTable");
const quickRegisterForm = document.querySelector("#quickRegisterForm");
const modalRegisterForm = document.querySelector("#modalRegisterForm");
const registerModal = document.querySelector("#registerModal");
const toast = document.querySelector("#toast");
const sidebar = document.querySelector("#sidebar");
const registerSection = document.querySelector("#cadastros");

function getStoredRegistrations() {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    localStorage.setItem(storageKey, JSON.stringify(initialRegistrations));
    return initialRegistrations;
  }

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.setItem(storageKey, JSON.stringify(initialRegistrations));
    return initialRegistrations;
  }
}

function saveRegistrations(registrations) {
  localStorage.setItem(storageKey, JSON.stringify(registrations));
}

function renderSchools() {
  schoolGrid.innerHTML = schools.map((school) => `
    <article class="school-card">
      <div class="school-card__image">
        <img src="${school.image}" alt="Imagem ilustrativa da ${school.name}" loading="lazy">
      </div>
      <div class="school-card__body">
        <h3>${school.name}</h3>
        <p>${school.type}</p>
        <p>${school.address} · ${school.email}</p>
        <div class="school-card__meta">
          ${school.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
    </article>
  `).join("");
}

function renderNotices() {
  noticeList.innerHTML = notices.map((notice) => `
    <article class="notice-card notice-card--${notice.priority}">
      <div class="notice-card__body">
        <div class="notice-card__top">
          <h3>${notice.title}</h3>
          <time>${notice.date}</time>
        </div>
        <p>${notice.description}</p>
      </div>
    </article>
  `).join("");
}

function formatEventDate(dateValue) {
  const date = new Date(`${dateValue}T12:00:00`);
  const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date);
  const month = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date).replace(".", "");

  return { day, month };
}

function renderEvents() {
  eventList.innerHTML = events.map((event) => {
    const date = formatEventDate(event.date);

    return `
      <article class="event-card">
        <div class="event-date" aria-hidden="true">
          <div>
            <span>${date.day}</span>
            <small>${date.month}</small>
          </div>
        </div>
        <div>
          <div class="event-card__top">
            <h3>${event.title}</h3>
            <time>${event.location}</time>
          </div>
          <p>${event.description}</p>
        </div>
      </article>
    `;
  }).join("");
}

function renderGallery(items = galleryItems) {
  galleryGrid.innerHTML = items.map((item) => `
    <article class="gallery-card">
      <div class="gallery-card__image">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
      </div>
      <div class="gallery-card__body">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    </article>
  `).join("");
}

function renderProfiles() {
  profileList.innerHTML = profiles.map((profile) => `
    <article class="profile-card">
      <h3>${profile.title}</h3>
      <p>${profile.description}</p>
    </article>
  `).join("");
}

function renderRegistrations() {
  const registrations = getStoredRegistrations();

  registrationsTable.innerHTML = registrations.map((registration) => `
    <tr>
      <td><span class="tag">${registration.profileType}</span></td>
      <td>${registration.name}</td>
      <td>${registration.email}</td>
      <td>${registration.phone || "Não informado"}</td>
    </tr>
  `).join("");
}

function updateCounters() {
  document.querySelector("#schoolCount").textContent = schools.length;
  document.querySelector("#noticeCount").textContent = notices.length;
  document.querySelector("#eventCount").textContent = events.length;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");

  window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2800);
}

function handleRegistrationSubmit(event, shouldCloseModal = false) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);
  const newRegistration = {
    profileType: formData.get("profileType"),
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    phone: formData.get("phone").trim()
  };

  const registrations = getStoredRegistrations();
  registrations.unshift(newRegistration);
  saveRegistrations(registrations);
  renderRegistrations();
  form.reset();
  showToast("Cadastro salvo no navegador para teste da interface.");

  if (shouldCloseModal) {
    closeModal();
  }
}

function openModal() {
  registerModal.classList.add("is-open");
  registerModal.setAttribute("aria-hidden", "false");
  registerModal.querySelector("input[name='name']").focus();
}

function closeModal() {
  registerModal.classList.remove("is-open");
  registerModal.setAttribute("aria-hidden", "true");
}

function showRegisterSection() {
  registerSection.hidden = false;

  window.requestAnimationFrame(() => {
    registerSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function hideRegisterSection() {
  registerSection.hidden = true;
}

function shuffleGallery() {
  const shuffled = [...galleryItems].sort(() => Math.random() - 0.5);
  renderGallery(shuffled);
  showToast("Galeria reorganizada para simular novos destaques.");
}

function bindEvents() {
  document.querySelector("#openRegisterModal").addEventListener("click", openModal);
  document.querySelector("#openRegisterModalSecondary").addEventListener("click", openModal);
  document.querySelector("#shuffleGallery").addEventListener("click", shuffleGallery);
  document.querySelector("#menuButton").addEventListener("click", () => {
    sidebar.classList.toggle("is-open");
  });

  document.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
      sidebar.classList.remove("is-open");

      if (link.getAttribute("href") === "#cadastros") {
        event.preventDefault();
        showRegisterSection();
        history.replaceState(null, "", "#cadastros");
        return;
      }

      hideRegisterSection();
    });
  });

  document.querySelectorAll('a[href="#cadastros"]:not(.nav-link)').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showRegisterSection();
      history.replaceState(null, "", "#cadastros");
    });
  });

  quickRegisterForm.addEventListener("submit", handleRegistrationSubmit);
  modalRegisterForm.addEventListener("submit", (event) => handleRegistrationSubmit(event, true));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      sidebar.classList.remove("is-open");
    }
  });
}

function init() {
  renderSchools();
  renderNotices();
  renderEvents();
  renderGallery();
  renderProfiles();
  renderRegistrations();
  updateCounters();
  bindEvents();

  if (window.location.hash === "#cadastros") {
    showRegisterSection();
  }
}

init();
