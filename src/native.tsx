import * as React from 'react';
import { TextStyle, ViewStyle, ImageStyle, StyleSheet, StyleProp } from 'react-native';
import { useTheme, Context, Theme } from './index';

export interface StyleSheet {
  [key: string]: StyleProp<TextStyle> | StyleProp<ViewStyle> | StyleProp<ImageStyle>;
}
export interface GeneratedStyles {
  [key: string]: StyleProp<any>;
}

export type StyleCreatorFunction<T> = (theme: T, ...extraData: any[]) => StyleSheet;

export interface WithStyleCreator<T = Theme> {
  theme: T,
  styles: GeneratedStyles
};



export function makeStyleCreator<T = Theme>(
  fn: StyleCreatorFunction<T>
): StyleCreatorFunction<T> {
  return (props: any, ...extraData: any[]) => (
    StyleSheet.create(fn(props, ...extraData) as any)
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