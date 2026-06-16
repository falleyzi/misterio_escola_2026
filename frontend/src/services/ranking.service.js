// src/services/ranking.service.js
import api from './api';

export async function listarRankingTop10() {
  const { data } = await api.get('/ranking');
  return data;
}

export async function registrarNoRanking(payload) {
  const { data } = await api.post('/ranking', payload);
  return data;
}
