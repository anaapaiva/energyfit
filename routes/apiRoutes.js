// este arquivo cuida do backend puro, Cadastro de produto através da ação do backend

// energy/routes/apiRoutes.js
const express = require("express");
const router = express.Router();

// Controllers
const authController = require("../controllers/authController");
const produtoController = require("../controllers/produtoController");
// Middlewares de API
const {
  autenticar,
  checarTipo,
  pegarUsuarioLogado,
} = require("../middleware/authMiddleware");

// [MUDANÇA] Importamos nossa configuração do Multer
const upload = require("../config/multer.config");

// === Rotas de Autenticação (API) ===
router.post("/auth/cadastro", authController.handleCadastro);
router.post("/auth/login", authController.handleLogin);
router.get("/auth/logout", authController.handleLogout);
router.get("/auth/sessao", autenticar, authController.handleVerSessao);
router.post("/auth/recuperar-senha", authController.handleRecuperarSenha);
router.post("/auth/alterar-senha", authController.handleAlterarSenha);

// === Rotas de Produtos (API - CRUD) ===
const podeGerenciarProdutos = [autenticar, checarTipo(["admin", "vendedor"])];

router.get("/produtos", produtoController.handleListarProdutos);
router.get("/produtos/:id", produtoController.handleBuscarProdutoPorId);

// [MUDANÇA] Adicionamos o middleware do Multer.
// upload.single('imagem') diz: "Espere um único arquivo no campo 'imagem'"
// Isso deve vir ANTES do controller.
router.post(
  "/produtos",
  podeGerenciarProdutos,
  upload.single("imagem"), // <- NOSSO MIDDLEWARE
  produtoController.handleCriarProduto
);

router.put(
  "/produtos/:id",
  podeGerenciarProdutos,
  upload.single("imagem"), // Também podemos usar no 'update'
  produtoController.handleAtualizarProduto
);
router.delete(
  "/produtos/:id",
  podeGerenciarProdutos,
  produtoController.handleDeletarProduto
);

module.exports = router;
