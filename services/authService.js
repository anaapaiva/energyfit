// regras e lógica  do sistema(service)

const db = require("../config/db"); // Puxa o pool de conexão
const bcrypt = require("bcrypt");
const emailService = require("./emailService");
const e = require("express");
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

async function alterarSenhaComToken(token, novaSenha) {
  // 1. Verifica se o token é válido e não expirou
  const [rows] = await db.query(
    "SELECT * FROM tokens_recuperacao as a WHERE token = ? ",
    [token]
  );
  console.log("Dados:", rows[0]);
  if (rows.length === 0) {
    // Token inválido ou expirado
    return false;
  }
  const tokenData = rows[0];

  // 2. Faz o hash da nova senha
  const hash = await bcrypt.hash(novaSenha, SALT_ROUNDS);
  let sql, params;

  // 3. Atualiza a senha na tabela correta
  if (tokenData.tipo_usuario === "admin") {
    sql = "UPDATE administradores SET senha = ? WHERE id = ?";
    params = [hash, tokenData.usuario_id];
  } else if (tokenData.tipo_usuario === "vendedor") {
    sql = "UPDATE vendedores SET senha = ? WHERE id = ?";
    params = [hash, tokenData.usuario_id];
  } else {
    console.log("Tipo de usuário inválido no token:", tokenData.tipo_usuario);
    throw new Error("Tipo de usuário inválido no token.");
  }
  await db.query(sql, params);

  // 4. Invalida o token usado
  await db.query("DELETE FROM tokens_recuperacao WHERE token = ?", [
    tokenData.token,
  ]);
  return true;
}

async function gerarTokenRecuperacao(email) {
  // 1. Verifica se o email existe (em ambas as tabelas)
  let usuarioId = null;
  let nome = null;
  let tipoUsuario = null;
  const [admRows] = await db.query(
    "SELECT id, nome FROM administradores WHERE email = ?",
    [email]
  );

  if (admRows && admRows.length > 0) {
    usuarioId = admRows[0].id;
    nome = admRows[0].nome;
    tipoUsuario = "admin";
  } else {
    const [vendRows] = await db.query(
      "SELECT id, nome FROM vendedores WHERE email = ?",
      [email]
    );

    if (vendRows && vendRows.length > 0) {
      usuarioId = vendRows[0].id;
      nome = vendRows[0].nome;
      tipoUsuario = "vendedor";
    }
  }

  if (!usuarioId) {
    // Email não encontrado
    return null;
  }

  // 2. Gera um token (simples, para exemplo)
  const token = Math.random().toString(36).substr(2); // Token simples
  const expiracao = new Date(Date.now() + 3600000); // 1 hora de validade
  // 3. Salva o token na tabela de tokens
  await db.query(
    "INSERT INTO tokens_recuperacao (usuario_id, tipo_usuario, token, expiracao) VALUES (?, ?, ?, ?)",
    [usuarioId, tipoUsuario, token, expiracao]
  );

  await emailService.enviarInstrucoes(email, nome, token);
  // 4. Retorna o token (na prática, você enviaria por email)
  return token;
}

/**
 * Lógica de negócios para cadastrar um usuário.
 * Faz o hash da senha e insere na tabela correta (admin/vendedor).
 */
async function cadastrar(dados) {
  const { nome_completo, email, senha, tipo, telefone } = dados;

  // Hash da senha
  const hash = await bcrypt.hash(senha, SALT_ROUNDS);

  let sql, params;

  // Lógica do
  if (tipo === "admin") {
    sql = "INSERT INTO administradores (nome, email, senha) VALUES (?, ?, ?)";
    params = [nome_completo, email, hash];
  } else if (tipo === "vendedor") {
    sql =
      "INSERT INTO vendedores (nome, email, senha, telefone) VALUES (?, ?, ?, ?)";
    params = [nome_completo, email, hash, telefone || null];
  } else {
    // Validação de segurança
    throw new Error("Tipo de usuário inválido.");
  }

  // Executa a query
  // O [0] é para pegar o resultado, ignorando os metadados
  const [resultado] = await db.query(sql, params);
  return resultado;
}

/**
 * Lógica de negócios para o login.
 * Busca em ambas as tabelas (admin, vendedor) e compara o hash.
 */
async function login(email, senha) {
  // 1. Tenta buscar em Administradores (lógica de)
  const [admRows] = await db.query(
    "SELECT * FROM administradores WHERE email = ?",
    [email]
  );

  if (admRows && admRows.length > 0) {
    const admin = admRows[0];
    const match = await bcrypt.compare(senha, admin.senha);
    if (match) {
      // Sucesso! Retorna um objeto unificado
      return {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        tipo: "admin", // Tipo fixo
      };
    }
  }

  // 2. Tenta buscar em Vendedores (lógica de)
  const [vendRows] = await db.query(
    "SELECT * FROM vendedores WHERE email = ?",
    [email]
  );

  if (vendRows && vendRows.length > 0) {
    const vendedor = vendRows[0];
    const match = await bcrypt.compare(senha, vendedor.senha);
    if (match) {
      // Sucesso! Retorna um objeto unificado
      return {
        id: vendedor.id,
        nome: vendedor.nome,
        email: vendedor.email,
        tipo: "vendedor", // Tipo fixo
      };
    }
  }

  // 3. Falha em ambos
  return null;
}

module.exports = {
  cadastrar,
  login,
  gerarTokenRecuperacao,
  alterarSenhaComToken,
};
