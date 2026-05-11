import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CateringEvent, EventStatus, EventType } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

interface ItemCardProps {
  item: CateringEvent;
  onPress: (item: CateringEvent) => void;
}

const EVENT_TYPE_COLOR: Record<EventType, string> = {
  Boda: '#f472b6',
  Corporativo: '#60a5fa',
  Quinceañera: '#a78bfa',
  Cumpleaños: '#fb923c',
  Graduación: '#34d399',
  Lanzamiento: '#facc15',
  Gala: COLORS.accent,
};

const STATUS_COLOR: Record<EventStatus, string> = {
  confirmado: COLORS.success,
  pendiente: COLORS.warning,
  'en progreso': COLORS.info,
  completado: COLORS.textMuted,
};

export function ItemCard({ item, onPress }: ItemCardProps): React.JSX.Element {
  const typeColor = EVENT_TYPE_COLOR[item.eventType];
  const statusColor = STATUS_COLOR[item.status];
  const statusLabel = item.status.charAt(0).toUpperCase() + item.status.slice(1);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={item.name}
    >
      {/* Barra lateral de color por tipo de evento */}
      <View style={[styles.typeBar, { backgroundColor: typeColor }]} />

      <View style={styles.cardContent}>
        {/* Fila superior: nombre y badge de tipo */}
        <View style={styles.headerRow}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={[styles.typeBadge, { backgroundColor: typeColor + '22' }]}>
            <Text style={[styles.typeBadgeText, { color: typeColor }]}>
              {item.eventType}
            </Text>
          </View>
        </View>

        {/* Venue */}
        <Text style={styles.venueText} numberOfLines={1}>
          {item.venue}
        </Text>

        {/* Fila de detalles: fecha y comensales */}
        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>{item.date}</Text>
          <View style={styles.detailDot} />
          <Text style={styles.detailText}>{item.guests} comensales</Text>
          <View style={styles.detailDot} />
          <Text style={styles.detailText}>{item.coordinator}</Text>
        </View>

        {/* Menú */}
        <Text style={styles.menuText} numberOfLines={1}>
          {item.menu}
        </Text>

        {/* Footer: precio y estado */}
        <View style={styles.footerRow}>
          <Text style={styles.priceText}>
            ${(item.pricePerGuest / 1000).toFixed(0)}K / pax
          </Text>
          <View style={[styles.statusBadge, { borderColor: statusColor }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.base,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardPressed: {
    backgroundColor: COLORS.surfaceAlt,
  },
  typeBar: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  itemName: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  typeBadgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  venueText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  detailText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
  },
  detailDot: {
    width: 3,
    height: 3,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
  },
  menuText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.accent,
    fontStyle: 'italic',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  priceText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    gap: SPACING.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
  },
  statusText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
});
