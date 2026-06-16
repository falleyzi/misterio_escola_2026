// src/controllers/depoimentos.controller.js
const depoimentosRepository = require('../repositories/depoimentos.repository');

exports.listarTodos = async (req, res, next) => {
  try {
    const depoimentos = await depoimentosRepository.listarTodos();
    res.json(depoimentos);
  } catch (err) {
    next(err);
  }
};
