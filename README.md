# ⚡ EnergyFit — Plataforma de E-commerce Fitness

O **EnergyFit** é uma plataforma de e-commerce desenvolvida com **Node.js**, **Express**, **EJS** e **MariaDB/SQLite**, criada para oferecer uma experiência simples, rápida e eficiente para compra de produtos fitness.  
O projeto inclui autenticação, carrinho de compras, painel do vendedor, envio de e-mails, upload de imagens e muito mais.

---

## 🚀 Funcionalidades Principais

### 👤 **Autenticação de Usuários**

- Login (e-mail + senha)
- Cadastro de novos usuários
- Recuperação de senha via e-mail
- Sessões protegidas com middleware

### 🛒 **Carrinho de Compras**

- Adicionar produtos ao carrinho
- Remover itens
- Finalizar compras
- Salvar itens localmente com `localStorage`

### 🛍️ **Produtos**

- Vendedores podem cadastrar novos produtos
- Upload de imagens utilizando Multer
- Visualização de todos os produtos
- Filtro por categorias

### 📊 **Painel Administrativo**

- Vendedores e administradores possuem telas próprias
- Relatório de faturamento
- Visualização de vendas
- Edição/remoção de produtos

### ✉️ **Sistema de E-mail**

- Envio de e-mails automáticos para:
  - Recuperação de senha
  - Suporte
  - Confirmação de ações

---

## 🧱 **Tecnologias Utilizadas**

- **Node.js**
- **Express**
- **EJS**
- **SQLite / MariaDB**
- **Multer** (upload)
- **Bcrypt** (hash de senha)
- **Express-Session**
- **Nodemailer**
- **CSS3 + HTML5**
- **JavaScript (Frontend e Backend)**

---

## 📂 **Estrutura do Projeto**

energy/
│
├── config/
├── controllers/
├── middleware/
├── public/
├── routes/
├── services/
├── views/
├── database.sqlite
├── index.js
└── package.json

---

## 🖥️ **Como Rodar o Projeto**

### 1️⃣ Instale as dependências

```bash
npm install

2️⃣ Configure o banco de dados (SQLite)

O arquivo database.sqlite já acompanha o projeto.

As configurações ficam em config/db.js.

3️⃣ Inicie o servidor
npm start


Acesse no navegador:

http://localhost:3000

🔐 Variáveis de Ambiente (.env)

Crie um arquivo .env na raiz do projeto com:

SESSION_SECRET=sua_chave
EMAIL_USER=seu_email
EMAIL_PASS=sua_senha
SALT_ROUNDS=10

👩‍💻 Autora

Ana Clara Caetano de Paiva
Desenvolvedora e criadora do projeto EnergyFit 🚀
Apaixonada por tecnologia, backend e desenvolvimento web.

📜 Licença

Este projeto é de uso educacional e pode ser utilizado para estudos.


---

```
