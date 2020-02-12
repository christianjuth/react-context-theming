import { StyleSheet } from 'react-native';
import { useTheme } from './context';
import memoize from 'fast-memoize';
export const makeStyleCreator = (fn) => {
    return memoize((props, extraData) => (StyleSheet.create(fn(props, ...extraData))));
};
export const useStyleCreator = (styleFn, ...extraData) => {
    return styleFn(useTheme(), extraData);
};
