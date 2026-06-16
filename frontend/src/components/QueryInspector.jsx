// src/components/QueryInspector.jsx
import { useState } from 'react';

/**
 * Painel didático: mostra a query SQL simplificada correspondente
 * à ação atual do investigador. Não executa nada — é apenas exibição,
 * pensado para a demonstração na feira (Query Inspector citado no briefing).
 */
export default function QueryInspector({ sql }) {
  const [aberto, setAberto] = useState(false);

  if (!sql) return null;

  return (
    <div className="query-inspector">
      <button className="query-inspector__toggle" onClick={() => setAberto((v) => !v)}>
        <span>QUERY INSPECTOR {aberto ? '▾' : '▸'}</span>
        <span>{aberto ? 'ocultar' : 'ver SQL desta consulta'}</span>
      </button>
      {aberto ? <pre className="query-inspector__body">{sql}</pre> : null}
    </div>
  );
}
