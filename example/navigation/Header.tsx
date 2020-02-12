import React from 'react';
import Constants from 'expo-constants';
import { View, Text } from 'react-native';
import { makeStyleCreator, useStyleCreator } from 'react-context-theming/native';
import { Entypo } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/core';

function Header() {
  const styles = useStyleCreator(styleCreator, Constants.statusBarHeight);
  const navigation: any = useNavigation();
  const {name} = useRoute();

  return (
    <View style={styles.container}>
      <Entypo
        name='back'
        size={28}
        color='transparent'
      />
      <Text style={styles.text}>{name}</Text>
      <Entypo
        name='menu'
        size={28}
        color='#fff'
        onPress={() => navigation.openDrawer()}
      />
    </View>
  );
}

const styleCreator = makeStyleCreator((theme, statusBarHeight) => ({
  container: {
    height: 60 + statusBarHeight,
    paddingTop: statusBarHeight,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.primary
  },

  text: {
    color: '#fff',
    fontSize: 20
  }
}));

export default Header;