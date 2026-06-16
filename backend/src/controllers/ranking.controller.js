// src/controllers/ranking.controller.js
const rankingService = require('../services/ranking.service');

exports.listarTop10 = async (req, res, next) => {
  try {
    const ranking = await rankingService.listarTop10();
    res.json(ranking);
  } catch (err) {
    next(err);
  }
};

exports.registrar = async (req, res, next) => {
  try {
    const entrada = await rankingService.registrar(req.body);
    res.status(201).json(entrada);
  } catch (err) {
    next(err);
  }
};
