import * as React from 'react';
import { Theme } from './types';
import { defaultTheme } from './constants';

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

export function useTheme<T = Theme>(): T {
  return React.useContext(Context);
}

export function withTheme(Component: any): any {
  return class WrappedComponent extends Component<{}, null> {
    static contextType = Context;
    render() {
      return <Component {...this.props} theme={this.context}/>;
    }
  };
}