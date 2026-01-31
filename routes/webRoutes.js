// Este arquivo controla as rotas visualizadas pelo usuário (EJS)

// energy/routes/webRoutes.js
const express = require("express");
const router = express.Router();
const produtoService = require("../services/produtoService");
const { autenticarWeb, checarTipo } = require("../middleware/authMiddleware");

const db = require("../config/db");

/**
 * @route   GET /
 * @desc    Renderiza a página inicial (energy.html)
 * @access  Público
 */
router.get("/", async (req, res) => {
  try {
    // Busca os dados dinâmicos
    const [todosProdutos, carouselProdutos] = await Promise.all([
      produtoService.listarTodos(),
      produtoService.listarAleatorios(4), // Usamos 4 para o carrossel
    ]);

    res.render("index", {
      // Passa os dados para o index.ejs
      todosProdutos: todosProdutos,
      carouselProdutos: carouselProdutos,
      usuario: req.session.usuario || null, // Para saber se está logado
    });
  } catch (error) {
    console.error("Erro ao carregar a página inicial:", error);
    res.status(500).send("Erro ao carregar a loja.");
  }
});

// --- Rotas de Páginas Estáticas (mas com render EJS) ---
// Elas apenas renderizam o EJS, mas poderiam ter dados no futuro.
router.get("/login", (req, res) => res.render("login"));
router.get("/cadastro", (req, res) => res.render("cadastro"));
router.get("/carrinho", (req, res) => res.render("carrinho")); // (html/compras.html)
router.get("/sobre", (req, res) => res.render("sobre"));
router.get("/politica", (req, res) => res.render("politica"));
router.get("/termos", (req, res) => res.render("termos"));
router.get("/suporte", (req, res) => res.render("suporte"));
router.get("/recuperar", (req, res) => res.render("recuperar"));

// Adicione outras páginas (politica, termos, etc.) aqui

// --- Rotas Protegidas ---

/**
 * @route   GET /vendedor
 * @desc    Renderiza o painel do vendedor
 * @access  Privado (Vendedor)
 */
router.get(
  "/vendedor",
  autenticarWeb,
  checarTipo("vendedor"),
  async (req, res) => {
    const [todosProdutos] = await Promise.all([
      produtoService.listarTodosPorVendedor(req.session.usuario.id),
    ]);
    res.render("vendedor", {
      usuario: req.session.usuario,
      todosProdutos: todosProdutos, // Passa os dados do usuário para a view
    });
  }
);

/**
 * @route   GET /adm
 * @desc    Renderiza o painel do admin
 * @access  Privado (Admin)
 */
router.get("/adm", autenticarWeb, checarTipo("admin"), (req, res) => {
  res.render("adm", {
    usuario: req.session.usuario,
  });
});

/**
 * @route   GET /relatorio-faturamento
 * @desc    Renderiza a página de faturamento com dados REAIS do banco.
 * @access  Privado (Vendedor)
 */
router.get(
  "/relatorio-faturamento",
  autenticarWeb,
  checarTipo("vendedor"),
  async (req, res) => {
    try {
      // [MUDANÇA] A lógica de cálculo foi movida para o backend.
      // Idealmente, isso estaria em um 'pedidoService.js'.
      // Estamos buscando o faturamento total de pedidos 'finalizados'.
      const [rows] = await db.query(
        "SELECT SUM(total) as faturamentoTotal FROM pedidos WHERE status = 'finalizado'"
      );

      const total = rows[0].faturamentoTotal || 0;

      // Passamos o total calculado para o EJS
      res.render("relatorio-faturamento", {
        totalFaturado: total,
        usuario: req.session.usuario, // Para o "Voltar" saber para onde ir
      });
    } catch (error) {
      console.error("Erro ao gerar relatório de faturamento:", error);
      res.status(500).send("Erro ao carregar relatório.");
    }
  }
);

/**
 * @route   GET /visualizar-vendas
 * @desc    Mostra as vendas realizadas pelo vendedor logado
 * @access  Privado (Vendedor)
 */
router.get(
  "/visualizar-vendas",
  autenticarWeb, // 1. Garante que está logado
  checarTipo("vendedor"), // 2. Garante que é um vendedor
  async (req, res) => {
    try {
      // 3. Pega o ID do vendedor da sessão
      const vendedorId = req.session.usuario.id;

      // 4. Busca os pedidos REAIS do banco para esse vendedor
      const [pedidos] = await db.query(
        "SELECT * FROM pedidos WHERE vendedor_id = ? ORDER BY criado_em DESC",
        [vendedorId]
      );

      // 5. Renderiza a página EJS, passando os pedidos encontrados
      res.render("visualizar-vendas", {
        pedidos: pedidos,
        usuario: req.session.usuario,
      });
    } catch (error) {
      console.error("Erro ao buscar vendas do vendedor:", error);
      res.status(500).send("Erro ao carregar a lista de vendas.");
    }
  }
);

router.get("/recuperacao", (req, res) => {
  res.render("recuperacao");
});


router.get("/recuperar-senha-troca", (req, res) => {
  res.render("recuperacao-troca");
});

module.exports = router;
