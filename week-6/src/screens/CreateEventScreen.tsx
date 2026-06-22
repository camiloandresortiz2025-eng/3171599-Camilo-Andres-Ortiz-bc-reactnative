// COMO: Formulario de creación con React Hook Form + zodResolver; usa FormField reutilizable
// PARA: Registrar nuevos eventos con validación en tiempo real antes de enviar al servidor
// IMPACTO: El usuario recibe feedback inmediato por campo; el servidor recibe datos válidos

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import { FormField } from '../components/FormField';
import { eventSchema, EventFormValues } from '../schemas/eventSchema';
import { useCreateEvent } from '../hooks/useEventsCrud';

export function CreateEventScreen(): React.JSX.Element {
  // COMO: useForm con zodResolver conecta el schema Zod directamente a React Hook Form
  // PARA: Validar cada campo con las reglas Zod sin escribir lógica de validación manual
  // IMPACTO: Los errores se generan automáticamente en el idioma y reglas definidas en el schema
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      type: 'corporate',
      date: '',
      location: '',
      guestCount: undefined,
      pricePerPerson: undefined,
      coordinator: '',
      menuDescription: '',
    },
    mode: 'onSubmit',   // Valida al submit; en onBlur el error aparece al salir del campo
  });

  const { mutate: createEvent, isPending } = useCreateEvent();

  // COMO: handleSubmit de RHF solo ejecuta onValid si Zod valida correctamente todos los campos
  // PARA: Prevenir que datos inválidos lleguen al mutate o a la API
  // IMPACTO: El usuario solo puede enviar el formulario con datos que pasen todas las reglas Zod
  function onValid(data: EventFormValues): void {
    createEvent(data, {
      onSuccess: () => {
        Alert.alert('¡Evento creado!', `"${data.name}" fue registrado exitosamente.`);
        reset();
      },
      onError: (error) => {
        Alert.alert('Error al crear', error.message);
      },
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Datos del evento</Text>

        {/* FormField reutilizable — un componente para todos los campos */}
        <FormField
          control={control}
          name="name"
          label="Nombre del evento *"
          placeholder="Ej: Boda García-López"
        />
        <FormField
          control={control}
          name="date"
          label="Fecha del evento * (YYYY-MM-DD)"
          placeholder="Ej: 2025-08-15"
        />
        <FormField
          control={control}
          name="location"
          label="Lugar *"
          placeholder="Ej: Salón Versalles, Bogotá"
        />
        <FormField
          control={control}
          name="coordinator"
          label="Coordinador *"
          placeholder="Ej: Andrea Suárez"
        />

        <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>Capacidad y costos</Text>

        <FormField
          control={control}
          name="guestCount"
          label="Número de invitados *"
          placeholder="Ej: 150"
          keyboardType="numeric"
        />
        <FormField
          control={control}
          name="pricePerPerson"
          label="Precio por persona (COP) *"
          placeholder="Ej: 85000"
          keyboardType="numeric"
        />

        <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>Menú</Text>

        <FormField
          control={control}
          name="menuDescription"
          label="Descripción del menú *"
          placeholder="Describe la propuesta gastronómica del evento..."
          multiline
          numberOfLines={4}
        />

        {/* COMO: Botón deshabilitado con spinner mientras la mutación está en curso
            PARA: Impedir doble envío y dar feedback visual del estado de la operación
            IMPACTO: El usuario sabe que su solicitud está siendo procesada */}
        <Pressable
          style={[styles.submitBtn, isPending && styles.submitBtnDisabled]}
          onPress={handleSubmit(onValid)}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.submitText}>Crear Evento de Catering</Text>
          )}
        </Pressable>

        {/* Resumen de errores si hay múltiples campos inválidos al mismo tiempo */}
        {Object.keys(errors).length > 0 && (
          <View style={styles.errorSummary}>
            <Text style={styles.errorSummaryText}>
              Corrige {Object.keys(errors).length} campo{Object.keys(errors).length !== 1 ? 's' : ''} antes de continuar
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, gap: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.caption, textTransform: 'uppercase', letterSpacing: 1, color: COLORS.primary },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.md },
  submitBtnDisabled: { opacity: 0.5 },
  submitText: { color: COLORS.background, fontWeight: '700', fontSize: 16 },
  errorSummary: { backgroundColor: COLORS.errorBg, borderRadius: RADIUS.sm, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.error },
  errorSummaryText: { color: COLORS.error, fontWeight: '600', textAlign: 'center' },
});
