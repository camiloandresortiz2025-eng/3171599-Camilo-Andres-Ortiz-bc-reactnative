// COMO: Instancia Axios reutilizada de semana 5; mismo baseURL y configuración
// PARA: Centralizar la configuración HTTP para los hooks de CRUD de eventos
// IMPACTO: Reemplazar la URL aquí afecta todos los hooks de la semana 6

import axios from 'axios';

const BASE_URL = 'https://[TU-ID].mockapi.io/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? 'Error de red';
    return Promise.reject(new Error(message));
  },
);
