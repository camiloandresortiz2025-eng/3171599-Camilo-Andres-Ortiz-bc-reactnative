export type EventType = 'Boda' | 'Corporativo' | 'Quinceañera' | 'Cumpleaños' | 'Graduación' | 'Lanzamiento';
export type EventStatus = 'confirmado' | 'pendiente' | 'en progreso';

export interface CateringEvent {
  id: string;
  name: string;
  imageUri: string;
  eventType: EventType;
  date: string;
  guests: number;
  menu: string;
  venue: string;
  status: EventStatus;
  pricePerGuest: number;
}
