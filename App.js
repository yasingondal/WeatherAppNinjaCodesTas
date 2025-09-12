
import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WeatherProvider } from './src/context/WeatherContext';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/colors';

const App = () => {
  return (
    <WeatherProvider>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={COLORS.light.background} 
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppNavigator />
      </GestureHandlerRootView>
    </WeatherProvider>
  );
};

export default App;
