// energy/index.js
require("dotenv").config();
const mailer = require("nodemailer");
const express = require("express");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const multer = require("multer"); // Importando Multer para tratamento de uploads
const apiRoutes = require("./routes/apiRoutes");
const webRoutes = require("./routes/webRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(express.json());
// lê dados enviados por formulários HTML
app.use(express.urlencoded({ extended: true }));

// [MUDANÇA CRUCIAL]
// Removemos o prefixo "/public".
// Agora, /public/css/energy.css será acessado como /css/energy.css
// E /public/uploads/imagem.png será acessado como /uploads/imagem.png
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "segredo",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000,
    },
  })
);

// Rotas da API
app.use("/api/v1", apiRoutes);

// Rotas Web
app.use("/", webRoutes);

// Middleware Global de Erros (bom para tratar erros do Multer)
app.use((err, req, res, next) => {
  // Se o erro vier do Multer (ex: tipo de arquivo inválido)
  if (err instanceof multer.MulterError || err.message.includes("Upload")) {
    console.warn("Erro de Upload (Multer):", err.message);
    return res.status(400).json({ erro: err.message });
  }

  console.error("❌ Erro não tratado:", err.stack);
  res.status(500).json({ erro: "Ocorreu um erro interno no servidor." });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
