// src/controllers/evidencias.controller.js
const evidenciasService = require('../services/evidencias.service');

exports.listarTodas = async (req, res, next) => {
  try {
    const { tipo, nivelImportancia } = req.query;
    const evidencias = await evidenciasService.listarTodas({ tipo, nivelImportancia });
    res.json(evidencias);
  } catch (err) {
    next(err);
  }
};

exports.buscarPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const evidencia = await evidenciasService.buscarDetalhe(id);
    if (!evidencia) {
      return res.status(404).json({ erro: 'Evidência não encontrada.' });
    }
    res.json(evidencia);
  } catch (err) {
    next(err);
  }
};
