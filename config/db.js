<<<<<<< HEAD
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcrypt");

// [MUDANÇA] Define o caminho físico do arquivo do banco de dados
//.. voltei na pasta raiz do projeto e criei o arquivo database.sqlite lá
const dbPath = path.resolve(__dirname, "..", "database.sqlite");

// Conecta ao banco em arquivo físico
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao conectar SQLite:", err.message);
  } else {
    console.log(`✅ Conectado ao banco de dados SQLite em: ${dbPath}`);
  }
});

/**
 * Função wrapper para simular a interface de Promises do mysql2.
 * Mantém compatibilidade com seus services/controllers existentes.
 */
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    // Verifica se é um SELECT para usar o método correto do SQLite
    const isSelect = /^\s*SELECT/i.test(sql);

    if (isSelect) {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve([rows, []]); // Retorna rows e campos vazios (simulando mysql2)
      });
    } else {
      // INSERT, UPDATE, DELETE
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        // Simula o objeto de resultado do MySQL
        const result = {
          insertId: this.lastID,
          affectedRows: this.changes,
        };
        resolve([result, []]);
      });
    }
  });
};

/**
 * Inicializa as tabelas do sistema e criará um Admin padrão.
 * Como usamos IF NOT EXISTS, isso não apaga dados de um banco já existente.
 */
const initDb = async () => {
  try {
    // Tabela Administradores
    await query(`CREATE TABLE IF NOT EXISTS administradores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT UNIQUE,
        senha TEXT
    )`);

    // Tabela Vendedores
    await query(`CREATE TABLE IF NOT EXISTS vendedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT UNIQUE,
        senha TEXT,
        telefone TEXT
    )`);

    // Tabela Produtos
    await query(`CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendedor_id INTEGER,
        nome TEXT,
        preco REAL,
        descricao TEXT,
        categoria_id TEXT,
        imagem TEXT
    )`);

    // Tabela Pedidos
    await query(`CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER,
        vendedor_id INTEGER,
        total REAL,
        status TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        cliente_nome TEXT
    )`);

    // Tabela Itens do Pedido (Opcional, para expansão futura)

    await query(`CREATE TABLE IF NOT EXISTS pedido_itens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedido_id INTEGER,
        produto_id INTEGER,
        quantidade INTEGER,
        preco_unitario REAL
    )`);

 //  Tabela  para Tokens de recuperação de senha
 
    await query(`CREATE TABLE IF NOT EXISTS  tokens_recuperacao (
      usuario_id INTEGER, 
      tipo_usuario TEXT, 
      token TEXT, 
      expiracao TEXT
    )`);

    // --- SEED: Criar Admin Padrão (se não existir) ---
    const emailAdmin = "admin@energy.com";
    const [existing] = await query(
      "SELECT * FROM administradores WHERE email = ?",
      [emailAdmin]
    );

    if (existing.length === 0) {
      const senhaHash = await bcrypt.hash("123456", 10);
      await query(
        `INSERT INTO administradores (nome, email, senha) VALUES (?, ?, ?)`,
        ["Admin Master", emailAdmin, senhaHash]
      );
      console.log(`🔑 Admin padrão criado: ${emailAdmin} / Senha: 123456`);
    } else {
      console.log(" Banco carregado com sucesso!");
    }
  } catch (error) {
    console.error("❌ Erro ao inicializar tabelas do DB:", error);
  }
};

// Executa a inicialização
initDb();

module.exports = { query };
=======
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcrypt");

// [MUDANÇA] Define o caminho físico do arquivo do banco de dados
//.. voltei na pasta raiz do projeto e criei o arquivo database.sqlite lá
const dbPath = path.resolve(__dirname, "..", "database.sqlite");

// Conecta ao banco em arquivo físico
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao conectar SQLite:", err.message);
  } else {
    console.log(`✅ Conectado ao banco de dados SQLite em: ${dbPath}`);
  }
});

/**
 * Função wrapper para simular a interface de Promises do mysql2.
 * Mantém compatibilidade com seus services/controllers existentes.
 */
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    // Verifica se é um SELECT para usar o método correto do SQLite
    const isSelect = /^\s*SELECT/i.test(sql);

    if (isSelect) {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve([rows, []]); // Retorna rows e campos vazios (simulando mysql2)
      });
    } else {
      // INSERT, UPDATE, DELETE
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        // Simula o objeto de resultado do MySQL
        const result = {
          insertId: this.lastID,
          affectedRows: this.changes,
        };
        resolve([result, []]);
      });
    }
  });
};

/**
 * Inicializa as tabelas do sistema e criará um Admin padrão.
 * Como usamos IF NOT EXISTS, isso não apaga dados de um banco já existente.
 */
const initDb = async () => {
  try {
    // Tabela Administradores
    await query(`CREATE TABLE IF NOT EXISTS administradores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT UNIQUE,
        senha TEXT
    )`);

    // Tabela Vendedores
    await query(`CREATE TABLE IF NOT EXISTS vendedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT UNIQUE,
        senha TEXT,
        telefone TEXT
    )`);

    // Tabela Produtos
    await query(`CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendedor_id INTEGER,
        nome TEXT,
        preco REAL,
        descricao TEXT,
        categoria_id TEXT,
        imagem TEXT
    )`);

    // Tabela Pedidos
    await query(`CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER,
        vendedor_id INTEGER,
        total REAL,
        status TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        cliente_nome TEXT
    )`);

    // Tabela Itens do Pedido (Opcional, para expansão futura)

    await query(`CREATE TABLE IF NOT EXISTS pedido_itens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedido_id INTEGER,
        produto_id INTEGER,
        quantidade INTEGER,
        preco_unitario REAL
    )`);

 //  Tabela  para Tokens de recuperação de senha
 
    await query(`CREATE TABLE IF NOT EXISTS  tokens_recuperacao (
      usuario_id INTEGER, 
      tipo_usuario TEXT, 
      token TEXT, 
      expiracao TEXT
    )`);

    // --- SEED: Criar Admin Padrão (se não existir) ---
    const emailAdmin = "admin@energy.com";
    const [existing] = await query(
      "SELECT * FROM administradores WHERE email = ?",
      [emailAdmin]
    );

    if (existing.length === 0) {
      const senhaHash = await bcrypt.hash("123456", 10);
      await query(
        `INSERT INTO administradores (nome, email, senha) VALUES (?, ?, ?)`,
        ["Admin Master", emailAdmin, senhaHash]
      );
      console.log(`🔑 Admin padrão criado: ${emailAdmin} / Senha: 123456`);
    } else {
      console.log(" Banco carregado com sucesso!");
    }
  } catch (error) {
    console.error("❌ Erro ao inicializar tabelas do DB:", error);
  }
};

// Executa a inicialização
initDb();

module.exports = { query };
>>>>>>> 928181422bc864ba76942fce13b12b29e71f5201
