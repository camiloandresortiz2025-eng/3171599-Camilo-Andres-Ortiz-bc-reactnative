// COMO: Stack que incluye EventList, EventDetail y EditEvent como rutas anidadas
// PARA: Permitir navegar de la lista al detalle y del detalle al formulario de edición
// IMPACTO: El usuario puede editar cualquier evento en el flujo lista → detalle → edición

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeStackParamList } from '../types';
import { EventListScreen } from '../screens/EventListScreen';
import { EventDetailScreen } from '../screens/EventDetailScreen';
import { EditEventScreen } from '../screens/EditEventScreen';
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
      <Stack.Screen name="EventList" component={EventListScreen} options={{ title: 'Eventos de Catering' }} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} options={({ route }) => ({ title: route.params.name })} />
      <Stack.Screen name="EditEvent" component={EditEventScreen} options={{ title: 'Editar Evento' }} />
    </Stack.Navigator>
  );
}
