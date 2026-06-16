// src/components/TabBar.jsx
import { NavLink } from 'react-router-dom';

const ITENS = [
  { to: '/dashboard', label: 'Painel' },
  { to: '/suspeitos', label: 'Suspeitos' },
  { to: '/evidencias', label: 'Evidências' },
  { to: '/depoimentos', label: 'Depoimentos' },
  { to: '/cameras', label: 'Câmeras' },
  { to: '/logs', label: 'Logs' },
  { to: '/resolver', label: 'Resolver' }
];

export default function TabBar() {
  return (
    <nav className="tab-bar">
      {ITENS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `tab-bar__item${isActive ? ' is-active' : ''}`}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
