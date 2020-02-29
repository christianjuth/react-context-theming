import * as React from 'react';
import { defaultTheme } from './constants';
export * from './constants';


/**
 * Default Theme type that can be overridden
 * for most functioned by passing a custom 
 * theme type parameter T
 */
export type Theme = {
  colors: {
    primary: string,
    accent: string,
    background: string,
    surface: string,
    text: string,
    textMuted: string,
    disabled: string,
    placeholder: string,
    backdrop: string,
    divider: string
  },
  font?: {
    regular: string,
    medium: string,
    light: string,
    thin: string
  },
  dark?: boolean,
  roundness?: number
};



// CONTEXT

export const Context = React.createContext<any>(defaultTheme);

export function Provider<T = Theme>({ 
  theme = defaultTheme as any,
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

/**
 * hook that reads and returns theme context
 * 
 * @typeparam T  Theme
 * @returns theme context
 */
export function useTheme<T = Theme>(): T {
  return React.useContext(Context);
}

/**
 * Higher order component that reads theme context and 
 * passes it to the wrapped component as a theme prop
 * 
 * @param Component 
 */
export function withTheme(Component: any): any {
  return class WrappedComponent extends React.Component<{}, null> {
    static contextType = Context;
    render() {
      return <Component {...this.props} theme={this.context}/>;
    }
  };
}

export interface WithTheme {
  theme?: Theme
};