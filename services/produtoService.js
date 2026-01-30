const db = require("../config/db");

async function listarTodos() {
  const [rows] = await db.query("SELECT * FROM produtos");
  return rows;
}

async function listarTodosPorVendedor(vendedor_id) {
  const [rows] = await db.query(
    "SELECT * FROM produtos WHERE vendedor_id = ?",
    [vendedor_id]
  );
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await db.query("SELECT * FROM produtos WHERE id = ?", [id]);
  return rows[0];
}

async function criar(dados) {
  console.log(dados);
  const { nome, preco, descricao, categoria_id, imagem, vendedor_id } = dados;
  const sql =
    "INSERT INTO produtos (nome, preco, descricao, categoria_id, imagem, vendedor_id) VALUES (?, ?, ?, ?, ?, ?)";
  // O wrapper db.js garantirá que o retorno tenha insertId
  const [resultado] = await db.query(sql, [
    nome,
    preco,
    descricao,
    categoria_id,
    imagem,
    vendedor_id,
  ]);
  return resultado;
}

async function atualizar(id, dados) {
  // Montagem dinâmica da query para atualizar apenas os campos enviados
  const campos = [];
  const valores = [];

  const produtoOriginal = await buscarPorId(id);
  if (!produtoOriginal) {
    throw new Error("Produto não encontrado");
  } else if (produtoOriginal.vendedor_id !== dados.vendedor_id) {
    throw new Error("Acesso negado: você não é o vendedor deste produto.");
  }

  if (dados.nome) {
    campos.push("nome = ?");
    valores.push(dados.nome);
  }
  if (dados.preco) {
    campos.push("preco = ?");
    valores.push(dados.preco);
  }
  if (dados.descricao) {
    campos.push("descricao = ?");
    valores.push(dados.descricao);
  }
  if (dados.categoria_id) {
    campos.push("categoria_id = ?");
    valores.push(dados.categoria_id);
  }
  if (dados.imagem) {
    campos.push("imagem = ?");
    valores.push(dados.imagem);
  }

  // Se não houver nada para atualizar, retorna falso sucesso
  if (campos.length === 0) return { affectedRows: 0 };

  valores.push(id);
  const sql = `UPDATE produtos SET ${campos.join(", ")} WHERE id = ?`;

  const [resultado] = await db.query(sql, valores);
  return resultado;
}

async function deletar(id, vendedor_id) {
  const produtoOriginal = await buscarPorId(id);
  if (!produtoOriginal) {
    throw new Error("Produto não encontrado");
  } else if (produtoOriginal.vendedor_id !== vendedor_id) {
    throw new Error("Acesso negado: você não é o vendedor deste produto.");
  }
  const [resultado] = await db.query("DELETE FROM produtos WHERE id = ?", [id]);
  return resultado;
}

async function listarAleatorios(limite) {
  // [MUDANÇA CRÍTICA] SQLite usa RANDOM() em vez de RAND()
  const [rows] = await db.query(
    "SELECT * FROM produtos ORDER BY RANDOM() LIMIT ?",
    [limite]
  );
  return rows;
}

module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  listarAleatorios,
  listarTodosPorVendedor,
};
