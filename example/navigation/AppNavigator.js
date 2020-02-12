import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { BasicUsage, DarkTheme } from '../screens';
const Drawer = createDrawerNavigator();
function DrawerNavigator() {
    return (React.createElement(Drawer.Navigator, { drawerPosition: 'right', drawerType: 'slide' },
        React.createElement(Drawer.Screen, { name: "Basic Usage", component: BasicUsage }),
        React.createElement(Drawer.Screen, { name: "Dark Theme", component: DarkTheme })));
}
export default () => (React.createElement(NavigationContainer, null,
    React.createElement(DrawerNavigator, null)));
