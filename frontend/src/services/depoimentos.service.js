// src/services/depoimentos.service.js
import api from './api';

export async function listarDepoimentos() {
  const { data } = await api.get('/depoimentos');
  return data;
}
