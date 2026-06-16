// src/pages/Resultado.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarNoRanking } from '../services/ranking.service';

function formatarTempo(segundos) {
  const m = Math.floor(segundos / 60).toString().padStart(2, '0');
  const s = Math.floor(segundos % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function Resultado({ resultado }) {
  const navigate = useNavigate();
  const [apelido, setApelido] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState(null);

  if (!resultado) {
    return (
      <div className="page-container page-container--narrow">
        <p className="state-message">Nenhum resultado disponível. Resolva o caso primeiro.</p>
        <button className="btn btn--primary btn--block" onClick={() => navigate('/dashboard')}>
          Voltar ao painel
        </button>
      </div>
    );
  }

  const { acertou, pontuacao, tempoSegundos, solucaoCorreta } = resultado;

  async function salvarNoRanking() {
    if (!apelido.trim()) {
      setErro('Informe um nome ou apelido.');
      return;
    }
    setSalvando(true);
    setErro(null);
    try {
      await registrarNoRanking({
        nomeInvestigador: apelido.trim(),
        acertou,
        pontuacao,
        tempoSegundos
      });
      setSalvo(true);
    } catch {
      setErro('Não foi possível salvar no ranking. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="page-container page-container--narrow">
      <div className={`result-banner ${acertou ? 'result-banner--sucesso' : 'result-banner--erro'}`}>
        <p className="eyebrow">{acertou ? 'Caso resolvido' : 'Conclusão divergente'}</p>
        <h1 className="result-banner__title">{acertou ? 'Você acertou!' : 'Quase lá'}</h1>
        <p className="text-muted" style={{ marginBottom: 0 }}>
          {acertou
            ? 'Sua combinação de suspeito e evidência decisiva confere com os registros do caso.'
            : 'Sua resposta não corresponde exatamente aos registros que fecham o caso.'}
        </p>
      </div>

      <div className="score-grid">
        <div className="score-box">
          <div className="score-box__value">{pontuacao}</div>
          <div className="score-box__label">Pontuação</div>
        </div>
        <div className="score-box">
          <div className="score-box__value">{formatarTempo(tempoSegundos)}</div>
          <div className="score-box__label">Tempo</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.6rem' }}>
        <h2 className="title-md">Solução correta</h2>
        <p style={{ marginBottom: '0.4rem' }}>
          <strong>Culpado:</strong> {solucaoCorreta.suspeito.nome}
        </p>
        <p style={{ marginBottom: '0.4rem' }}>
          <strong>Evidência decisiva:</strong> {solucaoCorreta.evidenciaDecisiva.codigo} — {solucaoCorreta.evidenciaDecisiva.titulo}
        </p>
        <p style={{ marginBottom: 0 }}>{solucaoCorreta.evidenciaDecisiva.descricao}</p>
      </div>

      {!salvo ? (
        <div className="card">
          <h2 className="title-md">Entrar no ranking</h2>
          <p className="text-muted">Informe um nome ou apelido para aparecer no ranking dos investigadores.</p>
          <input
            className="input-field"
            placeholder="Seu nome ou apelido"
            value={apelido}
            onChange={(e) => setApelido(e.target.value)}
            maxLength={80}
            style={{ marginBottom: '0.8rem' }}
          />
          {erro && <p className="state-message state-message--error" style={{ padding: 0, textAlign: 'left' }}>{erro}</p>}
          <button className="btn btn--primary btn--block" onClick={salvarNoRanking} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar no ranking'}
          </button>
        </div>
      ) : (
        <button className="btn btn--secondary btn--block" onClick={() => navigate('/ranking')}>
          Ver ranking geral
        </button>
      )}

      <button className="btn btn--ghost btn--block" style={{ marginTop: '0.8rem' }} onClick={() => navigate('/')}>
        Jogar de novo
      </button>
    </div>
  );
}
