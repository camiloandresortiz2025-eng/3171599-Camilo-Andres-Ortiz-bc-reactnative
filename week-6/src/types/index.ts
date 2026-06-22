// COMO: Tipos de dominio para week-6; los tipos de formulario se infieren de los schemas Zod
// PARA: Evitar duplicar interfaces manualmente cuando Zod puede generarlas con z.infer
// IMPACTO: Una sola fuente de verdad; cambiar el schema Zod actualiza automáticamente los tipos

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

export type RootTabParamList = {
  HomeTab: undefined;
  CreateTab: undefined;
};

// COMO: El stack de Home incluye EventDetail y EditEvent para editar desde el detalle
// PARA: Navegar al formulario de edición pasando el id del evento como parámetro
// IMPACTO: TypeScript valida que EditEvent siempre reciba un id válido
export type HomeStackParamList = {
  EventList: undefined;
  EventDetail: { id: string; name: string };
  EditEvent: { id: string };
};
