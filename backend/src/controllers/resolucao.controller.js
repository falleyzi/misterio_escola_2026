// src/controllers/resolucao.controller.js
const resolucaoService = require('../services/resolucao.service');

exports.resolver = async (req, res, next) => {
  try {
    const resultado = await resolucaoService.validarResposta(req.body);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
};
