// COMO: Tipos del dominio catering para la capa de networking; incluye el DTO de creación
// PARA: Garantizar que los datos de la API se mapeen a interfaces conocidas por TypeScript
// IMPACTO: useQuery infiere el tipo de retorno; el IDE autocompleta los campos del evento

export type EventType = 'wedding' | 'corporate' | 'birthday' | 'social';
export type EventStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// COMO: Interfaz principal que modela la respuesta de la API para un evento de catering
// PARA: Tipar los datos que llegan de la API y los que se muestran en pantalla
// IMPACTO: Si la API cambia un campo, TypeScript detecta el error en todos los usos
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

// COMO: DTO para crear un nuevo evento; omite id (lo genera el servidor) y status (default pending)
// PARA: Tipar el body del POST request en useMutation sin campos innecesarios
// IMPACTO: Previene enviar id o status al servidor cuando solo los campos requeridos son válidos
export type CreateEventDTO = Omit<CateringEvent, 'id' | 'status'>;

// Navegación
export type RootTabParamList = {
  HomeTab: undefined;
  CreateTab: undefined;
};

export type HomeStackParamList = {
  EventList: undefined;
  EventDetail: { id: string; name: string };
};
