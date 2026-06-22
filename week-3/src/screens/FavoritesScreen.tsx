// COMO: Pantalla placeholder del tab Favoritos; en semana 4 se conecta al store Zustand
// PARA: Cumplir el requisito de tener dos tabs funcionales en la navegación raíz
// IMPACTO: El usuario puede navegar al tab sin crasheos; lista vacía con mensaje orientativo

import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

export function FavoritesScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Ionicons name="heart-outline" size={64} color={COLORS.textSecondary} />
      <Text style={styles.title}>Sin favoritos aún</Text>
      <Text style={styles.subtitle}>
        En la semana 4 podrás guardar eventos{'\n'}aquí usando Zustand
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.subheading,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
