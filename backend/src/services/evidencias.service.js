// src/services/evidencias.service.js
const evidenciasRepository = require('../repositories/evidencias.repository');

const TIPOS_VALIDOS = [
  'log_portaria', 'log_servidor', 'camera', 'depoimento',
  'documento', 'item_fisico', 'log_vpn', 'historico_academico'
];
const NIVEIS_VALIDOS = ['baixa', 'media', 'alta', 'decisiva'];

class EvidenciasService {
  async listarTodas({ tipo, nivelImportancia }) {
    if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
      const erro = new Error(`Tipo de evidência inválido. Valores aceitos: ${TIPOS_VALIDOS.join(', ')}`);
      erro.status = 400;
      throw erro;
    }
    if (nivelImportancia && !NIVEIS_VALIDOS.includes(nivelImportancia)) {
      const erro = new Error(`Nível de importância inválido. Valores aceitos: ${NIVEIS_VALIDOS.join(', ')}`);
      erro.status = 400;
      throw erro;
    }
    return evidenciasRepository.listarTodas({ tipo, nivelImportancia });
  }

  async buscarDetalhe(id) {
    const evidencia = await evidenciasRepository.buscarPorId(id);
    if (!evidencia) return null;
    const suspeitosRelacionados = await evidenciasRepository.buscarSuspeitosRelacionados(id);
    return { ...evidencia, suspeitos_relacionados: suspeitosRelacionados };
  }
}

module.exports = new EvidenciasService();
