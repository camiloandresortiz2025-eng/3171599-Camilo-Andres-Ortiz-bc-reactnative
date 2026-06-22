// COMO: Muestra los eventos guardados en el store Zustand con opción de limpiar todos
// PARA: Ser el destino del tab "Guardados" donde el usuario gestiona su colección
// IMPACTO: Se sincroniza automáticamente con el store; no necesita parámetros de navegación

import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CateringEvent } from '../types';
import { EVENT_TYPE_LABELS } from '../data/mockData';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import {
  useSavedEvents,
  useRemoveEvent,
  useClearAll,
} from '../store/useCateringStore';

// COMO: Tarjeta compacta para la lista de guardados con acción de quitar directamente
// PARA: Dar al usuario control para remover un evento sin tener que ir al detalle
// IMPACTO: Gestión más rápida de la colección desde la pantalla de guardados
function SavedEventCard({ event }: { event: CateringEvent }): React.JSX.Element {
  // COMO: Selector de acción removeEvent del store
  // PARA: Quitar el evento específico al pulsar el botón de eliminar
  // IMPACTO: El FlatList y el badge del tab se actualizan en tiempo real
  const removeEvent = useRemoveEvent();

  return (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>{event.name}</Text>
        <Text style={styles.cardMeta}>
          {EVENT_TYPE_LABELS[event.type]} · {event.date}
        </Text>
        <Text style={styles.cardMeta} numberOfLines={1}>{event.location}</Text>
        <Text style={styles.cardPrice}>
          ${(event.guestCount * event.pricePerPerson).toLocaleString('es-CO')} COP total
        </Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.removeBtn, pressed && { opacity: 0.6 }]}
        onPress={() => removeEvent(event.id)}
        accessibilityRole="button"
        accessibilityLabel={`Quitar ${event.name} de guardados`}
      >
        <Ionicons name="heart-dislike-outline" size={22} color={COLORS.error} />
      </Pressable>
    </View>
  );
}

export function SavedScreen(): React.JSX.Element {
  // COMO: Selectores específicos para el arreglo completo y la acción de limpiar
  // PARA: SavedScreen solo recibe lo que necesita; no se suscribe a otros slices del store
  // IMPACTO: Renderizado eficiente; el componente solo cambia cuando la lista de guardados cambia
  const savedEvents = useSavedEvents();
  const clearAll = useClearAll();

  if (savedEvents.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={64} color={COLORS.textSecondary} />
        <Text style={styles.emptyTitle}>Sin eventos guardados</Text>
        <Text style={styles.emptySubtitle}>
          Entra al detalle de un evento y{'\n'}toca "Guardar evento"
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={savedEvents}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <SavedEventCard event={item} />}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>
            {savedEvents.length} evento{savedEvents.length !== 1 ? 's' : ''} guardado{savedEvents.length !== 1 ? 's' : ''}
          </Text>
          {/* COMO: Botón que llama a clearAll() del store para vaciar la lista
              PARA: Dar al usuario una forma rápida de limpiar toda la colección
              IMPACTO: savedEvents vuelve a [] y el badge desaparece */}
          <Pressable
            style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.6 }]}
            onPress={clearAll}
          >
            <Text style={styles.clearBtnText}>Limpiar todo</Text>
          </Pressable>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.md, gap: SPACING.md },
  emptyContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', gap: SPACING.md, padding: SPACING.xl },
  emptyTitle: { ...TYPOGRAPHY.subheading },
  emptySubtitle: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  listHeaderText: { ...TYPOGRAPHY.caption, textTransform: 'uppercase', letterSpacing: 1 },
  clearBtn: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs },
  clearBtnText: { color: COLORS.error, fontSize: 13, fontWeight: '600' },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md },
  cardInfo: { flex: 1, gap: 3 },
  cardTitle: { ...TYPOGRAPHY.subheading },
  cardMeta: { ...TYPOGRAPHY.caption },
  cardPrice: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginTop: SPACING.xs },
  removeBtn: { padding: SPACING.sm },
});
