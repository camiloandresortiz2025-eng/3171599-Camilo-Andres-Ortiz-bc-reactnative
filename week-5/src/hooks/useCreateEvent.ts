// COMO: Custom hook que encapsula useMutation para crear un nuevo evento vía POST
// PARA: Aislar la lógica de mutación y la invalidación de caché de los componentes de UI
// IMPACTO: Al crear un evento exitosamente, la lista se refresca automáticamente sin reload

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../services/api';
import { CateringEvent, CreateEventDTO } from '../types';

// COMO: Función pura que envía un POST /events con el DTO del nuevo evento
// PARA: Ser la mutationFn del hook; separada para testabilidad
// IMPACTO: El servidor genera el id; el response contiene el evento completo con id asignado
async function createEvent(dto: CreateEventDTO): Promise<CateringEvent> {
  const response = await api.post<CateringEvent>('/events', dto);
  return response.data;
}

// COMO: useMutation con callback onSuccess que invalida la query de la lista
// PARA: Forzar refetch de ['catering', 'events'] después de crear un nuevo evento
// IMPACTO: La lista muestra el nuevo evento sin que el usuario tenga que hacer pull-to-refresh
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation<CateringEvent, Error, CreateEventDTO>({
    mutationFn: createEvent,

    // COMO: invalidateQueries marca la caché como stale y dispara refetch inmediato
    // PARA: Sincronizar la lista con el estado real del servidor después del POST
    // IMPACTO: El nuevo evento aparece en la lista en cuanto el servidor confirma la creación
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catering', 'events'] });
    },
  });
}
