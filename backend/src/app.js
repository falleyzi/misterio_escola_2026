// src/app.js
const express = require('express');
const cors = require('cors');

const suspeitosRoutes = require('./routes/suspeitos.routes');
const evidenciasRoutes = require('./routes/evidencias.routes');
const depoimentosRoutes = require('./routes/depoimentos.routes');
const camerasRoutes = require('./routes/cameras.routes');
const logsRoutes = require('./routes/logs.routes');
const resolucaoRoutes = require('./routes/resolucao.routes');
const rankingRoutes = require('./routes/ranking.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Healthcheck simples
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', servico: 'misterio-escola-backend' });
});

app.use('/api/suspeitos', suspeitosRoutes);
app.use('/api/evidencias', evidenciasRoutes);
app.use('/api/depoimentos', depoimentosRoutes);
app.use('/api/cameras', camerasRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/resolver', resolucaoRoutes);
app.use('/api/ranking', rankingRoutes);

// 404 — rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Middleware central de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const mensagem = err.message || 'Erro interno no servidor.';
  res.status(status).json({ erro: mensagem });
});

module.exports = app;
