// src/pages/Dashboard.jsx
import { Link } from 'react-router-dom';

const MODULOS = [
  { to: '/suspeitos', titulo: 'Suspeitos', desc: '4 pessoas com motivo, acesso ou oportunidade.' },
  { to: '/evidencias', titulo: 'Evidências', desc: '14 registros cruzados: logs, câmeras, depoimentos.' },
  { to: '/depoimentos', titulo: 'Depoimentos', desc: 'Relatos colhidos de cada suspeito.' },
  { to: '/cameras', titulo: 'Câmeras', desc: '3 câmeras de segurança do prédio.' },
  { to: '/logs', titulo: 'Logs', desc: 'Acesso ao prédio e ao servidor COFRE.' },
  { to: '/ranking', titulo: 'Ranking', desc: 'Veja os investigadores mais rápidos e precisos.' }
];

export default function Dashboard() {
  return (
    <div className="page-container">
      <p className="eyebrow">Painel principal</p>
      <h1 className="title-lg">Onde você quer investigar?</h1>

      <div className="card-grid">
        {MODULOS.map((m) => (
          <Link key={m.to} to={m.to} className="card card--clickable">
            <h2 className="title-md">{m.titulo}</h2>
            <p className="text-muted" style={{ marginBottom: 0 }}>{m.desc}</p>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/resolver" className="btn btn--secondary btn--block">
          Estou pronto para resolver o caso
        </Link>
      </div>
    </div>
  );
}
