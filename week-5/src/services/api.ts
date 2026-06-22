// COMO: Crea una instancia de Axios con baseURL, headers y timeout centralizados
// PARA: Evitar repetir la URL base y la configuración en cada llamada de la app
// IMPACTO: Cambiar el servidor de API requiere editar solo este archivo

import axios from 'axios';

// COMO: URL base de MockAPI — reemplaza [TU-ID] con el ID de tu proyecto en mockapi.io
// PARA: Apuntar todas las solicitudes al endpoint correcto del dominio catering
// IMPACTO: Todas las solicitudes de la app usan esta URL como prefijo automáticamente
//
// Instrucciones para configurar MockAPI:
// 1. Crea una cuenta en https://mockapi.io
// 2. Crea un nuevo proyecto
// 3. Agrega un recurso llamado "events" con los campos de CateringEvent
// 4. Reemplaza la URL abajo con la de tu proyecto
const BASE_URL = 'https://[TU-ID].mockapi.io/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// COMO: Interceptor de request que puede agregar tokens de autenticación en el futuro
// PARA: Centralizar la lógica de autenticación sin modificar cada hook de datos
// IMPACTO: Agregar auth bearer en un solo lugar protege todos los endpoints
api.interceptors.request.use(
  (config) => {
    // Aquí se agregaría: config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// COMO: Interceptor de response que normaliza errores del servidor
// PARA: Capturar errores HTTP y convertirlos en mensajes legibles para el usuario
// IMPACTO: Los componentes reciben un error estándar en vez de la respuesta cruda de Axios
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? 'Error de red';
    return Promise.reject(new Error(message));
  },
);
