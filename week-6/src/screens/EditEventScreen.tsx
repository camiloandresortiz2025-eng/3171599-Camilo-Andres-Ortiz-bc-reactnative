// COMO: Carga los datos actuales del evento y los pone como defaultValues en el formulario
// PARA: Permitir al usuario editar campos específicos sin re-ingresar todos los datos
// IMPACTO: La experiencia de edición es fluida; el usuario ve los datos actuales prellenados

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { HomeStackParamList } from '../types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import { FormField } from '../components/FormField';
import { eventSchema, EventFormValues } from '../schemas/eventSchema';
import { useEventById, useUpdateEvent } from '../hooks/useEventsCrud';

type Props = NativeStackScreenProps<HomeStackParamList, 'EditEvent'>;

export function EditEventScreen({ route, navigation }: Props): React.JSX.Element {
  const { id } = route.params;

  // COMO: Carga el evento actual para precargar el formulario con sus datos reales
  // PARA: Evitar que el usuario pierda datos existentes al entrar a la pantalla de edición
  // IMPACTO: El formulario muestra los valores actuales; el usuario solo cambia lo necesario
  const { data: event, isLoading } = useEventById(id);
  const { mutate: updateEvent, isPending } = useUpdateEvent(id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
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
  });

  // COMO: useEffect que llama reset() con los datos del evento cuando llegan de la API
  // PARA: Precargar el formulario con valores reales una vez que useEventById resuelve
  // IMPACTO: Los campos muestran los datos actuales del evento listos para editar
  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        type: event.type,
        date: event.date,
        location: event.location,
        guestCount: event.guestCount,
        pricePerPerson: event.pricePerPerson,
        coordinator: event.coordinator,
        menuDescription: event.menuDescription,
      });
    }
  }, [event, reset]);

  if (isLoading) {
    return (
      <KeyboardAvoidingView style={styles.centered} behavior="padding">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando datos del evento...</Text>
      </KeyboardAvoidingView>
    );
  }

  function onValid(data: EventFormValues): void {
    // COMO: Solo envía si el usuario modificó al menos un campo (isDirty de RHF)
    // PARA: Evitar PUT innecesario al servidor cuando no hay cambios reales
    // IMPACTO: Reduce solicitudes de red; el servidor no recibe peticiones vacías
    if (!isDirty) {
      Alert.alert('Sin cambios', 'No modificaste ningún campo del evento.');
      return;
    }

    updateEvent(data, {
      onSuccess: () => {
        Alert.alert('¡Evento actualizado!', `"${data.name}" fue modificado exitosamente.`);
        navigation.goBack();
      },
      onError: (error) => {
        Alert.alert('Error al actualizar', error.message);
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

        <FormField control={control} name="name" label="Nombre del evento *" placeholder="Ej: Boda García-López" />
        <FormField control={control} name="date" label="Fecha * (YYYY-MM-DD)" placeholder="Ej: 2025-08-15" />
        <FormField control={control} name="location" label="Lugar *" placeholder="Ej: Salón Versalles, Bogotá" />
        <FormField control={control} name="coordinator" label="Coordinador *" placeholder="Ej: Andrea Suárez" />

        <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>Capacidad y costos</Text>

        <FormField control={control} name="guestCount" label="Número de invitados *" placeholder="Ej: 150" keyboardType="numeric" />
        <FormField control={control} name="pricePerPerson" label="Precio por persona (COP) *" placeholder="Ej: 85000" keyboardType="numeric" />

        <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>Menú</Text>

        <FormField
          control={control}
          name="menuDescription"
          label="Descripción del menú *"
          placeholder="Describe la propuesta gastronómica..."
          multiline
          numberOfLines={4}
        />

        <Pressable
          style={[styles.submitBtn, (isPending || !isDirty) && styles.submitBtnDisabled]}
          onPress={handleSubmit(onValid)}
          disabled={isPending || !isDirty}
        >
          {isPending ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.submitText}>Guardar Cambios</Text>
          )}
        </Pressable>

        {/* COMO: Botón reset que vuelve los campos a los valores originales del evento
            PARA: Dar al usuario una salida rápida si quiere descartar sus cambios
            IMPACTO: No requiere navegar atrás; los campos se restauran en la misma pantalla */}
        {isDirty && (
          <Pressable
            style={styles.resetBtn}
            onPress={() => event && reset({
              name: event.name, type: event.type, date: event.date,
              location: event.location, guestCount: event.guestCount,
              pricePerPerson: event.pricePerPerson, coordinator: event.coordinator,
              menuDescription: event.menuDescription,
            })}
          >
            <Text style={styles.resetText}>Descartar cambios</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
  loadingText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  content: { padding: SPACING.md, gap: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.caption, textTransform: 'uppercase', letterSpacing: 1, color: COLORS.primary },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.md },
  submitBtnDisabled: { opacity: 0.5 },
  submitText: { color: COLORS.background, fontWeight: '700', fontSize: 16 },
  resetBtn: { alignItems: 'center', padding: SPACING.md },
  resetText: { color: COLORS.textSecondary, fontWeight: '500' },
});
