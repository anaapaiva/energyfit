require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

// Rotas
const apiRoutes = require("./routes/apiRoutes");
const webRoutes = require("./routes/webRoutes");

// Inicializa banco de dados (OBRIGATÓRIO)
require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos
// /css, /js, /uploads, etc.
app.use(express.static(path.join(__dirname, "public")));

// Sessão
app.use(
  session({
    secret: process.env.SESSION_SECRET || "segredo",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000, // 30 minutos
    },
  }),
);

// Rotas
app.use("/api/v1", apiRoutes);
app.use("/", webRoutes);

// Middleware global de erros
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.warn("Erro de Upload (Multer):", err.message);
    return res.status(400).json({ erro: err.message });
  }

  console.error("❌ Erro não tratado:", err);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

// Start do servidor (compatível com Render)
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
