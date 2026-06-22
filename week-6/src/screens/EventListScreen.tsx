// COMO: Lista los eventos del servidor con pull-to-refresh y todos los estados de red
// PARA: Ser el punto de entrada del usuario; muestra eventos y navega al detalle/edición
// IMPACTO: Igual que semana 5 pero ahora la pantalla de detalle tiene botón Editar

import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { HomeStackParamList, CateringEvent } from '../types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import { useEvents } from '../hooks/useEventsCrud';

type Props = NativeStackScreenProps<HomeStackParamList, 'EventList'>;

function EventCard({ event, onPress }: { event: CateringEvent; onPress: () => void }): React.JSX.Element {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>{event.name}</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
      </View>
      <View style={styles.cardRow}>
        <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} />
        <Text style={styles.cardMeta} numberOfLines={1}>{event.location}</Text>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.cardRow}>
          <Ionicons name="people-outline" size={13} color={COLORS.textSecondary} />
          <Text style={styles.cardMeta}>{event.guestCount} invitados</Text>
        </View>
        <Text style={styles.price}>${event.pricePerPerson.toLocaleString('es-CO')}/pax</Text>
      </View>
    </Pressable>
  );
}

export function EventListScreen({ navigation }: Props): React.JSX.Element {
  const { data: events, isLoading, isError, error, refetch, isFetching } = useEvents();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando eventos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Ionicons name="wifi-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorTitle}>Error de red</Text>
        <Text style={styles.errorMsg}>{error.message}</Text>
        <Pressable style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} tintColor={COLORS.primary} />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={48} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>Sin eventos registrados</Text>
          <Text style={styles.emptySubtext}>Usa el tab "Nuevo" para crear el primero</Text>
        </View>
      }
      renderItem={({ item }) => (
        <EventCard
          event={item}
          onPress={() => navigation.navigate('EventDetail', { id: item.id, name: item.name })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.md, gap: SPACING.md, flexGrow: 1 },
  centered: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', gap: SPACING.md, padding: SPACING.xl },
  loadingText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  errorTitle: { ...TYPOGRAPHY.subheading, color: COLORS.error },
  errorMsg: { ...TYPOGRAPHY.caption, textAlign: 'center' },
  retryBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  retryText: { color: COLORS.background, fontWeight: '700' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.sm, paddingTop: SPACING.xl * 2 },
  emptyText: { ...TYPOGRAPHY.subheading },
  emptySubtext: { ...TYPOGRAPHY.caption },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.xs },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { ...TYPOGRAPHY.subheading, flex: 1 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  cardMeta: { ...TYPOGRAPHY.caption, flex: 1 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.xs },
  price: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
});
