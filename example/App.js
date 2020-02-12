import * as React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
export default function App() {
    return (React.createElement(SafeAreaProvider, null,
        React.createElement(AppNavigator, null)));
}
