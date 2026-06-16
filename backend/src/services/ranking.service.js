// src/services/ranking.service.js
const rankingRepository = require('../repositories/ranking.repository');

class RankingService {
  async registrar({ nomeInvestigador, acertou, pontuacao, tempoSegundos }) {
    if (!nomeInvestigador || typeof nomeInvestigador !== 'string' || !nomeInvestigador.trim()) {
      const erro = new Error('nomeInvestigador é obrigatório.');
      erro.status = 400;
      throw erro;
    }
    if (typeof acertou !== 'boolean') {
      const erro = new Error('acertou deve ser um valor booleano.');
      erro.status = 400;
      throw erro;
    }
    if (!Number.isInteger(pontuacao) || pontuacao < 0) {
      const erro = new Error('pontuacao deve ser um número inteiro maior ou igual a zero.');
      erro.status = 400;
      throw erro;
    }
    if (!Number.isInteger(tempoSegundos) || tempoSegundos < 0) {
      const erro = new Error('tempoSegundos deve ser um número inteiro maior ou igual a zero.');
      erro.status = 400;
      throw erro;
    }

    const nomeSanitizado = nomeInvestigador.trim().slice(0, 80);

    return rankingRepository.criarEntrada({
      nomeInvestigador: nomeSanitizado,
      acertou,
      pontuacao,
      tempoSegundos
    });
  }

  async listarTop10() {
    return rankingRepository.listarTop10();
  }
}

module.exports = new RankingService();
