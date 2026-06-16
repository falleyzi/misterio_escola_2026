// src/services/evidencias.service.js
import api from './api';

export async function listarEvidencias({ tipo, nivelImportancia } = {}) {
  const params = {};
  if (tipo) params.tipo = tipo;
  if (nivelImportancia) params.nivelImportancia = nivelImportancia;
  const { data } = await api.get('/evidencias', { params });
  return data;
}

export async function buscarEvidencia(id) {
  const { data } = await api.get(`/evidencias/${id}`);
  return data;
}
