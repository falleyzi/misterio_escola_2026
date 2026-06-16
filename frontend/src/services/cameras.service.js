// src/services/cameras.service.js
import api from './api';

export async function listarCameras() {
  const { data } = await api.get('/cameras');
  return data;
}

export async function listarRegistrosDaCamera(id) {
  const { data } = await api.get(`/cameras/${id}/registros`);
  return data;
}
