import * as React from 'react';
import { useTheme, Context } from './context';
import { Theme } from './types';

export interface StyleSheet {
  [key: string]: React.CSSProperties;
}
export interface GeneratedStyles {
  [key: string]: React.CSSProperties;
}

export type StyleCreatorFunction<T> = (theme: T, ...extraData: any[]) => StyleSheet;

export interface WithStyleCreator {
  theme: Theme,
  styles: GeneratedStyles
};



export function makeStyleCreator<T = Theme>(
  fn: StyleCreatorFunction<T>
): any {
  return (props: any, ...extraData: any[]) => (
    fn(props, ...extraData)
  );
}

export function useStyleCreator<T = Theme>(styleFn: StyleCreatorFunction<T>, ...extraData: any[]): GeneratedStyles {
  return styleFn(useTheme<T>(), ...extraData);
};

export function withStyleCreator<T = Theme>(
  Component: any, 
  styleFn: StyleCreatorFunction<T>, 
  ...extraData: any[]
): any {
  return class WrappedComponent extends React.Component<{}, null> {
    static contextType = Context;
    render() {
      return (
        <Component 
          {...this.props} 
          styles={styleFn(this.context, extraData)}
          theme={this.context}
        />
      );
    }
  };
}