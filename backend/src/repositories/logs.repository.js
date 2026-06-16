// src/repositories/logs.repository.js
const pool = require('../config/database');

class LogsRepository {
  async listarLogsPredio() {
    const { rows } = await pool.query(
      `SELECT l.id_log_predio, l.data_hora, l.tipo_evento, l.descricao,
              l.id_suspeito, s.nome AS nome_suspeito
       FROM logs_acesso_predio l
       LEFT JOIN suspeitos s ON s.id_suspeito = l.id_suspeito
       ORDER BY l.data_hora ASC`
    );
    return rows;
  }

  async listarLogsServidor() {
    const { rows } = await pool.query(
      `SELECT l.id_log_servidor, l.data_hora_inicio, l.data_hora_fim,
              l.usuario_autenticado, l.endereco_ip, l.tipo_rede,
              l.acao_realizada, l.caminho_arquivo, l.status,
              l.id_suspeito_responsavel, s.nome AS nome_suspeito_responsavel
       FROM logs_servidor l
       LEFT JOIN suspeitos s ON s.id_suspeito = l.id_suspeito_responsavel
       ORDER BY l.data_hora_inicio ASC`
    );
    return rows;
  }
}

module.exports = new LogsRepository();
