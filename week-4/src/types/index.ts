// COMO: Reutiliza los tipos de dominio de semana 3 y añade los tipos de navegación actualizados
// PARA: Mantener consistencia del modelo de datos entre semanas del bootcamp
// IMPACTO: El store Zustand, las pantallas y la navegación comparten el mismo contrato de tipos

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

// COMO: Param list del Tab Navigator con badge dinámico en la tab de guardados
// PARA: Tipar la navegación entre tabs; el badge se alimenta del store en el Navigator
// IMPACTO: TypeScript garantiza que solo se navegue a tabs declaradas aquí
export type RootTabParamList = {
  HomeTab: undefined;
  SavedTab: undefined;
};

export type HomeStackParamList = {
  EventList: undefined;
  EventDetail: { id: string; name: string };
};
