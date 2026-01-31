// MIDDLEWARE (PONTE DE COMUNICAÇÃO  E COMPARTILHAMENTO).
/**
 * Middleware de autenticação para ROTAS WEB (EJS).
 * Redireciona para /login se não estiver autenticado.
 */
function autenticarWeb(req, res, next) {
  if (!req.session || !req.session.usuario) {
    // Salva a URL que o usuário tentou acessar
    // req.session.returnTo = req.originalUrl; (Opcional, para UX)
    return res.redirect("/login");
  }
  next();
}

/**
 * Middleware de autenticação para API (JSON).
 * Retorna 401 se não estiver autenticado.
 */
function autenticar(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res
      .status(401)
      .json({ erro: "Não autorizado. Faça o login para continuar." });
  }
  next();
}

/**
 * Middleware Factory para checar tipo (funciona para ambos).
 */
function checarTipo(tipoRequerido) {
  return (req, res, next) => {
    // Garante que tiposPermitidos seja sempre um array para facilitar a verificação
    const listaPermitida = Array.isArray(tipoRequerido)
      ? tipoRequerido
      : [tipoRequerido];

    // Se o tipo do usuário NÃO estiver na lista, nega o acesso
    if (!listaPermitida.includes(req.session.usuario.tipo)) {
      // [CORREÇÃO CRÍTICA]
      // Verifica se é uma chamada de API olhando a URL completa.
      // Isso evita que o servidor responda texto (HTML) para um fetch que espera JSON.
      if (req.originalUrl && req.originalUrl.startsWith("/api")) {
        return res.status(403).json({ erro: "Acesso negado." });
      }
      // Se for rota Web, retorna texto
      return res.status(403).json({ erro: "Acesso negado." });
    }
    next();
  };
}

function pegarUsuarioLogado() {
  return (req, res, next) => {
    if (req.session && req.session.usuario) {
      return req.session.usuario;
    }
    next();
  };
}

exports.verificarLoginVendedor = (req, res, next) => {
  if (!req.session || !req.session.vendedorId) {
    return res.redirect("/login?v=1");
  }
  next();
};

module.exports = {
  autenticar,
  autenticarWeb,
  checarTipo,
  pegarUsuarioLogado,
};
