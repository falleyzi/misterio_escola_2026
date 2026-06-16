// src/pages/Depoimentos.jsx
import { useEffect, useState } from 'react';
import { listarDepoimentos } from '../services/depoimentos.service';
import { Carregando, Erro, Vazio } from '../components/StateMessage';
import QueryInspector from '../components/QueryInspector';

export default function Depoimentos() {
  const [depoimentos, setDepoimentos] = useState([]);
  const [status, setStatus] = useState('carregando');

  useEffect(() => {
    listarDepoimentos()
      .then((dados) => {
        setDepoimentos(dados);
        setStatus('ok');
      })
      .catch(() => setStatus('erro'));
  }, []);

  return (
    <div className="page-container">
      <p className="eyebrow">Módulo de depoimentos</p>
      <h1 className="title-lg">Transcrições dos relatos</h1>

      {status === 'carregando' && <Carregando />}
      {status === 'erro' && <Erro />}
      {status === 'ok' && depoimentos.length === 0 && <Vazio />}

      {status === 'ok' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {depoimentos.map((d) => (
            <div key={d.id_depoimento} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.4rem' }}>
                <h2 className="title-md" style={{ fontSize: '1.05rem' }}>{d.nome_suspeito}</h2>
                {d.eh_alibi && <span className="badge badge--alta">Álibi</span>}
              </div>
              <p className="text-muted text-mono" style={{ fontSize: '0.78rem', margin: '0.2rem 0 0.8rem' }}>
                {new Date(d.data_hora_depoimento).toLocaleString('pt-BR')}
              </p>
              <p style={{ margin: 0 }}>"{d.texto_depoimento}"</p>
            </div>
          ))}
        </div>
      )}

      <QueryInspector
        sql={`SELECT d.*, s.nome AS nome_suspeito\nFROM depoimentos d\nJOIN suspeitos s ON s.id_suspeito = d.id_suspeito\nORDER BY d.data_hora_depoimento;`}
      />
    </div>
  );
}
