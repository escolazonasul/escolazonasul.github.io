(function () {
  const app = window.EscolaZonaSul = window.EscolaZonaSul || {};

  app.data = {
    schools: [
      {
        name: "CEMEI Morumbi",
        type: "Creche / Educação Infantil",
        email: "cemeimorumbi@gmail.com",
        phone: "(00) 90000-1001",
        address: "Comunidade Zona Sul",
        image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80",
        tags: ["Educação infantil", "Atividades", "Famílias"]
      },
      {
        name: "EMEF Veremundo Toth, Dom",
        type: "Ensino Fundamental",
        email: "veremundototh@gmail.com",
        phone: "(00) 90000-1002",
        address: "Comunidade Zona Sul",
        image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80",
        tags: ["Escola pública", "Eventos", "Comunidade"]
      }
    ],
    profiles: [
      {
        title: "Administrador",
        description: "Gerencia escolas, avisos, agenda, galeria e cadastros."
      },
      {
        title: "Professor",
        description: "Acompanha turmas, eventos pedagógicos e comunicados."
      },
      {
        title: "Usuário",
        description: "Consulta avisos importantes, agenda e atividades."
      }
    ]
  };
}());
