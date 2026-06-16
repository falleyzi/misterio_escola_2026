// src/services/logs.service.js
import api from './api';

export async function listarLogsPredio() {
  const { data } = await api.get('/logs/predio');
  return data;
}

export async function listarLogsServidor() {
  const { data } = await api.get('/logs/servidor');
  return data;
}
