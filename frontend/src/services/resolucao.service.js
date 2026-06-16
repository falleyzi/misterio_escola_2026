// src/services/resolucao.service.js
import api from './api';

export async function enviarResolucao(payload) {
  const { data } = await api.post('/resolver', payload);
  return data;
}
