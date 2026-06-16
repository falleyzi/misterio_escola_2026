// src/App.jsx
import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import TabBar from './components/TabBar';
import TelaInicial from './pages/TelaInicial';
import IntroducaoCaso from './pages/IntroducaoCaso';
import Dashboard from './pages/Dashboard';
import Suspeitos from './pages/Suspeitos';
import Evidencias from './pages/Evidencias';
import Depoimentos from './pages/Depoimentos';
import Cameras from './pages/Cameras';
import Logs from './pages/Logs';
import ResolverCaso from './pages/ResolverCaso';
import Resultado from './pages/Resultado';
import Ranking from './pages/Ranking';

const ROTAS_SEM_CHROME = ['/', '/intro'];

export default function App() {
  const location = useLocation();
  const [inicioInvestigacao, setInicioInvestigacao] = useState(null);
  const [resultado, setResultado] = useState(null);

  function aceitarCaso() {
    setInicioInvestigacao(Date.now());
  }

  const mostrarChrome = !ROTAS_SEM_CHROME.includes(location.pathname);

  return (
    <div className="app-shell">
      {mostrarChrome && <Header inicioInvestigacao={inicioInvestigacao} />}

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<TelaInicial />} />
          <Route path="/intro" element={<IntroducaoCaso onAceitarCaso={aceitarCaso} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/suspeitos" element={<Suspeitos />} />
          <Route path="/evidencias" element={<Evidencias />} />
          <Route path="/depoimentos" element={<Depoimentos />} />
          <Route path="/cameras" element={<Cameras />} />
          <Route path="/logs" element={<Logs />} />
          <Route
            path="/resolver"
            element={
              <ResolverCaso
                inicioInvestigacao={inicioInvestigacao}
                onResolverCaso={setResultado}
              />
            }
          />
          <Route path="/resultado" element={<Resultado resultado={resultado} />} />
          <Route path="/ranking" element={<Ranking />} />
        </Routes>
      </div>

      {mostrarChrome && <TabBar />}
    </div>
  );
}
