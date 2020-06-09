import * as React from 'react';
import { useTheme, Context, Theme } from './index';
import { generateComponentId, camelCaseToHyphenated, ObjectKeys } from './utils';
// @ts-ignore
import * as cssVendor from 'css-vendor';

export type NamedStyles<T> = { 
  [P in keyof T]: React.CSSProperties
};

export type StyleCreatorFunction<T, S> = (theme: T, ...extraData: any[]) => NamedStyles<S>;
export type GenerateStylesFunction<T, S> = (theme: T, ...extraData: any[]) => S;

export interface WithStyleCreator<T = Theme> {
  theme: T,
  styles: any
};

export function makeStyleCreator<
  T = Theme, 
  S extends NamedStyles<S> | NamedStyles<any> = never
>(
  fn: StyleCreatorFunction<T, S> | GenerateStylesFunction<T, S>
): GenerateStylesFunction<T, S> {
  return (theme: T, ...extraData: any[]) => (
    fn(theme, ...extraData) as any
  );
}

export function useStyleCreator<
  T = Theme, 
  S = never
>(
  styleFn: GenerateStylesFunction<T, S>,
  ...extraData: any[]
) {
  return styleFn(useTheme<T>(), ...extraData);
};

export function useStyleCreatorClassNames<
  T = Theme,
  S = never
>(
  styleFn: GenerateStylesFunction<T, S>,
  ...extraData: any[]
) {
  return generateCSS(useStyleCreator(styleFn));
}

export function withStyleCreator<
  T = Theme,
  S = never
>(
  Component: any, 
  styleFn: GenerateStylesFunction<T, S>,
  ...extraData: any[]
): any {
  return class WrappedComponent extends React.Component<{}, null> {
    static contextType = Context;
    render() {
      return (
        <Component 
          {...this.props} 
          styles={styleFn(this.context, ...extraData)}
          theme={this.context}
        />
      );
    }
  };
}

let style: HTMLStyleElement | null = null;
if(typeof document !== 'undefined') {
  style = document.createElement("style");
  // WebKit hack
  style?.appendChild(document.createTextNode(''));
  // Add the <style> element to the page
  document.head.appendChild(style);
}


let registeredStyles: any = {};
function registerStyle(selector: string, css: string ) {
  if(!registeredStyles[selector]) {
    if(style?.sheet?.insertRule) {
      style?.sheet.insertRule(`${selector} ${css}`, 0);
    }
    else if(style?.sheet?.addRule) {
      style?.sheet.addRule(selector, css, 0);
    }
    registeredStyles[selector] = true;
  }
}


function reactStylesToCSS<A>(styles: A): {
  [P in keyof A]: string;
} {
  let output: any = {};
  ObjectKeys(styles).forEach(key => {
    let selectorStyles: any = {};
    ObjectKeys(styles[key]).forEach(prop => {
      const val = styles[key][prop];
      const computed = prefix({
        prop: camelCaseToHyphenated(prop+''),
        // number values should default to px unit
        value: typeof val === 'number' ? val+'px' : val+''
      })
      selectorStyles[computed.prop] = computed.value;
    });
    output[key] = JSON.stringify(selectorStyles).replace(/"/g, "").replace(/,/g, ";");
  });
  return output;
}


function generateCSS<A>(styles: A): {
  [P in keyof A]: string;
} {
  const styleSheet = reactStylesToCSS(styles);

  let classNames: any = {};
  ObjectKeys(styleSheet).map(key => {
    const css = styleSheet[key];
    let className = generateComponentId(css);
    classNames[key] = className;
    registerStyle('.'+className, css);
  });

  return classNames;
}

function prefix({prop, value}: {prop: string, value: string}) {
  return {
    prop: cssVendor.supportedProperty(prop),
    value: cssVendor.supportedValue(prop, value)
  };
}