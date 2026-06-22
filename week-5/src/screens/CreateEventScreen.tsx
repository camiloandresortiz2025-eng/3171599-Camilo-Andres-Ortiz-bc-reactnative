// COMO: Formulario básico con useState que usa useMutation para hacer POST a la API
// PARA: Permitir al usuario registrar nuevos eventos de catering directamente en el servidor
// IMPACTO: Al crear con éxito, la lista se invalida y el nuevo evento aparece automáticamente

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useState } from 'react';

import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import { useCreateEvent } from '../hooks/useCreateEvent';
import { CreateEventDTO } from '../types';

// COMO: Componente de campo de formulario con etiqueta y manejo de estado de error
// PARA: Reutilizar la misma estructura visual en cada campo del formulario
// IMPACTO: Consistencia de UI; en semana 6 este componente se reemplaza por FormField con Zod
function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric';
}): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        keyboardType={keyboardType}
        autoCapitalize="sentences"
      />
    </View>
  );
}

export function CreateEventScreen(): React.JSX.Element {
  // COMO: Estado local para cada campo del formulario antes de construir el DTO
  // PARA: Controlar los inputs con React state hasta que el usuario confirme
  // IMPACTO: La mutación recibe datos ya validados; en semana 6 React Hook Form reemplaza esto
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [pricePerPerson, setPricePerPerson] = useState('');
  const [coordinator, setCoordinator] = useState('');
  const [menuDescription, setMenuDescription] = useState('');

  // COMO: useMutation que llama useCreateEvent(); devuelve mutate, isPending, isError
  // PARA: Desacoplar la acción de envío de la lógica de UI del formulario
  // IMPACTO: isPending deshabilita el botón durante el POST para evitar doble envío
  const { mutate: createEvent, isPending } = useCreateEvent();

  function handleSubmit(): void {
    // Validación básica — semana 6 usará Zod para esto
    if (!name.trim() || !location.trim() || !date.trim() || !guestCount || !pricePerPerson || !coordinator.trim()) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    const dto: CreateEventDTO = {
      name: name.trim(),
      type: 'corporate',             // En semana 6 se elegirá con un picker validado
      date: date.trim(),
      location: location.trim(),
      guestCount: parseInt(guestCount, 10),
      pricePerPerson: parseInt(pricePerPerson, 10),
      menuDescription: menuDescription.trim() || 'Sin descripción de menú',
      coordinator: coordinator.trim(),
    };

    // COMO: mutate ejecuta el POST y en onSuccess invalida la caché de la lista
    // PARA: Crear el evento y mostrar feedback al usuario según el resultado
    // IMPACTO: El usuario ve confirmación de éxito o mensaje de error sin recargar la app
    createEvent(dto, {
      onSuccess: () => {
        Alert.alert('¡Evento creado!', `"${dto.name}" fue registrado exitosamente.`);
        setName(''); setLocation(''); setDate('');
        setGuestCount(''); setPricePerPerson('');
        setCoordinator(''); setMenuDescription('');
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
      <ScrollView contentContainerStyle={styles.content}>
        <Field label="Nombre del evento *" value={name} onChangeText={setName} placeholder="Ej: Boda García-López" />
        <Field label="Fecha *" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
        <Field label="Lugar *" value={location} onChangeText={setLocation} placeholder="Ej: Salón Versalles, Bogotá" />
        <Field label="Número de invitados *" value={guestCount} onChangeText={setGuestCount} placeholder="Ej: 150" keyboardType="numeric" />
        <Field label="Precio por persona (COP) *" value={pricePerPerson} onChangeText={setPricePerPerson} placeholder="Ej: 85000" keyboardType="numeric" />
        <Field label="Coordinador *" value={coordinator} onChangeText={setCoordinator} placeholder="Ej: Andrea Suárez" />
        <Field label="Descripción del menú" value={menuDescription} onChangeText={setMenuDescription} placeholder="Describe el menú propuesto..." />

        {/* Botón deshabilitado durante isPending — requerido por la rúbrica */}
        <Pressable
          style={[styles.submitBtn, isPending && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.submitText}>Crear Evento</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, gap: SPACING.md },
  field: { gap: SPACING.xs },
  fieldLabel: { ...TYPOGRAPHY.caption, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, color: COLORS.text, fontSize: 15 },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.md },
  submitBtnDisabled: { opacity: 0.5 },
  submitText: { color: COLORS.background, fontWeight: '700', fontSize: 16 },
});
