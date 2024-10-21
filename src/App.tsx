import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import ThemeProvider from './contexts/ThemeContext';

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <View>asd</View>
      </ThemeProvider>
    </NavigationContainer>
  );
}
