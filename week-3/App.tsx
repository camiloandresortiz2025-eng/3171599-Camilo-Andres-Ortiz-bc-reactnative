// COMO: Punto de entrada de la app; envuelve todo en SafeAreaProvider y NavigationContainer
// PARA: Proveer contexto de área segura y el contenedor de navegación a toda la aplicación
// IMPACTO: Sin este wrapper, ninguna pantalla puede navegar ni respetar notch/barra de estado

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
