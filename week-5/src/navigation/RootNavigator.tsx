// COMO: Tab Navigator con dos tabs: lista de eventos y crear nuevo evento
// PARA: Organizar la navegación principal de la app de networking
// IMPACTO: El usuario accede a la lista y al formulario de creación desde la barra inferior

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { RootTabParamList } from '../types';
import { HomeStack } from './HomeStack';
import { CreateEventScreen } from '../screens/CreateEventScreen';
import { COLORS } from '../theme';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#16213E', borderTopColor: '#2A2A4A', paddingBottom: 4 },
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
        name="CreateTab"
        component={CreateEventScreen}
        options={{
          tabBarLabel: 'Nuevo Evento',
          headerShown: true,
          headerTitle: 'Nuevo Evento',
          headerStyle: { backgroundColor: '#16213E' },
          headerTintColor: COLORS.primary,
          headerTitleStyle: { fontWeight: '700', color: '#EAEAEA' },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
