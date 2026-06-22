// COMO: Envuelve la app en QueryClientProvider con configuración de caché y reintentos
// PARA: Hacer disponible el cliente de TanStack Query en todos los componentes de la app
// IMPACTO: Sin este provider, useQuery y useMutation lanzarían un error en cualquier pantalla

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';

// COMO: QueryClient instanciado fuera del componente para evitar recrearlo en cada render
// PARA: Mantener la caché de queries estable durante toda la vida de la app
// IMPACTO: Si estuviera dentro del componente, cada re-render de App destruiría la caché
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,       // 2 min antes de refetch automático
      retry: 2,                         // Reintenta 2 veces antes de mostrar error
      refetchOnWindowFocus: false,      // Mobile no tiene "window focus" como web
    },
  },
});

export default function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
