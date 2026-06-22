// COMO: Lista de eventos con indicador visual de si cada evento ya está guardado en el store
// PARA: Permitir al usuario identificar de un vistazo qué eventos ya guardó
// IMPACTO: Reduce toques innecesarios; el usuario no entra al detalle solo para saber si lo guardó

import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { HomeStackParamList, CateringEvent } from '../types';
import { MOCK_EVENTS, EVENT_TYPE_LABELS, EVENT_STATUS_LABELS } from '../data/mockData';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import { useIsEventSaved } from '../store/useCateringStore';

type Props = NativeStackScreenProps<HomeStackParamList, 'EventList'>;

// COMO: Tarjeta individual; lee del store si el evento está guardado para mostrar ícono de corazón
// PARA: Dar feedback visual inmediato sin necesitar abrir el detalle
// IMPACTO: El ícono se sincroniza automáticamente al agregar/quitar desde la pantalla de detalle
function EventCard({
  event,
  onPress,
}: {
  event: CateringEvent;
  onPress: () => void;
}): React.JSX.Element {
  // COMO: Selector que verifica si este evento específico está en el store
  // PARA: No pasar isSaved como prop — cada tarjeta se suscribe directamente
  // IMPACTO: Solo la tarjeta afectada se re-renderiza al cambiar el estado de guardado
  const isSaved = useIsEventSaved(event.id);

  const statusColor =
    event.status === 'confirmed' ? COLORS.success
    : event.status === 'pending' ? COLORS.warning
    : COLORS.textSecondary;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>{event.name}</Text>
        <View style={styles.headerRight}>
          {isSaved && (
            <Ionicons name="heart" size={16} color={COLORS.accent} />
          )}
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {EVENT_STATUS_LABELS[event.status]}
            </Text>
          </View>
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
        <Text style={styles.header}>{MOCK_EVENTS.length} eventos disponibles</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.md, gap: SPACING.md },
  header: { ...TYPOGRAPHY.caption, marginBottom: SPACING.sm, textTransform: 'uppercase', letterSpacing: 1 },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.xs },
  cardPressed: { opacity: 0.75 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  cardTitle: { ...TYPOGRAPHY.subheading, flex: 1, marginRight: SPACING.sm },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  statusBadge: { borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  statusText: { fontSize: 11, fontWeight: '600' },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  cardMeta: { ...TYPOGRAPHY.caption, flex: 1 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.xs },
  price: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
});
