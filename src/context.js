import * as React from 'react';
import { defaultTheme } from './constants';
export const Context = React.createContext(defaultTheme);
export function Provider({ theme = defaultTheme, children }) {
    return (React.createElement(Context.Provider, { value: theme }, children));
}
export function useTheme() {
    return React.useContext(Context);
}
