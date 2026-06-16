// src/components/Badge.jsx

const ROTULOS = {
  baixa: 'Baixa', media: 'Média', alta: 'Alta', decisiva: 'Decisiva',
  incrimina: 'Incrimina', exclui: 'Exclui', neutra: 'Neutra',
  reforca_alibi: 'Reforça álibi', refuta_alibi: 'Refuta álibi'
};

export default function Badge({ tipo }) {
  if (!tipo) return null;
  return <span className={`badge badge--${tipo}`}>{ROTULOS[tipo] || tipo}</span>;
}
