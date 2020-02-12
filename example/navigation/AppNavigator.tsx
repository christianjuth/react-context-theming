import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { BasicUsage, DarkTheme } from '../screens';

const Drawer = createDrawerNavigator();
function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerPosition='right' drawerType='slide'>
      <Drawer.Screen name="Basic Usage" component={BasicUsage} />
      <Drawer.Screen name="Dark Theme" component={DarkTheme} />
    </Drawer.Navigator>
  );
}

export default () => (
  <NavigationContainer>
    <DrawerNavigator/>
  </NavigationContainer>
);