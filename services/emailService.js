const nodemailer = require("nodemailer");

// Variável para armazenar o transportador (singleton)
let transporter = null;

/**
 * Cria ou recupera o transportador de e-mail.
 * Se não houver config no .env, cria uma conta de teste no Ethereal.
 */
async function getTransporter() {
  if (transporter) return transporter;

  // Verifica se temos configuração real no .env
  const temConfiguracaoReal =
    process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS;

  if (temConfiguracaoReal) {
    // === MODO PRODUÇÃO / REAL ===
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("📧 Usando configuração de e-mail REAL (.env)");
  } else {
    // === MODO DESENVOLVIMENTO (Zero Config) ===
    console.log(
      "🚧 Nenhuma configuração de e-mail detectada. Criando conta de teste (Ethereal)..."
    );

    // Cria uma conta fake automaticamente
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log("✅ Conta de teste criada: " + testAccount.user);
  }

  return transporter;
}

/**
 * Envia um e-mail genérico.
 */
async function enviarEmail(para, assunto, texto, html) {
  try {
    const transport = await getTransporter();

    const info = await transport.sendMail({
      from: '"EnergyFit System" <no-reply@energyfit.com>', // Remetente fictício ou real
      to: para,
      subject: assunto,
      text: texto,
      html: html || texto,
    });

    console.log("📨 E-mail enviado ID: %s", info.messageId);

    // [IMPORTANTE] Se for Ethereal, gera o link de visualização
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("==================================================");
      console.log("🌐 VISUALIZE O E-MAIL AQUI: " + previewUrl);
      console.log("==================================================");
    }

    return info;
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
    // Não lança erro fatal para não quebrar o fluxo do usuário, apenas loga
    return null;
  }
}

/**
 * Template específico para enviar instruções.
 */
async function enviarInstrucoes(usuarioEmail, usuarioNome, token) {
  const assunto = "Instruções de recuperação de senha - EnergyFit";

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
      <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
        <h1>EnergyFit</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd;">
        <h2 style="color: #000;">Olá, ${usuarioNome}!</h2>
        <p>Recebemos sua solicitação de recuperação de senha.</p>
        <p>Siga os passos :</p>
        <ol>
            <li>Clique aqui: <a href="http://localhost:3000/recuperar-senha-troca/" target="blank">http://localhost:3000/recuperar-senha-troca/</a></li>
            <li>Informe o token: ${token}</li>
            <li>Informe a nova senha</li>
        </ol>
        <hr>
        <p style="font-size: 12px; color: #777;">Este é um e-mail automático.</p>
      </div>
    </div>
  `;

  return enviarEmail(
    usuarioEmail,
    assunto,
    "Instruções enviadas.",
    htmlContent
  );
}

module.exports = {
  enviarEmail,
  enviarInstrucoes,
};
