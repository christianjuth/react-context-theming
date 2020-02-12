import { TextStyle, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from './context';
import { theme as themeType } from './types';
import memoize from 'fast-memoize';

interface StyleSheet {
  [key: string]: TextStyle | ViewStyle
}

type styleCreator = (props: any, ...extraData: any[]) => StyleSheet;

export const makeStyleCreator = (fn: (theme: themeType, ...extraData: any[]) => StyleSheet): styleCreator => {
  return memoize((props: any, extraData) => (
    StyleSheet.create(fn(props, ...extraData))
  ));
}

export const useStyleCreator = (styleFn: styleCreator, ...extraData: any[]) => {
  return styleFn(useTheme(), extraData);
};