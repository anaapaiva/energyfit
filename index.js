require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const apiRoutes = require("./routes/apiRoutes");
const webRoutes = require("./routes/webRoutes");

// Inicializa banco
require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

/* 🔥 OBRIGATÓRIO NO RENDER */
app.set("trust proxy", 1);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// CORS (login + sessão funcionando)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Sessão (Render + produção)
app.use(
  session({
    name: "energyfit.sid",
    secret: process.env.SESSION_SECRET || "segredo_super_seguro",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
);

// Rotas
app.use("/api/v1", apiRoutes);
app.use("/", webRoutes);

// Erros globais
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.warn("Erro Multer:", err.message);
    return res.status(400).json({ erro: err.message });
  }

  console.error("❌ Erro não tratado:", err);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

// Start
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
