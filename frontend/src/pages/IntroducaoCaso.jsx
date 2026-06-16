// src/pages/IntroducaoCaso.jsx
import { useNavigate } from 'react-router-dom';

export default function IntroducaoCaso({ onAceitarCaso }) {
  const navigate = useNavigate();

  function aceitar() {
    onAceitarCaso();
    navigate('/dashboard');
  }

  return (
    <div className="page-container page-container--narrow">
      <p className="eyebrow">Briefing do caso</p>
      <h1 className="title-lg">O que sabemos até agora</h1>

      <div className="card" style={{ marginBottom: '1.6rem' }}>
        <p style={{ marginTop: 0 }}>
          Por volta das 22h14 da noite anterior à feira, o arquivo com o gabarito da prova prática do
          3º ano foi excluído do servidor <span className="text-mono">COFRE</span>. Quatro pessoas
          tinham, simultaneamente, credenciais válidas, presença na escola naquela noite, ou um motivo
          plausível para o desaparecimento do arquivo.
        </p>
        <p style={{ marginBottom: 0 }}>
          Sua missão como investigador é responder quatro perguntas com base apenas nos registros do
          sistema:
        </p>
        <ul style={{ marginBottom: 0 }}>
          <li>Quem apagou o arquivo?</li>
          <li>Qual foi o motivo?</li>
          <li>Como o crime foi executado?</li>
          <li>Qual evidência prova a culpa de forma inquestionável?</li>
        </ul>
      </div>

      <button className="btn btn--primary btn--block" onClick={aceitar}>
        Aceitar Caso
      </button>
    </div>
  );
}
