// COMO: Recibe id y name por parámetros de ruta; busca el evento en mock y lo muestra completo
// PARA: Presentar información detallada de un evento: menú, coordinador, fecha, presupuesto
// IMPACTO: Permite al usuario evaluar un evento antes de guardarlo en favoritos (semana 4)

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { HomeStackParamList } from '../types';
import { MOCK_EVENTS, EVENT_TYPE_LABELS, EVENT_STATUS_LABELS } from '../data/mockData';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'EventDetail'>;

// COMO: Componente auxiliar para filas de información etiqueta-valor con ícono
// PARA: Reutilizar la misma estructura visual en cada dato del evento
// IMPACTO: Consistencia visual y código DRY en la pantalla de detalle
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
  // COMO: Extrae el id de los parámetros de ruta para buscar el evento en el mock
  // PARA: Obtener todos los datos del evento, no solo los pasados como parámetro
  // IMPACTO: La pantalla es autosuficiente; podría conectarse a una API en semanas futuras
  const { id } = route.params;
  const event = MOCK_EVENTS.find((e) => e.id === id);

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>Evento no encontrado</Text>
      </View>
    );
  }

  const totalBudget = event.guestCount * event.pricePerPerson;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Badge de tipo y estado */}
      <View style={styles.badges}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{EVENT_TYPE_LABELS[event.type]}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                event.status === 'confirmed' ? COLORS.success + '22' : COLORS.warning + '22',
            },
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              {
                color:
                  event.status === 'confirmed' ? COLORS.success : COLORS.warning,
              },
            ]}
          >
            {EVENT_STATUS_LABELS[event.status]}
          </Text>
        </View>
      </View>

      {/* Información principal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Evento</Text>
        <InfoRow icon="calendar-outline" label="Fecha" value={event.date} />
        <InfoRow icon="location-outline" label="Lugar" value={event.location} />
        <InfoRow icon="people-outline" label="Invitados" value={`${event.guestCount} personas`} />
        <InfoRow icon="person-outline" label="Coordinador" value={event.coordinator} />
      </View>

      {/* Menú y costos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Propuesta de Menú</Text>
        <Text style={styles.menuDescription}>{event.menuDescription}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Presupuesto</Text>
        <InfoRow
          icon="cash-outline"
          label="Precio por persona"
          value={`$${event.pricePerPerson.toLocaleString('es-CO')} COP`}
        />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Presupuesto total estimado</Text>
          <Text style={styles.totalValue}>
            ${totalBudget.toLocaleString('es-CO')} COP
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    gap: SPACING.md,
  },
  errorText: {
    ...TYPOGRAPHY.subheading,
    color: COLORS.error,
  },
  badges: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  typeBadge: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  typeBadgeText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  statusBadge: {
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  statusBadgeText: {
    fontWeight: '600',
    fontSize: 13,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subheading,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  infoText: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    ...TYPOGRAPHY.caption,
  },
  infoValue: {
    ...TYPOGRAPHY.body,
  },
  menuDescription: {
    ...TYPOGRAPHY.body,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginTop: SPACING.xs,
  },
  totalLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
