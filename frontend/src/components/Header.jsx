// src/components/Header.jsx
import { useEffect, useState } from 'react';

function formatarTempo(segundos) {
  const m = Math.floor(segundos / 60).toString().padStart(2, '0');
  const s = Math.floor(segundos % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function Header({ inicioInvestigacao }) {
  const [tempo, setTempo] = useState(0);

  useEffect(() => {
    if (!inicioInvestigacao) return;
    const interval = setInterval(() => {
      setTempo(Math.floor((Date.now() - inicioInvestigacao) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [inicioInvestigacao]);

  return (
    <header className="app-header">
      <div className="app-header__brand">
        C.I.D. <small>CASO #2026-014</small>
      </div>
      {inicioInvestigacao ? (
        <div className="app-header__timer">{formatarTempo(tempo)}</div>
      ) : null}
    </header>
  );
}
