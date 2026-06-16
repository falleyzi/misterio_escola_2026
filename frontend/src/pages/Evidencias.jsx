// src/pages/Evidencias.jsx
import { useEffect, useState } from 'react';
import { listarEvidencias, buscarEvidencia } from '../services/evidencias.service';
import { Carregando, Erro, Vazio } from '../components/StateMessage';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import QueryInspector from '../components/QueryInspector';

const TIPOS = [
  { valor: '', rotulo: 'Todos os tipos' },
  { valor: 'log_portaria', rotulo: 'Log de portaria' },
  { valor: 'log_servidor', rotulo: 'Log de servidor' },
  { valor: 'camera', rotulo: 'Câmera' },
  { valor: 'depoimento', rotulo: 'Depoimento' },
  { valor: 'documento', rotulo: 'Documento' },
  { valor: 'item_fisico', rotulo: 'Item físico' },
  { valor: 'log_vpn', rotulo: 'Log de VPN' },
  { valor: 'historico_academico', rotulo: 'Histórico acadêmico' }
];

const NIVEIS = [
  { valor: '', rotulo: 'Todos os níveis' },
  { valor: 'baixa', rotulo: 'Baixa' },
  { valor: 'media', rotulo: 'Média' },
  { valor: 'alta', rotulo: 'Alta' },
  { valor: 'decisiva', rotulo: 'Decisiva' }
];

export default function Evidencias() {
  const [evidencias, setEvidencias] = useState([]);
  const [status, setStatus] = useState('carregando');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroNivel, setFiltroNivel] = useState('');
  const [selecionada, setSelecionada] = useState(null);

  function carregar() {
    setStatus('carregando');
    listarEvidencias({ tipo: filtroTipo, nivelImportancia: filtroNivel })
      .then((dados) => {
        setEvidencias(dados);
        setStatus('ok');
      })
      .catch(() => setStatus('erro'));
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroTipo, filtroNivel]);

  async function abrirEvidencia(ev) {
    try {
      const detalhe = await buscarEvidencia(ev.id_evidencia);
      setSelecionada(detalhe);
    } catch {
      setSelecionada(ev);
    }
  }

  return (
    <div className="page-container">
      <p className="eyebrow">Módulo de evidências</p>
      <h1 className="title-lg">Catálogo de provas</h1>

      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.4rem', flexWrap: 'wrap' }}>
        <select className="input-field" style={{ maxWidth: 220 }} value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          {TIPOS.map((t) => <option key={t.valor} value={t.valor}>{t.rotulo}</option>)}
        </select>
        <select className="input-field" style={{ maxWidth: 220 }} value={filtroNivel} onChange={(e) => setFiltroNivel(e.target.value)}>
          {NIVEIS.map((n) => <option key={n.valor} value={n.valor}>{n.rotulo}</option>)}
        </select>
      </div>

      {status === 'carregando' && <Carregando />}
      {status === 'erro' && <Erro />}
      {status === 'ok' && evidencias.length === 0 && <Vazio texto="Nenhuma evidência encontrada com esse filtro." />}

      {status === 'ok' && (
        <div className="card-grid">
          {evidencias.map((e) => (
            <div key={e.id_evidencia} className="card card--clickable" onClick={() => abrirEvidencia(e)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.6rem' }}>
                <span className="text-mono" style={{ fontSize: '0.8rem' }}>{e.codigo}</span>
                <Badge tipo={e.nivel_importancia} />
              </div>
              <h2 className="title-md" style={{ fontSize: '1.05rem' }}>{e.titulo}</h2>
              <p className="text-muted" style={{ marginBottom: 0, fontSize: '0.88rem' }}>{e.tipo.replace('_', ' ')}</p>
            </div>
          ))}
        </div>
      )}

      {selecionada && (
        <Modal onClose={() => setSelecionada(null)}>
          <span className="text-mono">{selecionada.codigo}</span>
          <h2 className="title-md">{selecionada.titulo}</h2>
          <Badge tipo={selecionada.nivel_importancia} />
          <p style={{ marginTop: '1rem' }}>{selecionada.descricao}</p>
          {selecionada.data_hora_evento && (
            <p className="text-muted text-mono" style={{ fontSize: '0.85rem' }}>
              {new Date(selecionada.data_hora_evento).toLocaleString('pt-BR')}
            </p>
          )}

          {selecionada.suspeitos_relacionados && selecionada.suspeitos_relacionados.length > 0 && (
            <>
              <h3 className="title-md" style={{ fontSize: '1rem' }}>Suspeitos relacionados</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selecionada.suspeitos_relacionados.map((s) => (
                  <div key={s.id_suspeito} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{s.nome}</span>
                    <Badge tipo={s.tipo_relacao} />
                  </div>
                ))}
              </div>
            </>
          )}
        </Modal>
      )}

      <QueryInspector
        sql={
          selecionada
            ? `SELECT s.nome, res.tipo_relacao\nFROM relacao_evidencia_suspeito res\nJOIN suspeitos s ON s.id_suspeito = res.id_suspeito\nWHERE res.id_evidencia = ${selecionada.id_evidencia};`
            : `SELECT * FROM evidencias\nWHERE 1=1${filtroTipo ? `\n  AND tipo = '${filtroTipo}'` : ''}${filtroNivel ? `\n  AND nivel_importancia = '${filtroNivel}'` : ''}\nORDER BY data_hora_evento;`
        }
      />
    </div>
  );
}
