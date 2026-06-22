// COMO: Obtiene el evento por id usando useEventById que aprovecha la caché de TanStack Query
// PARA: Mostrar la información completa del evento con manejo de estados de red
// IMPACTO: Si el evento ya está en caché de la lista, la pantalla carga instantáneamente

import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { HomeStackParamList } from '../types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import { useEventById } from '../hooks/useEvents';

type Props = NativeStackScreenProps<HomeStackParamList, 'EventDetail'>;

const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: 'Boda', corporate: 'Corporativo', birthday: 'Cumpleaños', social: 'Social',
};
const EVENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmado', completed: 'Completado', cancelled: 'Cancelado',
};

function InfoRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }): React.JSX.Element {
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

  // COMO: useEventById consulta la caché primero; si no está, hace GET /events/:id
  // PARA: Evitar fetch redundante cuando el evento ya fue cargado por la lista
  // IMPACTO: Detalle disponible offline si la lista fue cargada anteriormente
  const { data: event, isLoading, isError, error, refetch } = useEventById(id);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (isError || !event) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>{error?.message ?? 'Evento no encontrado'}</Text>
        <Pressable style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.badges}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{EVENT_TYPE_LABELS[event.type] ?? event.type}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: (event.status === 'confirmed' ? COLORS.success : COLORS.warning) + '22' }]}>
          <Text style={[styles.statusBadgeText, { color: event.status === 'confirmed' ? COLORS.success : COLORS.warning }]}>
            {EVENT_STATUS_LABELS[event.status] ?? event.status}
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
          <Text style={styles.totalValue}>${(event.guestCount * event.pricePerPerson).toLocaleString('es-CO')} COP</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, gap: SPACING.md },
  centered: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', gap: SPACING.md, padding: SPACING.xl },
  errorText: { ...TYPOGRAPHY.subheading, color: COLORS.error, textAlign: 'center' },
  retryBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  retryText: { color: COLORS.background, fontWeight: '700' },
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
});
