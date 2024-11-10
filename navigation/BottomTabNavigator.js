import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlanetsScreen from '../screens/PlanetsScreen';
import FilmsScreen from '../screens/FilmsScreen';
import SpaceshipsScreen from '../screens/SpaceshipsScreen';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Planets" component={PlanetsScreen} />
      <Tab.Screen name="Films" component={FilmsScreen} />
      <Tab.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;