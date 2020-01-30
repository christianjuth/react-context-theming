import * as React from 'react';
import { theme as themeType } from './types';
import { defaultTheme } from './constants';

export const Context = React.createContext<any>(defaultTheme);

export function Provider<T extends themeType>({ 
  theme = defaultTheme as T,
  children
}: { 
  theme: T,
  children: React.ReactNode
}) {
  return (
    <Context.Provider value={theme}>
      {children}
    </Context.Provider>
  );
}

export function useTheme<T extends themeType>(): T {
  return React.useContext(Context);
}