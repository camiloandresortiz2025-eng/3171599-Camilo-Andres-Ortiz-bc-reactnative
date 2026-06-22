// COMO: Exporta un arreglo estático de eventos de catering con datos representativos
// PARA: Simular una fuente de datos sin necesidad de backend durante el desarrollo
// IMPACTO: Permite desarrollar y probar las pantallas con datos reales del dominio

import { CateringEvent } from '../types';

export const MOCK_EVENTS: CateringEvent[] = [
  {
    id: '1',
    name: 'Boda García-López',
    type: 'wedding',
    date: '2025-08-15',
    location: 'Salón Versalles, Bogotá',
    guestCount: 180,
    status: 'confirmed',
    pricePerPerson: 85000,
    menuDescription: 'Menú premium: entrada fría, sopa, proteína a elección, postre y barra libre',
    coordinator: 'Andrea Suárez',
  },
  {
    id: '2',
    name: 'Lanzamiento Producto TechCorp',
    type: 'corporate',
    date: '2025-07-22',
    location: 'Hotel Sheraton, Medellín',
    guestCount: 90,
    status: 'confirmed',
    pricePerPerson: 65000,
    menuDescription: 'Cóctel ejecutivo: finger foods, estaciones temáticas y barra de café',
    coordinator: 'Carlos Mendez',
  },
  {
    id: '3',
    name: 'Cumpleaños 50 Señora Ramos',
    type: 'birthday',
    date: '2025-09-05',
    location: 'Quinta La Esperanza, Cali',
    guestCount: 60,
    status: 'pending',
    pricePerPerson: 55000,
    menuDescription: 'Almuerzo familiar: bandeja paisa, postres tradicionales y canelazo',
    coordinator: 'Laura Ríos',
  },
  {
    id: '4',
    name: 'Gala Fundación Esperanza',
    type: 'social',
    date: '2025-10-18',
    location: 'Club El Nogal, Bogotá',
    guestCount: 250,
    status: 'pending',
    pricePerPerson: 110000,
    menuDescription: 'Cena de gala: menú de 5 tiempos, maridaje de vinos y música en vivo',
    coordinator: 'Andrés Vargas',
  },
  {
    id: '5',
    name: 'Convención Nacional Vendedores',
    type: 'corporate',
    date: '2025-07-30',
    location: 'Centro de Convenciones, Cartagena',
    guestCount: 320,
    status: 'confirmed',
    pricePerPerson: 72000,
    menuDescription: 'Almuerzos de trabajo + coffee break mañana y tarde',
    coordinator: 'Maria Fernanda Díaz',
  },
  {
    id: '6',
    name: 'Boda Hernández-Martínez',
    type: 'wedding',
    date: '2025-11-08',
    location: 'Hacienda El Paraíso, Armenia',
    guestCount: 150,
    status: 'pending',
    pricePerPerson: 95000,
    menuDescription: 'Banquete campestre: asado, arepas, lechona, postres artesanales',
    coordinator: 'Andrea Suárez',
  },
];

// COMO: Mapeo de tipo de evento a etiqueta legible en español
// PARA: Mostrar texto amigable al usuario en lugar de valores internos del enum
// IMPACTO: Mejora la experiencia del usuario con etiquetas naturales del dominio
export const EVENT_TYPE_LABELS: Record<CateringEvent['type'], string> = {
  wedding: 'Boda',
  corporate: 'Corporativo',
  birthday: 'Cumpleaños',
  social: 'Social',
};

export const EVENT_STATUS_LABELS: Record<CateringEvent['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  completed: 'Completado',
  cancelled: 'Cancelado',
};
