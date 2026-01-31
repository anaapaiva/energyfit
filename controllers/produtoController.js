// Responsável por toda a ação que envolver os produtos: CRUD(Criar, Ler, Atualizar e Excluir); listagem, busca por ID, etc).

const produtoService = require("../services/produtoService");

/**
 * Controller para listar todos os produtos.
 */
async function handleListarProdutos(req, res) {
  try {
    const produtos = await produtoService.listarTodos();
    res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.status(500).json({ erro: "Erro interno ao buscar produtos." });
  }
}

/**
 * Controller para buscar um produto por ID.
 */
async function handleBuscarProdutoPorId(req, res) {
  const { id } = req.params;
  try {
    const produto = await produtoService.buscarPorId(id);
    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado." });
    }
    res.status(200).json(produto);
  } catch (error) {
    console.error(`Erro ao buscar produto ${id}:`, error);
    res.status(500).json({ erro: "Erro interno ao buscar produto." });
  }
}

/**
 * Controller para criar um novo produto.
 */
async function handleCriarProduto(req, res) {
  // Ex: { nome: "Whey", descricao: "...", preco: 150.00, categoria_id: 1, imagem: "url" }
  const dadosProduto = req.body;

  if (req.file != null && req.file.filename != null) {
    dadosProduto.imagem = req.file.filename;
  } else {
    dadosProduto.imagem = "default.webp";
  }

  dadosProduto.vendedor_id = req.session.usuario.id;

  // Validação básica
  if (!dadosProduto.nome || !dadosProduto.preco) {
    return res.status(400).json({ erro: "Nome e Preço são obrigatórios." });
  }

  try {
    const resultado = await produtoService.criar(dadosProduto);
    res.status(201).json({
      message: "Produto criado com sucesso!",
      id: resultado.insertId,
    });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ erro: "Erro interno ao criar produto." });
  }
}

/**
 * Controller para atualizar um produto.
 */
async function handleAtualizarProduto(req, res) {
  const { id } = req.params;
  const dadosProduto = req.body;
  dadosProduto.vendedor_id = req.session.usuario.id;

  try {
    const resultado = await produtoService.atualizar(id, dadosProduto);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Produto não encontrado." });
    }
    res.status(200).json({ message: "Produto atualizado com sucesso!" });
  } catch (error) {
    console.error(`Erro ao atualizar produto ${id}:`, error);
    res.status(500).json({ erro: "Erro interno ao atualizar produto." });
  }
}

/**
 * Controller para deletar um produto.
 */
async function handleDeletarProduto(req, res) {
  const { id } = req.params;

  try {
    // [IMPORTANTE] O DDL usa 'ON DELETE RESTRICT'
    // na tabela 'pedido_itens'.
    // Se este produto estiver em um pedido, o service.deletar()
    // VAI FALHAR (o que é o correto).
    const resultado = await produtoService.deletar(id, req.session.usuario.id);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Produto não encontrado." });
    }
    res.status(200).json({ message: "Produto deletado com sucesso!" });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        erro: "Não é possível deletar este produto pois ele está associado a pedidos existentes.",
      });
    }
    console.error(`Erro ao deletar produto ${id}:`, error);
    res.status(500).json({ erro: "Erro interno ao deletar produto." });
  }
}

module.exports = {
  handleListarProdutos,
  handleBuscarProdutoPorId,
  handleCriarProduto,
  handleAtualizarProduto,
  handleDeletarProduto,
};
