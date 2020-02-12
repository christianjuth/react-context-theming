import { TextStyle, ViewStyle, StyleSheet } from 'react-native';
import { theme as themeType } from './types';
interface StyleSheet {
    [key: string]: TextStyle | ViewStyle;
}
declare type styleCreator = (props: any, ...extraData: any[]) => StyleSheet;
export declare const makeStyleCreator: (fn: (theme: themeType, ...extraData: any[]) => StyleSheet) => styleCreator;
export declare const useStyleCreator: (styleFn: styleCreator, ...extraData: any[]) => StyleSheet;
export {};
