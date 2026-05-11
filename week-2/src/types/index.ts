export type EventType =
  | 'Boda'
  | 'Corporativo'
  | 'Quinceañera'
  | 'Cumpleaños'
  | 'Graduación'
  | 'Lanzamiento'
  | 'Gala';

export type EventStatus = 'confirmado' | 'pendiente' | 'en progreso' | 'completado';

export interface CateringEvent {
  id: string;
  name: string;
  eventType: EventType;
  date: string;
  guests: number;
  venue: string;
  menu: string;
  status: EventStatus;
  pricePerGuest: number;
  coordinator: string;
}
