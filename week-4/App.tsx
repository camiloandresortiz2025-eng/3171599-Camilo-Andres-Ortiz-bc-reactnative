// COMO: Punto de entrada idéntico a semana 3; el store Zustand no necesita Provider global
// PARA: Mantener la misma estructura de providers (SafeArea + Navigation) del proyecto base
// IMPACTO: Zustand funciona como singleton; cualquier componente accede al store sin wrappers

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
