// src/pages/TelaInicial.jsx
import { useNavigate } from 'react-router-dom';

export default function TelaInicial() {
  const navigate = useNavigate();

  return (
    <div className="page-container page-container--narrow" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <p className="eyebrow">Central de Investigação Digital</p>
      <h1 className="title-lg">Mistério na Escola</h1>
      <p className="text-muted" style={{ marginBottom: '2.4rem' }}>
        Caso #2026-014 — O Arquivo Desaparecido
      </p>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <p style={{ marginTop: 0 }}>
          Na véspera da feira tecnológica, o arquivo <span className="text-mono">PROVA_FINAL_3ANO.bak</span>{' '}
          desapareceu do servidor da escola. Quatro pessoas tinham motivo, oportunidade ou acesso.
        </p>
        <p style={{ marginBottom: 0 }}>
          Você assume o papel de investigador digital. Cruze depoimentos, registros de câmeras e logs do
          servidor para descobrir a verdade — tudo armazenado em um banco de dados relacional real.
        </p>
      </div>

      <button className="btn btn--primary btn--block" onClick={() => navigate('/intro')}>
        Iniciar Investigação
      </button>
    </div>
  );
}
