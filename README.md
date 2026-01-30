# ⚡ EnergyFit — Plataforma de E-commerce Fitness

O **EnergyFit** é uma plataforma de e-commerce desenvolvida com **Node.js**, **Express**, **EJS** e **SQLite/MariaDB**, criada para oferecer uma experiência simples, rápida e eficiente para compra de produtos fitness.

O projeto inclui autenticação de usuários, carrinho de compras, painel do vendedor, envio de e-mails e upload de imagens.

---

## 🚀 Funcionalidades Principais

### 👤 Autenticação de Usuários
- Login (e-mail e senha)
- Cadastro de novos usuários
- Recuperação de senha via e-mail
- Controle de sessão com Express-Session

### 🛒 Carrinho de Compras
- Adicionar e remover produtos
- Finalizar compras
- Persistência de dados com `localStorage`

### 🛍️ Produtos
- Cadastro de produtos por vendedores
- Upload de imagens com Multer
- Listagem de produtos
- Organização por categorias

### 📊 Área do Vendedor / Administrativa
- Visualização de vendas
- Controle de produtos cadastrados
- Relatório simples de faturamento

### ✉️ Sistema de E-mail
- Recuperação de senha
- Contato com suporte
- Confirmação de ações do usuário

---

## 🧱 Tecnologias Utilizadas
- Node.js
- Express
- EJS
- SQLite / MariaDB
- Multer (upload de imagens)
- Bcrypt (criptografia de senha)
- Express-Session
- Nodemailer
- HTML5, CSS3 e JavaScript

---

## 📂 Estrutura do Projeto


energyfit/
│
├── config/          → configurações de banco e upload
├── controllers/     → regras de negócio
├── public/          → arquivos estáticos (CSS, JS, imagens)
├── views/           → páginas EJS
├── index.js         → arquivo principal do servidor

## 🖥️ Como Rodar o Projeto
1️⃣ Instalar as dependências
npm install

## 2️⃣ Configurar o banco de dados

O projeto pode utilizar SQLite ou MariaDB.
As configurações ficam em:

config/db.js

## 3️⃣ Iniciar o servidor
  node index.js
 
## Acesse no navegador:

  http://localhost:3000

## 🔐 Variáveis de Ambiente (.env)

Crie um arquivo .env na raiz do projeto com:

SESSION_SECRET=sua_chave_secreta
EMAIL_USER=seu_email
EMAIL_PASS=sua_senha
SALT_ROUNDS=10

## 👩‍💻 Autora

Ana Clara Caetano de Paiva
Estudante de Tecnologia da Informação — CEFET-MG
Desenvolvedora Full Stack em formação 🚀



```text


├── package.json
└── README.md
