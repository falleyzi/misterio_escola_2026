// src/repositories/suspeitos.repository.js
const pool = require('../config/database');

class SuspeitosRepository {
  // Lista pública: nunca expor a coluna e_culpado para o frontend
  async listarTodos() {
    const { rows } = await pool.query(
      `SELECT id_suspeito, nome, cargo_funcao, foto_url, descricao_perfil,
              alibi_declarado, motivo_suspeita
       FROM suspeitos
       ORDER BY id_suspeito ASC`
    );
    return rows;
  }

  async buscarPorId(id) {
    const { rows } = await pool.query(
      `SELECT id_suspeito, nome, cargo_funcao, foto_url, descricao_perfil,
              alibi_declarado, motivo_suspeita
       FROM suspeitos
       WHERE id_suspeito = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async buscarEvidenciasDoSuspeito(idSuspeito) {
    const { rows } = await pool.query(
      `SELECT e.id_evidencia, e.codigo, e.tipo, e.titulo, e.descricao,
              e.nivel_importancia, e.data_hora_evento, res.tipo_relacao
       FROM relacao_evidencia_suspeito res
       JOIN evidencias e ON e.id_evidencia = res.id_evidencia
       WHERE res.id_suspeito = $1
       ORDER BY e.data_hora_evento ASC`,
      [idSuspeito]
    );
    return rows;
  }

  // Uso interno do backend apenas (validação da resposta final) — nunca exposto via API
  async buscarCulpado() {
    const { rows } = await pool.query(
      `SELECT id_suspeito, nome FROM suspeitos WHERE e_culpado = TRUE LIMIT 1`
    );
    return rows[0] || null;
  }

  async existePorId(id) {
    const { rows } = await pool.query(
      `SELECT 1 FROM suspeitos WHERE id_suspeito = $1`, [id]
    );
    return rows.length > 0;
  }
}

module.exports = new SuspeitosRepository();
