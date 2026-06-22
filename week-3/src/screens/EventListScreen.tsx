// COMO: Renderiza un FlatList con todos los eventos de catering del mock; al tocar navega al detalle
// PARA: Ser el punto de entrada del usuario para explorar la oferta de eventos disponibles
// IMPACTO: Primera pantalla que el usuario ve; define la experiencia de descubrimiento del catálogo

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { HomeStackParamList, CateringEvent } from '../types';
import { MOCK_EVENTS, EVENT_TYPE_LABELS, EVENT_STATUS_LABELS } from '../data/mockData';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

// COMO: Tipo de props inferido del Stack Navigator para esta pantalla específica
// PARA: Tipar correctamente navigation y route sin usar any
// IMPACTO: TypeScript valida que navigate() reciba los parámetros correctos
type Props = NativeStackScreenProps<HomeStackParamList, 'EventList'>;

// COMO: Componente de tarjeta individual de evento; separado para evitar re-renders del FlatList
// PARA: Encapsular la UI de cada ítem y mantener EventListScreen limpio
// IMPACTO: Mejor rendimiento: solo la tarjeta modificada se vuelve a renderizar
function EventCard({
  event,
  onPress,
}: {
  event: CateringEvent;
  onPress: () => void;
}): React.JSX.Element {
  const statusColor =
    event.status === 'confirmed' ? COLORS.success
    : event.status === 'pending' ? COLORS.warning
    : COLORS.textSecondary;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de ${event.name}`}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {event.name}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {EVENT_STATUS_LABELS[event.status]}
          </Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Ionicons name="restaurant-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.cardMeta}>{EVENT_TYPE_LABELS[event.type]}</Text>
      </View>

      <View style={styles.cardRow}>
        <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.cardMeta} numberOfLines={1}>{event.location}</Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.cardRow}>
          <Ionicons name="people-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.cardMeta}>{event.guestCount} invitados</Text>
        </View>
        <Text style={styles.price}>
          ${event.pricePerPerson.toLocaleString('es-CO')}/pax
        </Text>
      </View>
    </Pressable>
  );
}

export function EventListScreen({ navigation }: Props): React.JSX.Element {
  // COMO: Función que encapsula la llamada a navigate con los parámetros requeridos
  // PARA: Pasar id y name al stack de detalle cumpliendo HomeStackParamList
  // IMPACTO: El detalle recibe datos sin hacer un fetch adicional para el header
  function handlePress(event: CateringEvent): void {
    navigation.navigate('EventDetail', { id: event.id, name: event.name });
  }

  return (
    <FlatList
      data={MOCK_EVENTS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      style={styles.container}
      renderItem={({ item }) => (
        <EventCard event={item} onPress={() => handlePress(item)} />
      )}
      ListHeaderComponent={
        <Text style={styles.header}>
          {MOCK_EVENTS.length} eventos registrados
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  header: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  cardTitle: {
    ...TYPOGRAPHY.subheading,
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusBadge: {
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  cardMeta: {
    ...TYPOGRAPHY.caption,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
