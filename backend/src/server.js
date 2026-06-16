// src/server.js
require('dotenv').config();
const app = require('./app');
const pool = require('./config/database');

const PORT = process.env.PORT || 3001;

async function iniciar() {
  try {
    // Testa a conexão com o PostgreSQL antes de subir o servidor
    await pool.query('SELECT 1');
    console.log('Conexão com PostgreSQL estabelecida com sucesso.');

    app.listen(PORT, () => {
      console.log(`Servidor "Misterio na Escola" rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Falha ao conectar no PostgreSQL. Verifique o arquivo .env e se o serviço do PostgreSQL está ativo.');
    console.error(err);
    process.exit(1);
  }
}

iniciar();
