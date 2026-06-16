// src/controllers/suspeitos.controller.js
const suspeitosService = require('../services/suspeitos.service');

exports.listarTodos = async (req, res, next) => {
  try {
    const suspeitos = await suspeitosService.listarTodos();
    res.json(suspeitos);
  } catch (err) {
    next(err);
  }
};

exports.buscarPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const suspeito = await suspeitosService.buscarPorId(id);
    if (!suspeito) {
      return res.status(404).json({ erro: 'Suspeito não encontrado.' });
    }
    res.json(suspeito);
  } catch (err) {
    next(err);
  }
};

exports.buscarEvidenciasDoSuspeito = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await suspeitosService.buscarEvidenciasDoSuspeito(id);
    if (!resultado) {
      return res.status(404).json({ erro: 'Suspeito não encontrado.' });
    }
    res.json(resultado);
  } catch (err) {
    next(err);
  }
};
