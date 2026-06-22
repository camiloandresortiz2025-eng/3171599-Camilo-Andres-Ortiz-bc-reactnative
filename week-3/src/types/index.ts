// COMO: Define las interfaces del dominio catering y los tipos de parámetros de navegación
// PARA: Garantizar type-safety en toda la app; TypeScript detecta errores en tiempo de compilación
// IMPACTO: Elimina errores de runtime por datos mal tipados y mejora el autocompletado en el IDE

// ─── Dominio Catering ───────────────────────────────────────────────────────

export type EventType = 'wedding' | 'corporate' | 'birthday' | 'social';
export type EventStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface CateringEvent {
  id: string;
  name: string;
  type: EventType;
  date: string;
  location: string;
  guestCount: number;
  status: EventStatus;
  pricePerPerson: number;
  menuDescription: string;
  coordinator: string;
}

// ─── Navegación ─────────────────────────────────────────────────────────────

// COMO: Define los stacks disponibles en el Tab Navigator raíz
// PARA: Tipar la navegación entre tabs para evitar errores de ruta
// IMPACTO: TypeScript alerta si se intenta navegar a un tab que no existe
export type RootTabParamList = {
  HomeTab: undefined;
  FavoritesTab: undefined;
};

// COMO: Define las rutas del Stack Navigator anidado en HomeTab
// PARA: Tipar correctamente los parámetros que se pasan entre pantallas del stack
// IMPACTO: El detalle recibe id y name tipados; evita acceso a props indefinidas
export type HomeStackParamList = {
  EventList: undefined;
  EventDetail: { id: string; name: string };
};
