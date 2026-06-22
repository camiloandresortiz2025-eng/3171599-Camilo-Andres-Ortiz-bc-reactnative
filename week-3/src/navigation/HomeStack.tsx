// COMO: Crea el Stack Navigator anidado dentro del tab Home con dos rutas: lista y detalle
// PARA: Permitir navegación profunda lista → detalle con parámetros tipados
// IMPACTO: El usuario puede ver el detalle de cualquier evento y regresar con el botón back nativo

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeStackParamList } from '../types';
import { EventListScreen } from '../screens/EventListScreen';
import { EventDetailScreen } from '../screens/EventDetailScreen';
import { COLORS } from '../theme';

// COMO: Instancia del Stack Navigator tipada con HomeStackParamList
// PARA: Asegurar que los parámetros pasados entre pantallas sean correctos en tipo
// IMPACTO: Detecta en compilación si se pasa un parámetro con nombre incorrecto o tipo errado
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
        // COMO: El título del header se toma del parámetro name recibido en la ruta
        // PARA: Mostrar el nombre del evento en el header sin hardcodear texto
        // IMPACTO: Cada pantalla de detalle muestra el nombre específico del evento
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  );
}
