import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { CateringEvent } from '../types';
import { ItemCard } from '../components/ItemCard';
import { MOCK_ITEMS } from '../data/mockData';

const DOMAIN_TITLE = 'Catering Elite';
const DOMAIN_SUBTITLE = 'Gestión de Eventos & Servicios';

function getTotalGuests(): number {
  return MOCK_ITEMS.reduce((sum, event) => sum + event.guests, 0);
}

function getConfirmedCount(): number {
  return MOCK_ITEMS.filter((e) => e.status === 'confirmado').length;
}

export function HomeScreen(): React.JSX.Element {
  function handleItemPress(item: CateringEvent): void {
    Alert.alert(
      item.name,
      `Menú: ${item.menu}\nComensales: ${item.guests} pax\nFecha: ${item.date}`,
      [{ text: 'Cerrar', style: 'cancel' }],
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1117" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{DOMAIN_TITLE}</Text>
          <Text style={styles.headerSubtitle}>{DOMAIN_SUBTITLE}</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeNumber}>{MOCK_ITEMS.length}</Text>
          <Text style={styles.headerBadgeLabel}>eventos</Text>
        </View>
      </View>

      {/* Barra de estadísticas */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{MOCK_ITEMS.length}</Text>
          <Text style={styles.statLabel}>Total eventos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getConfirmedCount()}</Text>
          <Text style={styles.statLabel}>Confirmados</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getTotalGuests().toLocaleString('es-CO')}</Text>
          <Text style={styles.statLabel}>Comensales</Text>
        </View>
      </View>

      {/* Lista de eventos */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_ITEMS.map((item) => (
          <ItemCard key={item.id} item={item} onPress={handleItemPress} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8b949e',
    marginTop: 2,
  },
  headerBadge: {
    backgroundColor: '#1c2128',
    borderWidth: 1,
    borderColor: '#d4a017',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  headerBadgeNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d4a017',
  },
  headerBadgeLabel: {
    fontSize: 10,
    color: '#8b949e',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#161b22',
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e6edf3',
  },
  statLabel: {
    fontSize: 11,
    color: '#8b949e',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#30363d',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
});
