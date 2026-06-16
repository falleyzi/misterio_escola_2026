// src/services/resolucao.service.js
const suspeitosRepository = require('../repositories/suspeitos.repository');
const evidenciasRepository = require('../repositories/evidencias.repository');

class ResolucaoService {
  /**
   * Valida a resposta final enviada pelo investigador e calcula a pontuação.
   *
   * Regras de pontuação:
   *  - pontosBase: 1000 se acertou (suspeito E evidência decisiva corretos), 200 se errou.
   *  - bonusTempo: max(0, 500 - tempoSegundos), incentiva investigações rápidas.
   *  - pontuacaoTotal: pontosBase + bonusTempo (nunca negativo).
   */
  async validarResposta(payload) {
    const {
      idSuspeitoApontado,
      motivoEscolhido,
      metodoEscolhido,
      idEvidenciaDecisivaEscolhida,
      tempoSegundos
    } = payload;

    // ---- Validação de entrada ----
    if (!idSuspeitoApontado || !idEvidenciaDecisivaEscolhida) {
      const erro = new Error('idSuspeitoApontado e idEvidenciaDecisivaEscolhida são obrigatórios.');
      erro.status = 400;
      throw erro;
    }
    if (!Number.isInteger(tempoSegundos) || tempoSegundos < 0) {
      const erro = new Error('tempoSegundos deve ser um número inteiro maior ou igual a zero.');
      erro.status = 400;
      throw erro;
    }

    const suspeitoExiste = await suspeitosRepository.existePorId(idSuspeitoApontado);
    if (!suspeitoExiste) {
      const erro = new Error('Suspeito apontado não encontrado.');
      erro.status = 404;
      throw erro;
    }

    const evidenciaExiste = await evidenciasRepository.existePorId(idEvidenciaDecisivaEscolhida);
    if (!evidenciaExiste) {
      const erro = new Error('Evidência decisiva escolhida não encontrada.');
      erro.status = 404;
      throw erro;
    }

    // ---- Verificação da solução correta (lógica de negócio central do jogo) ----
    const suspeitoCorreto = await suspeitosRepository.buscarCulpado();
    const evidenciaCorreta = await evidenciasRepository.buscarDecisiva();

    const acertouSuspeito = Number(idSuspeitoApontado) === suspeitoCorreto.id_suspeito;
    const acertouEvidencia = Number(idEvidenciaDecisivaEscolhida) === evidenciaCorreta.id_evidencia;
    const acertou = acertouSuspeito && acertouEvidencia;

    // ---- Cálculo de pontuação ----
    const pontosBase = acertou ? 1000 : 200;
    const bonusTempo = Math.max(0, 500 - tempoSegundos);
    const pontuacaoTotal = Math.max(0, pontosBase + bonusTempo);

    const suspeitoCorretoCompleto = await suspeitosRepository.buscarPorId(suspeitoCorreto.id_suspeito);
    const evidenciaCorretaCompleta = await evidenciasRepository.buscarPorId(evidenciaCorreta.id_evidencia);

    return {
      acertou,
      acertouSuspeito,
      acertouEvidencia,
      pontuacao: pontuacaoTotal,
      detalhes: { pontosBase, bonusTempo },
      respostaEnviada: {
        idSuspeitoApontado: Number(idSuspeitoApontado),
        motivoEscolhido,
        metodoEscolhido,
        idEvidenciaDecisivaEscolhida: Number(idEvidenciaDecisivaEscolhida)
      },
      solucaoCorreta: {
        suspeito: suspeitoCorretoCompleto,
        evidenciaDecisiva: evidenciaCorretaCompleta
      }
    };
  }
}

module.exports = new ResolucaoService();
