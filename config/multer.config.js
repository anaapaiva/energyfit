// config/multer.config.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Lê o diretório de uploads do .env, com um padrão
const uploadDir = process.env.UPLOADS_DIR || "public/uploads";

// Garante que o diretório de uploads exista
// (Isso é uma boa prática para evitar erros "ENOENT" na primeira execução)
const fullUploadPath = path.join(__dirname, "..", uploadDir);
if (!fs.existsSync(fullUploadPath)) {
  fs.mkdirSync(fullUploadPath, { recursive: true });
  console.log(`✅ Diretório de uploads criado em: ${fullUploadPath}`);
}

// 1. Configuração de Armazenamento (DiskStorage)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define a pasta de destino
    cb(null, fullUploadPath);
  },
  filename: function (req, file, cb) {
    // Cria um nome de arquivo único para evitar sobrescrever
    // Ex: 1733219482711-meu-produto.png
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e3);
    const extension = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${extension}`;
    cb(null, filename);
  },
});

// 2. Filtro de Arquivos (FileFilter)
const fileFilter = (req, file, cb) => {
  // Aceita apenas os mimetypes de imagem mais comuns
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isMimeValid = allowedTypes.test(file.mimetype);
  const isExtValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (isMimeValid && isExtValid) {
    cb(null, true); // Aceita o arquivo
  } else {
    // Rejeita o arquivo (não salva, mas não gera erro fatal)
    cb(new Error("Erro: Upload de imagem suporta apenas JPEG, PNG ou WEBP."));
  }
};

// 3. Inicializa o Multer com as configurações
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limite de 5MB por imagem
  },
});

module.exports = upload;