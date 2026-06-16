// src/components/StateMessage.jsx

export function Carregando({ texto = 'Carregando registros...' }) {
  return <p className="state-message">{texto}</p>;
}

export function Erro({ texto = 'Não foi possível carregar os dados. Verifique se o backend está em execução.' }) {
  return <p className="state-message state-message--error">{texto}</p>;
}

export function Vazio({ texto = 'Nenhum registro encontrado.' }) {
  return <p className="state-message">{texto}</p>;
}
