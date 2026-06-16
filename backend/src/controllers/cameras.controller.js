// src/controllers/cameras.controller.js
const camerasRepository = require('../repositories/cameras.repository');

exports.listarTodas = async (req, res, next) => {
  try {
    const cameras = await camerasRepository.listarTodas();
    res.json(cameras);
  } catch (err) {
    next(err);
  }
};

exports.listarRegistros = async (req, res, next) => {
  try {
    const { id } = req.params;
    const camera = await camerasRepository.buscarPorId(id);
    if (!camera) {
      return res.status(404).json({ erro: 'Câmera não encontrada.' });
    }
    const registros = await camerasRepository.listarRegistrosPorCamera(id);
    res.json({ camera, registros });
  } catch (err) {
    next(err);
  }
};
