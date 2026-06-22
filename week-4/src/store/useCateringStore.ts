// COMO: Define el store Zustand con estado tipado, acciones y persistencia con AsyncStorage
// PARA: Centralizar el estado de eventos guardados sin prop drilling entre pantallas
// IMPACTO: Cualquier pantalla puede leer o modificar los guardados con un selector específico

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CateringEvent } from '../types';

// ─── Interfaz del store ────────────────────────────────────────────────────

// COMO: Define el contrato del store: qué estado existe y qué acciones lo modifican
// PARA: Tipar create<CateringStore>() sin usar any en ningún punto del store
// IMPACTO: TypeScript infiere correctamente los tipos al usar selectores en los componentes
interface CateringStore {
  savedEvents: CateringEvent[];
  addEvent: (event: CateringEvent) => void;
  removeEvent: (id: string) => void;
  clearAll: () => void;
}

// ─── Store con persistencia ────────────────────────────────────────────────

// COMO: Usa persist middleware de Zustand con AsyncStorage como storage backend
// PARA: Mantener los eventos guardados entre reinicios de la app sin base de datos
// IMPACTO: El usuario cierra la app y sus favoritos siguen disponibles en la próxima apertura
export const useCateringStore = create<CateringStore>()(
  persist(
    (set, get) => ({
      savedEvents: [],

      // COMO: Agrega un evento solo si no está ya en la lista (evita duplicados)
      // PARA: Prevenir que el usuario guarde el mismo evento dos veces por error
      // IMPACTO: El botón "Guardar" en el detalle no crea entradas duplicadas
      addEvent: (event: CateringEvent) => {
        const alreadySaved = get().savedEvents.some((e) => e.id === event.id);
        if (!alreadySaved) {
          set((state) => ({ savedEvents: [...state.savedEvents, event] }));
        }
      },

      // COMO: Filtra el arreglo eliminando el evento con el id indicado
      // PARA: Permitir al usuario quitar un evento de sus guardados desde detalle o lista
      // IMPACTO: El badge del tab y la pantalla Guardados se actualizan de inmediato
      removeEvent: (id: string) => {
        set((state) => ({
          savedEvents: state.savedEvents.filter((e) => e.id !== id),
        }));
      },

      // COMO: Reemplaza savedEvents con un arreglo vacío en una sola operación
      // PARA: Ofrecer al usuario una forma de limpiar todos sus guardados de una vez
      // IMPACTO: La pantalla Guardados y el badge vuelven a cero inmediatamente
      clearAll: () => set({ savedEvents: [] }),
    }),
    {
      name: 'catering-storage',
      // COMO: Excluye campos volátiles o no serializables del almacenamiento
      // PARA: Solo persistir el arreglo de eventos, no las funciones del store
      // IMPACTO: AsyncStorage guarda un JSON limpio sin referencias a funciones
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ savedEvents: state.savedEvents }),
    },
  ),
);

// ─── Selectores específicos ────────────────────────────────────────────────

// COMO: Selectores memorables que evitan el antipatrón useStore() sin selector
// PARA: Que cada componente se suscriba solo al slice de estado que necesita
// IMPACTO: Reduce re-renders innecesarios; componentes no se re-renderizan si cambia otro estado

export const useSavedEvents = () =>
  useCateringStore((state) => state.savedEvents);

export const useSavedCount = () =>
  useCateringStore((state) => state.savedEvents.length);

export const useIsEventSaved = (id: string) =>
  useCateringStore((state) => state.savedEvents.some((e) => e.id === id));

export const useAddEvent = () =>
  useCateringStore((state) => state.addEvent);

export const useRemoveEvent = () =>
  useCateringStore((state) => state.removeEvent);

export const useClearAll = () =>
  useCateringStore((state) => state.clearAll);
