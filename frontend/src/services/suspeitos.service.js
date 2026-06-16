// src/services/suspeitos.service.js
import api from './api';

export async function listarSuspeitos() {
  const { data } = await api.get('/suspeitos');
  return data;
}

export async function buscarSuspeito(id) {
  const { data } = await api.get(`/suspeitos/${id}`);
  return data;
}

export async function buscarEvidenciasDoSuspeito(id) {
  const { data } = await api.get(`/suspeitos/${id}/evidencias`);
  return data;
}
