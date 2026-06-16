// src/repositories/evidencias.repository.js
const pool = require('../config/database');

class EvidenciasRepository {
  async listarTodas({ tipo, nivelImportancia } = {}) {
    const condicoes = [];
    const params = [];

    if (tipo) {
      params.push(tipo);
      condicoes.push(`tipo = $${params.length}`);
    }
    if (nivelImportancia) {
      params.push(nivelImportancia);
      condicoes.push(`nivel_importancia = $${params.length}`);
    }

    const where = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT id_evidencia, codigo, tipo, titulo, descricao,
              nivel_importancia, data_hora_evento, arquivo_midia_url
       FROM evidencias
       ${where}
       ORDER BY data_hora_evento ASC`,
      params
    );
    return rows;
  }

  async buscarPorId(id) {
    const { rows } = await pool.query(
      `SELECT id_evidencia, codigo, tipo, titulo, descricao,
              nivel_importancia, data_hora_evento, arquivo_midia_url
       FROM evidencias
       WHERE id_evidencia = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async buscarPorCodigo(codigo) {
    const { rows } = await pool.query(
      `SELECT id_evidencia, codigo, tipo, titulo, descricao,
              nivel_importancia, data_hora_evento, arquivo_midia_url
       FROM evidencias
       WHERE codigo = $1`,
      [codigo]
    );
    return rows[0] || null;
  }

  async buscarSuspeitosRelacionados(idEvidencia) {
    const { rows } = await pool.query(
      `SELECT s.id_suspeito, s.nome, res.tipo_relacao
       FROM relacao_evidencia_suspeito res
       JOIN suspeitos s ON s.id_suspeito = res.id_suspeito
       WHERE res.id_evidencia = $1`,
      [idEvidencia]
    );
    return rows;
  }

  // Uso interno do backend apenas (validação da resposta final)
  async buscarDecisiva() {
    const { rows } = await pool.query(
      `SELECT id_evidencia, codigo FROM evidencias
       WHERE nivel_importancia = 'decisiva' AND tipo = 'item_fisico'
       LIMIT 1`
    );
    return rows[0] || null;
  }

  async existePorId(id) {
    const { rows } = await pool.query(
      `SELECT 1 FROM evidencias WHERE id_evidencia = $1`, [id]
    );
    return rows.length > 0;
  }
}

module.exports = new EvidenciasRepository();
