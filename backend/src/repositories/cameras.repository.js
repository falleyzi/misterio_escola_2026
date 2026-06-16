// src/repositories/cameras.repository.js
const pool = require('../config/database');

class CamerasRepository {
  async listarTodas() {
    const { rows } = await pool.query(
      `SELECT id_camera, codigo, localizacao, descricao
       FROM cameras
       ORDER BY codigo ASC`
    );
    return rows;
  }

  async buscarPorId(id) {
    const { rows } = await pool.query(
      `SELECT id_camera, codigo, localizacao, descricao
       FROM cameras
       WHERE id_camera = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async listarRegistrosPorCamera(idCamera) {
    const { rows } = await pool.query(
      `SELECT r.id_registro, r.data_hora, r.descricao_cena, r.imagem_url,
              r.id_suspeito_identificado, s.nome AS nome_suspeito_identificado
       FROM registros_cameras r
       LEFT JOIN suspeitos s ON s.id_suspeito = r.id_suspeito_identificado
       WHERE r.id_camera = $1
       ORDER BY r.data_hora ASC`,
      [idCamera]
    );
    return rows;
  }
}

module.exports = new CamerasRepository();
