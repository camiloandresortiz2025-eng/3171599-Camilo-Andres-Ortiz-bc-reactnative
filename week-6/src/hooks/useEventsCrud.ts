// COMO: Centraliza todos los hooks de TanStack Query para operaciones CRUD de eventos
// PARA: Que las pantallas importen de un solo lugar; no dispersar la lógica de API en screens
// IMPACTO: Cambiar la API o el esquema de caché requiere editar solo este archivo

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../services/api';
import { CateringEvent, EventFormValues } from '../types';
import { EventFormValues as FormValues } from '../schemas/eventSchema';

const QUERY_KEY = ['catering', 'events'] as const;

// ── GET lista ────────────────────────────────────────────────────────────────

export function useEvents() {
  return useQuery<CateringEvent[], Error>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get<CateringEvent[]>('/events');
      return data;
    },
  });
}

// ── GET por id ────────────────────────────────────────────────────────────────

export function useEventById(id: string) {
  return useQuery<CateringEvent, Error>({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await api.get<CateringEvent>(`/events/${id}`);
      return data;
    },
  });
}

// ── POST crear ────────────────────────────────────────────────────────────────

// COMO: useMutation para POST /events con invalidación automática al completar
// PARA: Crear un nuevo evento desde el formulario de creación validado con Zod
// IMPACTO: La lista se refresca sola; el usuario ve el nuevo evento sin pull-to-refresh
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation<CateringEvent, Error, Omit<FormValues, 'id'>>({
    mutationFn: async (dto) => {
      const payload = { ...dto, status: 'pending' as const };
      const { data } = await api.post<CateringEvent>('/events', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

// ── PUT editar ────────────────────────────────────────────────────────────────

// COMO: useMutation para PUT /events/:id con invalidación de la lista y del detalle
// PARA: Actualizar un evento existente desde el formulario de edición prellenado
// IMPACTO: Tanto la lista como el detalle del evento editado se refrescan automáticamente
export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient();

  return useMutation<CateringEvent, Error, Partial<FormValues>>({
    mutationFn: async (dto) => {
      const { data } = await api.put<CateringEvent>(`/events/${id}`, dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, id] });
    },
  });
}
