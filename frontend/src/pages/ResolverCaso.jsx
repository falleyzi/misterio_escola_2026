// src/pages/ResolverCaso.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarSuspeitos } from '../services/suspeitos.service';
import { listarEvidencias } from '../services/evidencias.service';
import { enviarResolucao } from '../services/resolucao.service';
import { Carregando, Erro } from '../components/StateMessage';

const MOTIVOS = [
  'Esconder um erro técnico próprio antes da avaliação dos professores.',
  'Adiar a prova para evitar uma reprovação anunciada por um simulado anterior.',
  'Ressentimento pessoal com a escola e com a turma atual.',
  'Nenhum motivo relacionado ao conteúdo acadêmico — apenas estava no local por acaso.'
];

const METODOS = [
  'Acesso físico direto ao terminal do servidor, sem autenticação remota.',
  'Sessão remota autenticada com uma conta de serviço compartilhada, originada da rede interna da escola.',
  'Invasão externa via VPN com credenciais já revogadas.',
  'Solicitação ao setor de TI para exclusão "acidental" do arquivo.'
];

export default function ResolverCaso({ inicioInvestigacao, onResolverCaso }) {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(0);
  const [suspeitos, setSuspeitos] = useState([]);
  const [evidencias, setEvidencias] = useState([]);
  const [status, setStatus] = useState('carregando');
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);

  const [suspeitoEscolhido, setSuspeitoEscolhido] = useState(null);
  const [motivoEscolhido, setMotivoEscolhido] = useState(null);
  const [metodoEscolhido, setMetodoEscolhido] = useState(null);
  const [evidenciaEscolhida, setEvidenciaEscolhida] = useState(null);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    Promise.all([listarSuspeitos(), listarEvidencias()])
      .then(([s, e]) => {
        setSuspeitos(s);
        setEvidencias(e);
        setStatus('ok');
      })
      .catch(() => setStatus('erro'));
  }, []);

  const etapas = ['Suspeito', 'Motivo', 'Método', 'Evidência decisiva'];
  const podeAvancar = [suspeitoEscolhido, motivoEscolhido, metodoEscolhido, evidenciaEscolhida][etapa] != null;

  async function confirmarResposta() {
    setEnviando(true);
    setErroEnvio(null);
    try {
      const tempoSegundos = inicioInvestigacao
        ? Math.floor((Date.now() - inicioInvestigacao) / 1000)
        : 0;

      const resultado = await enviarResolucao({
        idSuspeitoApontado: suspeitoEscolhido.id_suspeito,
        motivoEscolhido,
        metodoEscolhido,
        idEvidenciaDecisivaEscolhida: evidenciaEscolhida.id_evidencia,
        tempoSegundos
      });

      onResolverCaso({ ...resultado, tempoSegundos });
      navigate('/resultado');
    } catch (err) {
      setErroEnvio(err?.response?.data?.erro || 'Não foi possível enviar sua resposta. Tente novamente.');
    } finally {
      setEnviando(false);
      setConfirmando(false);
    }
  }

  if (status === 'carregando') return <div className="page-container"><Carregando /></div>;
  if (status === 'erro') return <div className="page-container"><Erro /></div>;

  return (
    <div className="page-container page-container--narrow">
      <p className="eyebrow">Resolução do caso</p>
      <h1 className="title-lg">{etapas[etapa]}</h1>

      <div className="stepper-dots">
        {etapas.map((_, i) => (
          <div key={i} className={`stepper-dots__dot${i <= etapa ? ' is-done' : ''}`} />
        ))}
      </div>

      {etapa === 0 && (
        <div className="option-list">
          {suspeitos.map((s) => (
            <button
              key={s.id_suspeito}
              className={`option-card${suspeitoEscolhido?.id_suspeito === s.id_suspeito ? ' is-selected' : ''}`}
              onClick={() => setSuspeitoEscolhido(s)}
            >
              <div>
                <strong>{s.nome}</strong>
                <p className="text-muted" style={{ margin: '0.2rem 0 0', fontSize: '0.85rem' }}>{s.cargo_funcao}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {etapa === 1 && (
        <div className="option-list">
          {MOTIVOS.map((m) => (
            <button
              key={m}
              className={`option-card${motivoEscolhido === m ? ' is-selected' : ''}`}
              onClick={() => setMotivoEscolhido(m)}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {etapa === 2 && (
        <div className="option-list">
          {METODOS.map((m) => (
            <button
              key={m}
              className={`option-card${metodoEscolhido === m ? ' is-selected' : ''}`}
              onClick={() => setMetodoEscolhido(m)}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {etapa === 3 && (
        <div className="option-list">
          {evidencias.map((e) => (
            <button
              key={e.id_evidencia}
              className={`option-card${evidenciaEscolhida?.id_evidencia === e.id_evidencia ? ' is-selected' : ''}`}
              onClick={() => setEvidenciaEscolhida(e)}
            >
              <div>
                <span className="text-mono" style={{ fontSize: '0.78rem' }}>{e.codigo}</span>
                <p style={{ margin: '0.2rem 0 0' }}>{e.titulo}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {erroEnvio && <p className="state-message state-message--error">{erroEnvio}</p>}

      <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.6rem' }}>
        {etapa > 0 && (
          <button className="btn btn--ghost" onClick={() => setEtapa((e) => e - 1)} disabled={enviando}>
            Voltar
          </button>
        )}
        {etapa < 3 && (
          <button className="btn btn--primary" style={{ flex: 1 }} disabled={!podeAvancar} onClick={() => setEtapa((e) => e + 1)}>
            Avançar
          </button>
        )}
        {etapa === 3 && (
          <button
            className="btn btn--primary"
            style={{ flex: 1 }}
            disabled={!podeAvancar || enviando}
            onClick={() => setConfirmando(true)}
          >
            Enviar resposta final
          </button>
        )}
      </div>

      {confirmando && (
        <div className="modal-overlay" onClick={() => !enviando && setConfirmando(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="title-md">Confirmar resposta final?</h2>
            <p className="text-muted">
              Após confirmar, sua resposta será registrada e não poderá ser alterada.
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.4rem' }}>
              <button className="btn btn--ghost" onClick={() => setConfirmando(false)} disabled={enviando}>
                Cancelar
              </button>
              <button className="btn btn--primary" style={{ flex: 1 }} onClick={confirmarResposta} disabled={enviando}>
                {enviando ? 'Enviando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
