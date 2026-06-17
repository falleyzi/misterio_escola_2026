// src/config/database.js
const { Pool } = require('pg');
require('dotenv').config();


console.log('PGHOST=', process.env.PGHOST);
console.log('PGPORT=', process.env.PGPORT);
console.log('PGUSER=', process.env.PGUSER);
console.log('PGPASSWORD=', process.env.PGPASSWORD);
console.log('PGDATABASE=', process.env.PGDATABASE);

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5436,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexões PostgreSQL:', err);
});

module.exports = pool;
