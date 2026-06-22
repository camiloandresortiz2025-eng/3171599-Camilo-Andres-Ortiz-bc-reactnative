// COMO: Custom hook que encapsula useQuery para obtener la lista de eventos desde la API
// PARA: Separar la lógica de fetching de la UI; las pantallas no llaman Axios directamente
// IMPACTO: Si cambia la fuente de datos (MockAPI → backend real), solo este archivo cambia

import { useQuery } from '@tanstack/react-query';

import { api } from '../services/api';
import { CateringEvent } from '../types';

// COMO: Función pura que hace el GET /events y retorna el arreglo tipado
// PARA: Ser la queryFn del hook; separada para facilitar pruebas unitarias
// IMPACTO: useQuery puede reintentar esta función automáticamente en caso de fallo de red
async function fetchEvents(): Promise<CateringEvent[]> {
  const response = await api.get<CateringEvent[]>('/events');
  return response.data;
}

// COMO: Hook que usa useQuery con queryKey semántico ['catering', 'events']
// PARA: Cachear, sincronizar y refrescar la lista de eventos automáticamente
// IMPACTO: La lista no hace fetch redundante si los datos están frescos (staleTime = 2min)
export function useEvents() {
  return useQuery<CateringEvent[], Error>({
    queryKey: ['catering', 'events'],
    queryFn: fetchEvents,
  });
}

// COMO: Hook que obtiene un único evento por id usando el cache como fuente primaria
// PARA: Mostrar el detalle sin un segundo GET si el evento ya está en la caché de la lista
// IMPACTO: Navegación instantánea al detalle cuando la lista ya fue cargada
export function useEventById(id: string) {
  return useQuery<CateringEvent, Error>({
    queryKey: ['catering', 'events', id],
    queryFn: async () => {
      const response = await api.get<CateringEvent>(`/events/${id}`);
      return response.data;
    },
  });
}
