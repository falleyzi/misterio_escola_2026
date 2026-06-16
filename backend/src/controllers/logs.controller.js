// src/controllers/logs.controller.js
const logsRepository = require('../repositories/logs.repository');

exports.listarLogsPredio = async (req, res, next) => {
  try {
    const logs = await logsRepository.listarLogsPredio();
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

exports.listarLogsServidor = async (req, res, next) => {
  try {
    const logs = await logsRepository.listarLogsServidor();
    res.json(logs);
  } catch (err) {
    next(err);
  }
};
