import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { CateringEvent, EventStatus, EventType } from '../types';

interface ItemCardProps {
  item: CateringEvent;
  onPress: (item: CateringEvent) => void;
}

const EVENT_TYPE_COLORS: Record<EventType, string> = {
  Boda: '#f472b6',
  Corporativo: '#60a5fa',
  Quinceañera: '#a78bfa',
  Cumpleaños: '#fb923c',
  Graduación: '#34d399',
  Lanzamiento: '#facc15',
};

const STATUS_COLORS: Record<EventStatus, string> = {
  confirmado: '#22c55e',
  pendiente: '#f59e0b',
  'en progreso': '#3b82f6',
};

function formatPrice(pricePerGuest: number, guests: number): string {
  const total = pricePerGuest * guests;
  return `$${(total / 1_000_000).toFixed(1)}M`;
}

export function ItemCard({ item, onPress }: ItemCardProps): React.JSX.Element {
  const typeColor = EVENT_TYPE_COLORS[item.eventType];
  const statusColor = STATUS_COLORS[item.status];

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(item)}
    >
      {/* Imagen del evento */}
      <Image
        source={{ uri: item.imageUri }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      {/* Badge de tipo de evento sobre la imagen */}
      <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
        <Text style={styles.typeBadgeText}>{item.eventType.toUpperCase()}</Text>
      </View>

      {/* Cuerpo de la tarjeta */}
      <View style={styles.cardBody}>
        {/* Nombre del evento */}
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>

        {/* Venue */}
        <Text style={styles.cardVenue} numberOfLines={1}>
          {item.venue}
        </Text>

        {/* Fila de detalles: fecha y comensales */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Fecha</Text>
            <Text style={styles.detailValue}>{item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Comensales</Text>
            <Text style={styles.detailValue}>{item.guests} pax</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total est.</Text>
            <Text style={styles.detailValue}>
              {formatPrice(item.pricePerGuest, item.guests)}
            </Text>
          </View>
        </View>

        {/* Menú */}
        <Text style={styles.menuText} numberOfLines={1}>
          {item.menu}
        </Text>

        {/* Footer: estado y botón */}
        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, { borderColor: statusColor }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>

          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Ver detalles</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161b22',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardImage: {
    width: '100%',
    height: 170,
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: '#0d1117',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 16,
    gap: 8,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardVenue: {
    fontSize: 13,
    color: '#8b949e',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#30363d',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#8b949e',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e6edf3',
  },
  menuText: {
    fontSize: 13,
    color: '#d4a017',
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#d4a017',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#0d1117',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
