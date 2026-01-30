// Responsável por A autenticação de usuários: cadastro, login, logout, recuperação de se

const authService = require("../services/authService");

async function handleRecuperarSenha(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ erro: "O email é obrigatório." });
  }
  try {
    const token = await authService.gerarTokenRecuperacao(email);
    if (!token) {
      return res.status(404).json({ erro: "Email não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao gerar token de recuperação:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno ao processar a solicitação." });
  }
  return res.redirect("/recuperar-senha-troca");
}

async function handleAlterarSenha(req, res) {
  const { token, senha } = req.body;
  if (!token || !senha) {
    return res
      .status(400)
      .json({ erro: "Token e nova senha são obrigatórios." });
  }
  try {
    const sucesso = await authService.alterarSenhaComToken(token, senha);
    if (!sucesso) {
      return res.status(400).json({ erro: "Token inválido ou expirado." });
    }
  } catch (error) {
    console.error("Erro ao alterar a senha:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno ao processar a solicitação." });
  }
  return res.status(200).json({ message: "Senha alterada com sucesso." });
}

/**
 * Controller para cadastro de usuários.
 * Campos aceitos: nome_completo, email, senha, tipo ('admin' | 'vendedor'), telefone
 */
async function handleCadastro(req, res) {
  const { nome_completo, email, senha, tipo, telefone } = req.body;

  // Validação
  if (!nome_completo || !email || !senha || !tipo) {
    return res.status(400).json({
      erro: "Campos obrigatórios (nome_completo, email, senha, tipo) faltando.",
    });
  }

  try {
    const novoUsuario = await authService.cadastrar({
      nome_completo,
      email,
      senha,
      tipo,
      telefone,
    });

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      id: novoUsuario.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Este email já está cadastrado." });
    }
    console.error("Erro no controller de cadastro:", error);
    return res.status(500).json({ erro: "Erro interno ao cadastrar usuário." });
  }
}

/**
 * Controller de login
 */
async function handleLogin(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." });
  }

  try {
    const usuario = await authService.login(email, senha);

    if (!usuario) {
      return res.status(401).json({ erro: "Email ou senha inválidos." });
    }

    // Salva na sessão (IMPORTANTE: manter nomes consistentes com o DB)
    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome, // no DB é 'nome' ou 'nome_completo'
      email: usuario.email,
      tipo: usuario.tipo, // 'admin' ou 'vendedor'
    };

    return res.status(200).json({
      message: "Login bem-sucedido",
      usuario: req.session.usuario,
    });
  } catch (error) {
    console.error("Erro no controller de login:", error);
    return res.status(500).json({ erro: "Erro interno ao fazer login." });
  }
}

/**
 * Logout: destrói a sessão
 */
async function handleLogout(req, res) {
  if (!req.session || !req.session.usuario) {
    return res.redirect("/");
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Erro ao encerrar sessão:", err);
      return res.status(500).json({ erro: "Erro ao fazer logout." });
    }

    res.clearCookie("connect.sid");
    return res.redirect("/");
  });
}

/**
 * Retorna usuário logado
 */
async function handleVerSessao(req, res) {
  res.status(200).json(req.session.usuario);
}

module.exports = {
  handleCadastro,
  handleLogin,
  handleLogout,
  handleVerSessao,
  handleRecuperarSenha,
  handleAlterarSenha,
};
