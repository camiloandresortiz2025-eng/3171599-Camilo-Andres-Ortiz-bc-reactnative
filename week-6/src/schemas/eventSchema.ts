// COMO: Define el schema Zod del formulario de evento con reglas de validación del dominio catering
// PARA: Ser la única fuente de verdad para validación y tipos del formulario
// IMPACTO: zodResolver conecta este schema a React Hook Form; los tipos se infieren sin duplicar

import { z } from 'zod';

// COMO: Schema Zod con reglas de validación específicas del dominio catering
// PARA: Validar que los datos ingresados son coherentes con un evento de catering real
// IMPACTO: Los errores aparecen en tiempo real junto al campo que los genera
export const eventSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),

  type: z.enum(['wedding', 'corporate', 'birthday', 'social'], {
    errorMap: () => ({ message: 'Selecciona un tipo de evento válido' }),
  }),

  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'La fecha debe tener formato YYYY-MM-DD',
    ),

  location: z
    .string()
    .min(5, 'La ubicación debe tener al menos 5 caracteres')
    .max(150, 'La ubicación no puede superar 150 caracteres'),

  // COMO: z.coerce.number() convierte el string del TextInput a número antes de validar
  // PARA: TextInput siempre devuelve string; coerce evita validaciones manuales de parseo
  // IMPACTO: El usuario ingresa "150" y el schema entrega el número 150 directamente
  guestCount: z.coerce
    .number({ invalid_type_error: 'Ingresa un número válido' })
    .int('El número de invitados debe ser entero')
    .min(1, 'Debe haber al menos 1 invitado')
    .max(5000, 'Máximo 5000 invitados por evento'),

  pricePerPerson: z.coerce
    .number({ invalid_type_error: 'Ingresa un precio válido' })
    .int('El precio debe ser en pesos enteros')
    .min(10000, 'El precio mínimo es $10.000 COP')
    .max(1000000, 'El precio máximo es $1.000.000 COP'),

  coordinator: z
    .string()
    .min(3, 'El nombre del coordinador debe tener al menos 3 caracteres'),

  menuDescription: z
    .string()
    .min(10, 'La descripción del menú debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede superar 500 caracteres'),
});

// COMO: Tipo inferido del schema — equivale al tipo del formulario validado
// PARA: Usar este tipo en useForm<EventFormValues> sin escribir una interface duplicada
// IMPACTO: Si se agrega un campo al schema, el tipo se actualiza automáticamente
export type EventFormValues = z.infer<typeof eventSchema>;

// Schema de edición — igual pero todos los campos son opcionales para PATCH parcial
export const editEventSchema = eventSchema.partial();
export type EditEventFormValues = z.infer<typeof editEventSchema>;
