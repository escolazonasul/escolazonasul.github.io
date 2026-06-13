# 🏫 Sistema de Gestão para Creches Comunitárias e Escolas na Zona Sul de SP 

## 📋 Descrição do Projeto
Este projeto é um **Sistema de Gestão Escolar e Comunicação** desenvolvido como parte do **Projeto de Extensão I** do curso de **Bacharelado em Engenharia de Software**. O objetivo principal é solucionar um problema real da comunidade local, automatizando a comunicação entre a gestão pedagógica de uma creche e os pais/responsáveis dos alunos.

A aplicação permite a centralização de avisos urgentes (como suspensão de aulas decorrente de fatores climáticos ou quedas de energia), a visualização de uma agenda de eventos institucionais e o compartilhamento de registros por meio de uma galeria digital de atividades.

---

## 🎯 Impacto Comunitário e Objetivos de Desenvolvimento Sustentável (ODS)
O projeto está diretamente alinhado com as seguintes diretrizes:
* **ODS 4 da ONU (Educação de Qualidade):** Garantir a inclusão e a equidade no acesso às informações e rotinas escolares.
* **Ação Extencionista Local:** Implementado na creche comunitária da Zona Sul, fornecendo uma infraestrutura digital onde antes os processos e comunicações eram manuais ou descentralizados.

---

## 🛠️ Arquitetura do Sistema e Tecnologias

O ecossistema do software foi estruturado seguindo o modelo de arquitetura distribuída:

* **Front-end:** HTML5, CSS3 e TypeScript (TS) — Hospedado de forma estática e pública através do **GitHub Pages** para garantir transparência e fácil acesso comunitário.
* **Back-end (API):** Python (Flask / FastAPI) — Responsável pelas regras de negócio, rotas de controle e autenticação de usuários.
* **Banco de Dados:** MongoDB Atlas ou Supabase — Armazenamento na nuvem para persistência de dados cadastrais simplificados.

---

## 👥 Modelagem de Usuários e Permissões

O banco de dados gerencia três perfis de acesso com níveis de permissões específicos:

1.  **Administrador (Direção da Creche)**
    * *Dados:* Nome, E-mail, Celular.
    * *Permissões:* Criar, editar e remover avisos, eventos na agenda escolar e realizar o upload de mídias na galeria de atividades.
2.  **Professor**
    * *Dados:* Nome, E-mail.
    * *Permissões:* Consultar o mural de avisos, acompanhar o cronograma pedagógico e verificar eventos futuros.
3.  **Usuários Comuns (Pais e Responsáveis)**
    * *Dados:* Nome, E-mail.
    * *Permissões:* Acesso à interface de leitura do mural de avisos importantes, cronograma de eventos e visualização das fotos na galeria.

---

## 🗺️ Funcionalidades Mapeadas

* [x] **Hospedagem Pública:** Estrutura base publicada e operacional via GitHub Pages.
* [x] **Mural de Avisos Dinâmico:** Notificações em tempo real sobre imprevistos (ex: falta de energia, chuvas intensas ou paralisações).
* [x] **Agenda de Eventos:** Cronograma interativo para festividades e reuniões de pais (ex: Festa Junina, encerramento do ano letivo).
* [x] **Galeria Digital:** Espaço visual gerenciado pela administração para exibição das atividades pedagógicas das crianças.
* [x] **Sistema de Autenticação:** Login seguro diferenciando os perfis de usuários.
* [ ] **Sistema de Recebimento:** Usuário (Pais/Responsaveis) cadastrados receberiam e-mail com a atualização das escolas ou da escola que queira receber as informações.

---

## 🚀 Como Executar o Front-end Localmente

1. Clone o repositório em sua máquina:
   ```bash
   git clone [https://github.com/escolazonasul/escolazonasul.github.io.git](https://github.com/escolazonasul/escolazonasul.github.io.git)
