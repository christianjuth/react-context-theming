import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { FunctionComponents, ClassComponents, CustomTheme, CustomTypes, DynamicTheme } from '../screens';

const Drawer = createDrawerNavigator();
function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerPosition='right' drawerType='slide'>
      <Drawer.Screen name="Function Components" component={FunctionComponents} />
      <Drawer.Screen name="Class Components" component={ClassComponents} />
      <Drawer.Screen name="Custom Theme" component={CustomTheme} />
      <Drawer.Screen name="TypeScript" component={CustomTypes} />
      <Drawer.Screen name="Dynamic Theme" component={DynamicTheme} />
    </Drawer.Navigator>
  );
}

export default () => (
  <NavigationContainer>
    <DrawerNavigator/>
  </NavigationContainer>
);