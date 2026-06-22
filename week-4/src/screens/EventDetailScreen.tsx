// COMO: Detalle del evento con botón condicional guardar/quitar que lee y escribe el store
// PARA: Ser el punto de acción principal donde el usuario decide guardar un evento de catering
// IMPACTO: El badge del tab y la lista de guardados se actualizan en tiempo real sin reload

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { HomeStackParamList } from '../types';
import { MOCK_EVENTS, EVENT_TYPE_LABELS, EVENT_STATUS_LABELS } from '../data/mockData';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import {
  useIsEventSaved,
  useAddEvent,
  useRemoveEvent,
} from '../store/useCateringStore';

type Props = NativeStackScreenProps<HomeStackParamList, 'EventDetail'>;

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={COLORS.primary} />
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export function EventDetailScreen({ route }: Props): React.JSX.Element {
  const { id } = route.params;
  const event = MOCK_EVENTS.find((e) => e.id === id);

  // COMO: Selectores específicos — cada hook lee solo el slice del store que necesita
  // PARA: Evitar re-renders innecesarios si cambia otro estado en el store
  // IMPACTO: La pantalla se actualiza solo cuando isSaved de ESTE evento cambia
  const isSaved = useIsEventSaved(id);
  const addEvent = useAddEvent();
  const removeEvent = useRemoveEvent();

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>Evento no encontrado</Text>
      </View>
    );
  }

  // COMO: Toggle que decide entre agregar o quitar según el estado actual del store
  // PARA: Un solo botón maneja las dos acciones con lógica condicional
  // IMPACTO: UX simple para el usuario; el ícono y texto cambian según el estado
  function handleToggleSave(): void {
    if (isSaved) {
      removeEvent(id);
    } else {
      addEvent(event!);
    }
  }

  const totalBudget = event.guestCount * event.pricePerPerson;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.badges}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{EVENT_TYPE_LABELS[event.type]}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: (event.status === 'confirmed' ? COLORS.success : COLORS.warning) + '22' }]}>
          <Text style={[styles.statusBadgeText, { color: event.status === 'confirmed' ? COLORS.success : COLORS.warning }]}>
            {EVENT_STATUS_LABELS[event.status]}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Evento</Text>
        <InfoRow icon="calendar-outline" label="Fecha" value={event.date} />
        <InfoRow icon="location-outline" label="Lugar" value={event.location} />
        <InfoRow icon="people-outline" label="Invitados" value={`${event.guestCount} personas`} />
        <InfoRow icon="person-outline" label="Coordinador" value={event.coordinator} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Propuesta de Menú</Text>
        <Text style={styles.menuDescription}>{event.menuDescription}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Presupuesto</Text>
        <InfoRow icon="cash-outline" label="Precio por persona" value={`$${event.pricePerPerson.toLocaleString('es-CO')} COP`} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total estimado</Text>
          <Text style={styles.totalValue}>${totalBudget.toLocaleString('es-CO')} COP</Text>
        </View>
      </View>

      {/* Botón guardar/quitar — conectado al store Zustand */}
      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          isSaved && styles.saveButtonActive,
          pressed && styles.saveButtonPressed,
        ]}
        onPress={handleToggleSave}
        accessibilityRole="button"
        accessibilityLabel={isSaved ? 'Quitar de guardados' : 'Guardar evento'}
      >
        <Ionicons
          name={isSaved ? 'heart' : 'heart-outline'}
          size={20}
          color={isSaved ? COLORS.accent : COLORS.text}
        />
        <Text style={[styles.saveButtonText, isSaved && styles.saveButtonTextActive]}>
          {isSaved ? 'Guardado — Toca para quitar' : 'Guardar evento'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, gap: SPACING.md },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background, gap: SPACING.md },
  errorText: { ...TYPOGRAPHY.subheading, color: COLORS.error },
  badges: { flexDirection: 'row', gap: SPACING.sm },
  typeBadge: { backgroundColor: COLORS.card, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
  typeBadgeText: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  statusBadge: { borderRadius: RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
  statusBadgeText: { fontWeight: '600', fontSize: 13 },
  section: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle: { ...TYPOGRAPHY.subheading, color: COLORS.primary, marginBottom: SPACING.xs },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  infoText: { flex: 1, gap: 2 },
  infoLabel: { ...TYPOGRAPHY.caption },
  infoValue: { ...TYPOGRAPHY.body },
  menuDescription: { ...TYPOGRAPHY.body, lineHeight: 22, color: COLORS.textSecondary },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADIUS.sm, padding: SPACING.md, marginTop: SPACING.xs },
  totalLabel: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  totalValue: { fontSize: 17, fontWeight: '700', color: COLORS.primary },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  saveButtonActive: { borderColor: COLORS.accent, backgroundColor: COLORS.accent + '11' },
  saveButtonPressed: { opacity: 0.75 },
  saveButtonText: { ...TYPOGRAPHY.subheading },
  saveButtonTextActive: { color: COLORS.accent },
});
