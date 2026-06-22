// COMO: Consume useEvents() para mostrar datos reales de la API con todos los estados de red
// PARA: Ser la pantalla principal que lista los eventos de catering desde el servidor
// IMPACTO: El usuario ve un indicador de carga, mensajes de error y pull-to-refresh funcional

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { HomeStackParamList, CateringEvent } from '../types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import { useEvents } from '../hooks/useEvents';

type Props = NativeStackScreenProps<HomeStackParamList, 'EventList'>;

function EventCard({
  event,
  onPress,
}: {
  event: CateringEvent;
  onPress: () => void;
}): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>{event.name}</Text>
        <Text style={styles.cardType}>{event.type}</Text>
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
  // COMO: Desestructura los estados de useQuery para manejar todos los escenarios de red
  // PARA: Mostrar UI adecuada en carga, error, datos vacíos y datos disponibles
  // IMPACTO: La app nunca queda en pantalla en blanco; el usuario siempre sabe qué ocurre
  const { data: events, isLoading, isError, error, refetch, isFetching } = useEvents();

  // ── Estado: Cargando por primera vez ──────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando eventos...</Text>
      </View>
    );
  }

  // ── Estado: Error de red ───────────────────────────────────────────────────
  // COMO: Muestra el mensaje de error del interceptor de Axios y un botón de reintento
  // PARA: Dar al usuario una acción concreta cuando la carga falla
  // IMPACTO: El usuario puede reintentar sin cerrar y reabrir la app
  if (isError) {
    return (
      <View style={styles.centered}>
        <Ionicons name="wifi-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorTitle}>Error al cargar eventos</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
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
      // ── Pull-to-refresh ────────────────────────────────────────────────────
      // COMO: RefreshControl conecta el gesto de pull con refetch() de useQuery
      // PARA: Permitir al usuario forzar actualización de datos con gesto nativo
      // IMPACTO: Los datos se sincronizan con el servidor sin recargar la app
      refreshControl={
        <RefreshControl
          refreshing={isFetching && !isLoading}
          onRefresh={refetch}
          tintColor={COLORS.primary}
        />
      }
      // ── Estado: Lista vacía ────────────────────────────────────────────────
      // COMO: ListEmptyComponent se renderiza cuando events existe pero tiene length 0
      // PARA: Informar al usuario que no hay datos en vez de mostrar pantalla en blanco
      // IMPACTO: Diferencia visualmente el estado de carga del estado de datos vacíos
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={48} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No hay eventos registrados</Text>
          <Text style={styles.emptySubtext}>Crea el primero en "Nuevo Evento"</Text>
        </View>
      }
      ListHeaderComponent={
        events && events.length > 0 ? (
          <Text style={styles.header}>{events.length} eventos en sistema</Text>
        ) : null
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
  errorMessage: { ...TYPOGRAPHY.caption, textAlign: 'center' },
  retryBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, marginTop: SPACING.sm },
  retryText: { color: COLORS.background, fontWeight: '700', fontSize: 15 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.sm, paddingTop: SPACING.xl * 2 },
  emptyText: { ...TYPOGRAPHY.subheading },
  emptySubtext: { ...TYPOGRAPHY.caption },
  header: { ...TYPOGRAPHY.caption, marginBottom: SPACING.sm, textTransform: 'uppercase', letterSpacing: 1 },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.xs },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { ...TYPOGRAPHY.subheading, flex: 1 },
  cardType: { ...TYPOGRAPHY.caption, color: COLORS.primary, textTransform: 'capitalize' },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  cardMeta: { ...TYPOGRAPHY.caption, flex: 1 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.xs },
  price: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
});
