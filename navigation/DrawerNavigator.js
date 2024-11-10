import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PlanetsScreen from '../screens/PlanetsScreen';
import FilmsScreen from '../screens/FilmsScreen';
import SpaceshipsScreen from '../screens/SpaceshipsScreen';

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Planets" component={PlanetsScreen} />
      <Drawer.Screen name="Films" component={FilmsScreen} />
      <Drawer.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;