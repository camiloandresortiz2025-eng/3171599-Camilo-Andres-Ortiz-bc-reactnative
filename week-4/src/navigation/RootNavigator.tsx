// COMO: Tab Navigator raíz; lee el conteo del store con selector para mostrar el badge dinámico
// PARA: Reflejar en tiempo real cuántos eventos tiene el usuario guardados en el tab
// IMPACTO: El badge se actualiza automáticamente cuando el usuario guarda o elimina un evento

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { RootTabParamList } from '../types';
import { HomeStack } from './HomeStack';
import { SavedScreen } from '../screens/SavedScreen';
import { COLORS } from '../theme';

// COMO: Selector específico importado del store — evita el antipatrón useStore() sin selector
// PARA: El Navigator solo se re-renderiza cuando cambia el conteo, no todo el estado
// IMPACTO: Performance óptima; el badge no causa re-renders de toda la app
import { useSavedCount } from '../store/useCateringStore';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator(): React.JSX.Element {
  // COMO: useSavedCount es un selector que devuelve solo state.savedEvents.length
  // PARA: Mostrar el número en el badge del tab sin exponer el arreglo completo
  // IMPACTO: Actualizaciones eficientes — solo el conteo lleva al re-render del Navigator
  const savedCount = useSavedCount();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#16213E',
          borderTopColor: '#2A2A4A',
          paddingBottom: 4,
        },
        tabBarActiveTintColor: COLORS.primary,
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
        name="SavedTab"
        component={SavedScreen}
        options={{
          tabBarLabel: 'Guardados',
          // COMO: tabBarBadge muestra el número solo si hay al menos 1 evento guardado
          // PARA: No mostrar badge "0" que confundiría al usuario cuando la lista está vacía
          // IMPACTO: UX limpia: el badge aparece/desaparece según el estado real del store
          tabBarBadge: savedCount > 0 ? savedCount : undefined,
          tabBarBadgeStyle: { backgroundColor: COLORS.accent },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
