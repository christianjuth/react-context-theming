import * as React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Slider has been extracted'
]);

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator/>
    </SafeAreaProvider>
  );
}