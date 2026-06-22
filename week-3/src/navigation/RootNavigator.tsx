// COMO: Crea el Tab Navigator raíz con dos pestañas: Eventos y Favoritos
// PARA: Estructurar la navegación principal de la app siguiendo el patrón Tab+Stack
// IMPACTO: El usuario puede cambiar entre la lista de eventos y sus favoritos con un toque

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { RootTabParamList } from '../types';
import { HomeStack } from './HomeStack';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { COLORS } from '../theme';

// COMO: Instancia del Tab Navigator tipada con RootTabParamList
// PARA: Garantizar que solo se navegue a tabs declaradas en el tipo
// IMPACTO: TypeScript lanza error si se intenta acceder a una tab inexistente
const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#16213E',
          borderTopColor: '#2A2A4A',
          paddingBottom: 4,
        },
        tabBarActiveTintColor: COLORS.primary,   // #61DAFB — requerido por rúbrica
        tabBarInactiveTintColor: '#A0A0B0',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Eventos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
