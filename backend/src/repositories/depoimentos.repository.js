// src/repositories/depoimentos.repository.js
const pool = require('../config/database');

class DepoimentosRepository {
  async listarTodos() {
    const { rows } = await pool.query(
      `SELECT d.id_depoimento, d.data_hora_depoimento, d.texto_depoimento,
              d.eh_alibi, d.id_evidencia_relacionada,
              s.id_suspeito, s.nome AS nome_suspeito
       FROM depoimentos d
       JOIN suspeitos s ON s.id_suspeito = d.id_suspeito
       ORDER BY d.data_hora_depoimento ASC`
    );
    return rows;
  }

  async listarPorSuspeito(idSuspeito) {
    const { rows } = await pool.query(
      `SELECT id_depoimento, data_hora_depoimento, texto_depoimento,
              eh_alibi, id_evidencia_relacionada
       FROM depoimentos
       WHERE id_suspeito = $1
       ORDER BY data_hora_depoimento ASC`,
      [idSuspeito]
    );
    return rows;
  }
}

module.exports = new DepoimentosRepository();
