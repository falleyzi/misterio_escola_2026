// src/pages/Ranking.jsx
import { useEffect, useState } from 'react';
import { listarRankingTop10 } from '../services/ranking.service';
import { Carregando, Erro, Vazio } from '../components/StateMessage';
import QueryInspector from '../components/QueryInspector';

function formatarTempo(segundos) {
  const m = Math.floor(segundos / 60).toString().padStart(2, '0');
  const s = Math.floor(segundos % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [status, setStatus] = useState('carregando');

  useEffect(() => {
    listarRankingTop10()
      .then((dados) => {
        setRanking(dados);
        setStatus('ok');
      })
      .catch(() => setStatus('erro'));
  }, []);

  return (
    <div className="page-container">
      <p className="eyebrow">Ranking</p>
      <h1 className="title-lg">Top 10 investigadores</h1>

      {status === 'carregando' && <Carregando />}
      {status === 'erro' && <Erro />}
      {status === 'ok' && ranking.length === 0 && <Vazio texto="Ainda não há investigadores no ranking." />}

      {status === 'ok' && ranking.length > 0 && (
        <table className="ranking-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Investigador</th>
              <th>Resultado</th>
              <th>Pontos</th>
              <th>Tempo</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((r, i) => (
              <tr key={`${r.nome_investigador}-${r.criado_em}`}>
                <td>{i + 1}</td>
                <td>{r.nome_investigador}</td>
                <td>{r.acertou ? 'Acertou' : 'Errou'}</td>
                <td>{r.pontuacao}</td>
                <td>{formatarTempo(r.tempo_segundos)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <QueryInspector
        sql={`SELECT nome_investigador, acertou, pontuacao, tempo_segundos\nFROM ranking\nORDER BY pontuacao DESC, tempo_segundos ASC\nLIMIT 10;`}
      />
    </div>
  );
}
