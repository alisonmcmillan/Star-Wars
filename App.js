import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Navigators
import BottomTabNavigator from './navigation/BottomTabNavigator';
import DrawerNavigator from './navigation/DrawerNavigator';

// Screens
import PlanetsScreen from './screens/PlanetsScreen';
import PlanetDetailScreen from './screens/PlanetDetailScreen';

const Stack = createStackNavigator();

const MainStackNavigator = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home">
      {() => (Platform.OS === 'ios' ? <BottomTabNavigator /> : <DrawerNavigator />)}
    </Stack.Screen>
    <Stack.Screen name="Planets" component={PlanetsScreen} />
    <Stack.Screen name="PlanetDetail" component={PlanetDetailScreen} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  );
}
