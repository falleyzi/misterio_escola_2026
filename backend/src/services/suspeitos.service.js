// src/services/suspeitos.service.js
const suspeitosRepository = require('../repositories/suspeitos.repository');
const evidenciasRepository = require('../repositories/evidencias.repository');

class SuspeitosService {
  async listarTodos() {
    return suspeitosRepository.listarTodos();
  }

  async buscarPorId(id) {
    return suspeitosRepository.buscarPorId(id);
  }

  async buscarEvidenciasDoSuspeito(idSuspeito) {
    const suspeito = await suspeitosRepository.buscarPorId(idSuspeito);
    if (!suspeito) return null;
    const evidencias = await suspeitosRepository.buscarEvidenciasDoSuspeito(idSuspeito);
    return { suspeito, evidencias };
  }
}

module.exports = new SuspeitosService();
