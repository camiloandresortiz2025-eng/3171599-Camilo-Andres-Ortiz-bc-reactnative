// COMO: Stack Navigator con lista de eventos y pantalla de detalle
// PARA: Estructurar la navegación profunda lista → detalle dentro del tab Home
// IMPACTO: El usuario puede explorar eventos y ver su información completa con back nativo

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeStackParamList } from '../types';
import { EventListScreen } from '../screens/EventListScreen';
import { EventDetailScreen } from '../screens/EventDetailScreen';
import { COLORS } from '../theme';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#16213E' },
        headerTintColor: COLORS.primary,
        headerTitleStyle: { fontWeight: '700', color: '#EAEAEA' },
      }}
    >
      <Stack.Screen
        name="EventList"
        component={EventListScreen}
        options={{ title: 'Eventos de Catering' }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  );
}
