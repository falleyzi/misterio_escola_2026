// src/repositories/ranking.repository.js
const pool = require('../config/database');

class RankingRepository {
  async criarEntrada({ nomeInvestigador, acertou, pontuacao, tempoSegundos }) {
    const { rows } = await pool.query(
      `INSERT INTO ranking (nome_investigador, acertou, pontuacao, tempo_segundos)
       VALUES ($1, $2, $3, $4)
       RETURNING id_ranking, nome_investigador, acertou, pontuacao, tempo_segundos, criado_em`,
      [nomeInvestigador, acertou, pontuacao, tempoSegundos]
    );
    return rows[0];
  }

  async listarTop10() {
    const { rows } = await pool.query(
      `SELECT nome_investigador, acertou, pontuacao, tempo_segundos, criado_em
       FROM ranking
       ORDER BY pontuacao DESC, tempo_segundos ASC
       LIMIT 10`
    );
    return rows;
  }
}

module.exports = new RankingRepository();
