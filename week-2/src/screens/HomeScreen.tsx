import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ListRenderItem,
  Alert,
} from 'react-native';
import { CateringEvent } from '../types';
import { CATERING_EVENTS } from '../data/mockData';
import { ItemCard } from '../components/ItemCard';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

export function HomeScreen(): React.JSX.Element {
  // ── Estado de búsqueda ─────────────────────────────────────────
  const [query, setQuery] = useState<string>('');

  // ── Filtrado con useMemo ───────────────────────────────────────
  // Filtra por nombre, sede, tipo de evento, menú o coordinador
  const filteredItems = useMemo(() => {
    if (!query.trim()) return CATERING_EVENTS;
    const lower = query.toLowerCase();
    return CATERING_EVENTS.filter(
      (event) =>
        event.name.toLowerCase().includes(lower) ||
        event.venue.toLowerCase().includes(lower) ||
        event.eventType.toLowerCase().includes(lower) ||
        event.menu.toLowerCase().includes(lower) ||
        event.coordinator.toLowerCase().includes(lower),
    );
  }, [query]);

  // ── Empty state con useCallback ────────────────────────────────
  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Sin resultados para "{query}"
        </Text>
        <Text style={styles.emptySubText}>
          Intenta buscar por nombre, sede, tipo de evento o menú
        </Text>
      </View>
    ),
    [query],
  );

  // ── Render item con useCallback ────────────────────────────────
  const renderItem: ListRenderItem<CateringEvent> = useCallback(
    ({ item }) => (
      <ItemCard
        item={item}
        onPress={(selected) =>
          Alert.alert(
            selected.name,
            `Menú: ${selected.menu}\nComensales: ${selected.guests} pax\nCoordinador: ${selected.coordinator}\nFecha: ${selected.date}`,
            [{ text: 'Cerrar', style: 'cancel' }],
          )
        }
      />
    ),
    [],
  );

  // ── Separador entre ítems ──────────────────────────────────────
  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  return (
    <KeyboardAvoidingView
      style={styles.kvContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Catering Elite</Text>
              <Text style={styles.headerSubtitle}>
                Gestión de Eventos & Servicios
              </Text>
            </View>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeCount}>
                {filteredItems.length}
              </Text>
              <Text style={styles.headerBadgeLabel}>eventos</Text>
            </View>
          </View>

          {/* Input de búsqueda */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre, sede, tipo o menú..."
              placeholderTextColor={COLORS.textMuted}
              value={query}
              onChangeText={setQuery}
              keyboardType="default"
              returnKeyType="search"
              clearButtonMode="while-editing"
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          {/* Lista filtrada */}
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            ItemSeparatorComponent={renderSeparator}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kvContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  headerBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  headerBadgeCount: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
  },
  headerBadgeLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.base,
  },
  listContent: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },
  separator: {
    height: 1,
    marginHorizontal: SPACING.base,
    backgroundColor: COLORS.borderLight,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: SPACING.xxl,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptySubText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
