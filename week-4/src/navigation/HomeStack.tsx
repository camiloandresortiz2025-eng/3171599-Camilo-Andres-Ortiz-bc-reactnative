// COMO: Stack Navigator anidado en HomeTab; ruta lista → detalle con parámetros tipados
// PARA: Navegar al detalle de cada evento pasando id y name de forma type-safe
// IMPACTO: El detalle puede leer el store Zustand sin necesitar props adicionales del Stack

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
