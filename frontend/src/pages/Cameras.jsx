// src/pages/Cameras.jsx
import { useEffect, useState } from 'react';
import { listarCameras, listarRegistrosDaCamera } from '../services/cameras.service';
import { Carregando, Erro, Vazio } from '../components/StateMessage';
import QueryInspector from '../components/QueryInspector';

export default function Cameras() {
  const [cameras, setCameras] = useState([]);
  const [status, setStatus] = useState('carregando');
  const [selecionada, setSelecionada] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [statusRegistros, setStatusRegistros] = useState('idle');

  useEffect(() => {
    listarCameras()
      .then((dados) => {
        setCameras(dados);
        setStatus('ok');
        if (dados.length > 0) abrirCamera(dados[0]);
      })
      .catch(() => setStatus('erro'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function abrirCamera(camera) {
    setSelecionada(camera);
    setStatusRegistros('carregando');
    try {
      const resultado = await listarRegistrosDaCamera(camera.id_camera);
      setRegistros(resultado.registros);
      setStatusRegistros('ok');
    } catch {
      setStatusRegistros('erro');
    }
  }

  return (
    <div className="page-container">
      <p className="eyebrow">Módulo de câmeras</p>
      <h1 className="title-lg">Vigilância do prédio</h1>

      {status === 'carregando' && <Carregando />}
      {status === 'erro' && <Erro />}

      {status === 'ok' && (
        <>
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.4rem', flexWrap: 'wrap' }}>
            {cameras.map((c) => (
              <button
                key={c.id_camera}
                className={`btn ${selecionada?.id_camera === c.id_camera ? 'btn--primary' : 'btn--ghost'}`}
                onClick={() => abrirCamera(c)}
              >
                {c.codigo}
              </button>
            ))}
          </div>

          {selecionada && (
            <div className="card" style={{ marginBottom: '1.4rem' }}>
              <h2 className="title-md">{selecionada.codigo} — {selecionada.localizacao}</h2>
              <p className="text-muted" style={{ marginBottom: 0 }}>{selecionada.descricao}</p>
            </div>
          )}

          {statusRegistros === 'carregando' && <Carregando texto="Carregando registros da câmera..." />}
          {statusRegistros === 'erro' && <Erro />}
          {statusRegistros === 'ok' && registros.length === 0 && <Vazio texto="Nenhum registro para esta câmera." />}

          {statusRegistros === 'ok' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {registros.map((r) => (
                <div key={r.id_registro} className="card">
                  <p className="text-mono text-muted" style={{ fontSize: '0.8rem', margin: '0 0 0.5rem' }}>
                    {new Date(r.data_hora).toLocaleString('pt-BR')}
                  </p>
                  <p style={{ margin: 0 }}>{r.descricao_cena}</p>
                  {r.nome_suspeito_identificado && (
                    <p className="text-muted" style={{ marginBottom: 0, marginTop: '0.5rem', fontSize: '0.85rem' }}>
                      Pessoa identificada: <strong>{r.nome_suspeito_identificado}</strong>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <QueryInspector
        sql={
          selecionada
            ? `SELECT r.*, s.nome AS nome_suspeito_identificado\nFROM registros_cameras r\nLEFT JOIN suspeitos s ON s.id_suspeito = r.id_suspeito_identificado\nWHERE r.id_camera = ${selecionada.id_camera}\nORDER BY r.data_hora;`
            : `SELECT * FROM cameras ORDER BY codigo;`
        }
      />
    </div>
  );
}
