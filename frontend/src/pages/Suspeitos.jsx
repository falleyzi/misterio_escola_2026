// src/pages/Suspeitos.jsx
import { useEffect, useState } from 'react';
import { listarSuspeitos, buscarEvidenciasDoSuspeito } from '../services/suspeitos.service';
import { Carregando, Erro, Vazio } from '../components/StateMessage';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import QueryInspector from '../components/QueryInspector';

export default function Suspeitos() {
  const [suspeitos, setSuspeitos] = useState([]);
  const [status, setStatus] = useState('carregando');
  const [selecionado, setSelecionado] = useState(null);
  const [evidenciasDoSuspeito, setEvidenciasDoSuspeito] = useState(null);
  const [carregandoEvidencias, setCarregandoEvidencias] = useState(false);

  useEffect(() => {
    listarSuspeitos()
      .then((dados) => {
        setSuspeitos(dados);
        setStatus('ok');
      })
      .catch(() => setStatus('erro'));
  }, []);

  async function abrirSuspeito(suspeito) {
    setSelecionado(suspeito);
    setEvidenciasDoSuspeito(null);
    setCarregandoEvidencias(true);
    try {
      const resultado = await buscarEvidenciasDoSuspeito(suspeito.id_suspeito);
      setEvidenciasDoSuspeito(resultado.evidencias);
    } catch {
      setEvidenciasDoSuspeito([]);
    } finally {
      setCarregandoEvidencias(false);
    }
  }

  return (
    <div className="page-container">
      <p className="eyebrow">Módulo de suspeitos</p>
      <h1 className="title-lg">Quatro pessoas, quatro histórias</h1>

      {status === 'carregando' && <Carregando />}
      {status === 'erro' && <Erro />}
      {status === 'ok' && suspeitos.length === 0 && <Vazio />}

      {status === 'ok' && (
        <div className="card-grid">
          {suspeitos.map((s) => (
            <div key={s.id_suspeito} className="card card--clickable" onClick={() => abrirSuspeito(s)}>
              <h2 className="title-md">{s.nome}</h2>
              <p className="text-muted" style={{ marginBottom: 0 }}>{s.cargo_funcao}</p>
            </div>
          ))}
        </div>
      )}

      {selecionado && (
        <Modal onClose={() => setSelecionado(null)}>
          <h2 className="title-md">{selecionado.nome}</h2>
          <p className="text-muted" style={{ marginTop: 0 }}>{selecionado.cargo_funcao}</p>

          <h3 className="title-md" style={{ fontSize: '1rem', marginTop: '1.4rem' }}>Perfil</h3>
          <p>{selecionado.descricao_perfil}</p>

          <h3 className="title-md" style={{ fontSize: '1rem' }}>Álibi declarado</h3>
          <p>{selecionado.alibi_declarado}</p>

          <h3 className="title-md" style={{ fontSize: '1rem' }}>Possível motivo</h3>
          <p>{selecionado.motivo_suspeita}</p>

          <h3 className="title-md" style={{ fontSize: '1rem' }}>Evidências relacionadas</h3>
          {carregandoEvidencias && <Carregando texto="Cruzando evidências..." />}
          {!carregandoEvidencias && evidenciasDoSuspeito && evidenciasDoSuspeito.length === 0 && (
            <Vazio texto="Nenhuma evidência relacionada a este suspeito." />
          )}
          {!carregandoEvidencias && evidenciasDoSuspeito && evidenciasDoSuspeito.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {evidenciasDoSuspeito.map((e) => (
                <div key={e.id_evidencia} className="card" style={{ padding: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span className="text-mono" style={{ fontSize: '0.8rem' }}>{e.codigo}</span>
                    <Badge tipo={e.tipo_relacao} />
                  </div>
                  <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem' }}>{e.titulo}</p>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      <QueryInspector
        sql={
          selecionado
            ? `SELECT e.*, res.tipo_relacao\nFROM relacao_evidencia_suspeito res\nJOIN evidencias e ON e.id_evidencia = res.id_evidencia\nWHERE res.id_suspeito = ${selecionado.id_suspeito};`
            : `SELECT id_suspeito, nome, cargo_funcao, descricao_perfil, alibi_declarado, motivo_suspeita\nFROM suspeitos\nORDER BY id_suspeito;`
        }
      />
    </div>
  );
}
