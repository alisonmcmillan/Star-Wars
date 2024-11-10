import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import DrawerNavigator from './navigation/DrawerNavigator';

export default function App() {
  return (
    <NavigationContainer>
      {Platform.OS === 'ios' ? <BottomTabNavigator /> : <DrawerNavigator />}
    </NavigationContainer>
  );
}