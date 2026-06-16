// src/pages/Logs.jsx
import { useEffect, useState } from 'react';
import { listarLogsPredio, listarLogsServidor } from '../services/logs.service';
import { Carregando, Erro, Vazio } from '../components/StateMessage';
import QueryInspector from '../components/QueryInspector';

export default function Logs() {
  const [aba, setAba] = useState('servidor');
  const [logsPredio, setLogsPredio] = useState([]);
  const [logsServidor, setLogsServidor] = useState([]);
  const [status, setStatus] = useState('carregando');

  useEffect(() => {
    Promise.all([listarLogsPredio(), listarLogsServidor()])
      .then(([predio, servidor]) => {
        setLogsPredio(predio);
        setLogsServidor(servidor);
        setStatus('ok');
      })
      .catch(() => setStatus('erro'));
  }, []);

  return (
    <div className="page-container">
      <p className="eyebrow">Módulo de logs</p>
      <h1 className="title-lg">Registros brutos do sistema</h1>

      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.4rem' }}>
        <button className={`btn ${aba === 'servidor' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setAba('servidor')}>
          Logs do servidor
        </button>
        <button className={`btn ${aba === 'predio' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setAba('predio')}>
          Logs do prédio
        </button>
      </div>

      {status === 'carregando' && <Carregando />}
      {status === 'erro' && <Erro />}

      {status === 'ok' && aba === 'servidor' && (
        logsServidor.length === 0 ? <Vazio /> : (
          <div className="terminal">
            {logsServidor.map((l) => (
              <div key={l.id_log_servidor} className="terminal__line">
                <span className="terminal__ts">{new Date(l.data_hora_inicio).toLocaleString('pt-BR')}</span>
                <span className="terminal__user">{l.usuario_autenticado}</span>
                <span className="terminal__action">
                  {l.acao_realizada}{l.caminho_arquivo ? ` ${l.caminho_arquivo}` : ''} ({l.tipo_rede}, {l.endereco_ip})
                </span>
                <span className={`terminal__status--${l.status}`}>{l.status}</span>
              </div>
            ))}
          </div>
        )
      )}

      {status === 'ok' && aba === 'predio' && (
        logsPredio.length === 0 ? <Vazio /> : (
          <div className="terminal">
            {logsPredio.map((l) => (
              <div key={l.id_log_predio} className="terminal__line">
                <span className="terminal__ts">{new Date(l.data_hora).toLocaleString('pt-BR')}</span>
                <span className="terminal__user">{l.nome_suspeito || '— não identificado —'}</span>
                <span className="terminal__action">{l.descricao}</span>
                <span className="terminal__status--sucesso">{l.tipo_evento}</span>
              </div>
            ))}
          </div>
        )
      )}

      <QueryInspector
        sql={
          aba === 'servidor'
            ? `SELECT l.*, s.nome AS nome_suspeito_responsavel\nFROM logs_servidor l\nLEFT JOIN suspeitos s ON s.id_suspeito = l.id_suspeito_responsavel\nORDER BY l.data_hora_inicio;`
            : `SELECT l.*, s.nome AS nome_suspeito\nFROM logs_acesso_predio l\nLEFT JOIN suspeitos s ON s.id_suspeito = l.id_suspeito\nORDER BY l.data_hora;`
        }
      />
    </div>
  );
}
