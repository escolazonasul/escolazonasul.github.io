const apiBaseUrl = process.env.API_BASE_URL || "http://127.0.0.1:8000";
const activeUserEmail = process.env.ACTIVE_USER_EMAIL || "mateuzao88@gmail.com";

const bootstrapAdmin = {
  nome: "Mateus TI",
  email: activeUserEmail,
  telefone: "(11) 993872244",
  perfil: "Administrador"
};

const noticeItems = [
  {
    titulo: "Queda de energia no período da manhã",
    mensagem: "A equipe administrativa avisará as famílias caso o atendimento precise ser reorganizado.",
    prioridade: "alerta",
    escola: "13/06/2026",
    ativo: true
  },
  {
    titulo: "Reunião de professores",
    mensagem: "Encontro pedagógico às 14h para alinhamento das atividades da próxima semana.",
    prioridade: "info",
    escola: "12/06/2026",
    ativo: true
  },
  {
    titulo: "Hoje não haverá aula devido à forte chuva",
    mensagem: "A unidade informa suspensão das atividades presenciais para segurança das crianças e famílias.",
    prioridade: "urgente",
    escola: "10/06/2026",
    ativo: true
  }
];

const eventItems = [
  {
    titulo: "Festa Junina",
    descricao: "Apresentações das turmas, comidas típicas e participação das famílias.",
    data_evento: "2026-06-28",
    local: "Pátio da escola",
    escola: "CEMEI Morumbi"
  },
  {
    titulo: "Semana da Leitura",
    descricao: "Rodas de história, empréstimo de livros e atividades com professores.",
    data_evento: "2026-08-12",
    local: "Biblioteca",
    escola: "CEMEI Morumbi"
  },
  {
    titulo: "Festa de Final de Ano",
    descricao: "Encerramento do ano letivo com apresentações e confraternização.",
    data_evento: "2026-12-10",
    local: "Quadra da comunidade",
    escola: "CEMEI Morumbi"
  }
];

const galleryItems = [
  {
    titulo: "Projeto alimentação",
    descricao: "Aprendizado sobre alimentos saudáveis.",
    imagem_url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80",
    escola: "CEMEI Morumbi"
  },
  {
    titulo: "Brincadeiras no pátio",
    descricao: "Integração e movimento ao ar livre.",
    imagem_url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80",
    escola: "CEMEI Morumbi"
  },
  {
    titulo: "Hora da leitura",
    descricao: "Momento de histórias em sala.",
    imagem_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    escola: "CEMEI Morumbi"
  },
  {
    titulo: "Pintura coletiva",
    descricao: "Atividade de cores e coordenação motora.",
    imagem_url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
    escola: "CEMEI Morumbi"
  }
];

const cleanupTitles = {
  "/avisos": new Set([
    "Aviso de teste frontend",
    ...noticeItems.map((item) => item.titulo)
  ]),
  "/eventos": new Set([
    "Evento de teste frontend",
    ...eventItems.map((item) => item.titulo)
  ]),
  "/galeria": new Set([
    "Galeria de teste frontend",
    ...galleryItems.map((item) => item.titulo)
  ])
};

function buildUrl(path) {
  return `${apiBaseUrl.replace(/\/$/, "")}${path}`;
}

function getPayloadMessage(payload) {
  if (!payload) {
    return "sem detalhes";
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (typeof payload.detail === "string") {
    return payload.detail;
  }

  if (Array.isArray(payload.detail)) {
    return payload.detail.map((error) => error.msg).join("; ");
  }

  if (typeof payload.message === "string") {
    return payload.message;
  }

  return JSON.stringify(payload);
}

async function requestJson(path, options = {}) {
  const { body, protectedRoute = true, method = "GET" } = options;
  const headers = {};

  if (protectedRoute) {
    headers["X-User-Email"] = activeUserEmail;
  }

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`${method} ${path} retornou ${response.status}: ${getPayloadMessage(payload)}`);
  }

  return payload;
}

async function ensureBootstrapAdmin() {
  try {
    await requestJson("/usuarios/bootstrap-admin", {
      method: "POST",
      body: bootstrapAdmin,
      protectedRoute: false
    });
    console.log("Administrador inicial criado.");
  } catch (error) {
    console.log(`Bootstrap admin ignorado: ${error.message}`);
  }
}

async function replaceCollection(path, items) {
  const currentItems = await requestJson(path);
  const titlesToRemove = cleanupTitles[path];
  const itemsToRemove = currentItems.filter((item) => titlesToRemove.has(item.titulo));

  await Promise.all(
    itemsToRemove.map((item) => requestJson(`${path}/${item.id}`, { method: "DELETE" }))
  );

  for (const item of items) {
    await requestJson(path, { method: "POST", body: item });
  }

  console.log(`${path}: ${itemsToRemove.length} removido(s), ${items.length} inserido(s).`);
}

async function main() {
  if (typeof fetch !== "function") {
    throw new Error("Este seed precisa de Node.js 18 ou superior.");
  }

  await ensureBootstrapAdmin();
  await replaceCollection("/avisos", noticeItems);
  await replaceCollection("/eventos", eventItems);
  await replaceCollection("/galeria", galleryItems);

  const [notices, events, gallery] = await Promise.all([
    requestJson("/avisos"),
    requestJson("/eventos"),
    requestJson("/galeria")
  ]);

  console.log(`Concluído: ${notices.length} aviso(s), ${events.length} evento(s), ${gallery.length} item(ns) de galeria no banco.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
