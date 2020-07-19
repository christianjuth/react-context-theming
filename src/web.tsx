import * as React from 'react';
import { useTheme, Context, Theme } from './index';
import { generateComponentId, camelCaseToHyphenated, cssNormalizeValue, ObjectKeys, useId } from './utils';
import { defaultTheme } from './constants';
import { useUID, UIDReset, UIDFork } from 'react-uid';

// @ts-ignore
import postcss from 'postcss-js';
const prefixer = postcss.sync([ 
  require('autoprefixer')({
    overrideBrowserslist: [
      '>1%',
      'last 4 versions',
      'Firefox ESR',
      'not ie < 9',
    ],
  }) 
]);

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
  return useCSS(useStyleCreator(styleFn, ...extraData));
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
  style.type = 'text/css';
  style.id = 'react-context-theming--Appended';
  // WebKit hack
  style?.appendChild(document.createTextNode(''));
  // Add the <style> element to the page
  document.head.appendChild(style);
}

export const ref: {
  styles: any,
  updateStyleSheet: () => any
} = {
  styles: {},
  updateStyleSheet: () => {}
}

let registeredStyles: any = {};
function registerStyle({
  selector,
  css,
  key,
}: {
  selector: string
  css: string
  key: string
}) {
  if(!registeredStyles[key]) {
    if(style?.sheet?.insertRule) {
      style?.sheet.insertRule(`${selector} ${css}`, 0);
    }
    // else if(style?.sheet?.addRule) {
    //   style?.sheet.addRule(selector, css, priority);
    // }
    ref.styles[selector] = css;
    registeredStyles[key] = true;
    ref.updateStyleSheet();
  }
}


export function getStyles() {
  return Object.entries(ref.styles).map(([k, v]) => `${k} ${v}`).reverse().join(' ');
}

export function StyleSheet() {
  const [styles, setStyles] = React.useState(getStyles());
  React.useEffect(() => {
    ref.updateStyleSheet = () => {
      setStyles(getStyles());
    };
    return () => {
      ref.updateStyleSheet = () => {}
    }
  }, []);
  return (
    <style 
      type='text/css'
      id='react-context-themeing--Component'
    >
      {styles}
    </style>
  );
}

export function addUnitToPeropertyIfNeeded(property: string, value: number) {
  const match = [
    'width',
    'height',
    'padding',
    'margin',
    'radius',
    'spacing',
    'offset',
    'outset',
    'gap'
  ];
  for(let i = 0; i < match.length; i++) {
    if(property.toLowerCase().indexOf(match[i]) > -1) {
      return value + 'px';
    }
  }
  const exactMatch = [
    'top',
    'right',
    'bottom',
    'left'
  ];
  if(exactMatch.indexOf(property) > -1) {
    return value + 'px';
  }
  return value + '';
}

export function reactStylesToCSS<A, B>(styles: A): {
  [P in keyof A]: string;
} {
  let output: any = {};
  ObjectKeys(styles).forEach(async (key) => {
    let selectorStyles: {
      prop: string,
      value: string
    }[] = [];
    ObjectKeys(styles[key]).forEach(prop => {
      const val = styles[key][prop];
    
      const computed = prefix({
        prop: prop+'',
        // number values should default to px unit
        value: typeof val === 'number' ? addUnitToPeropertyIfNeeded(prop+'', val) : val+''
      });

      selectorStyles = selectorStyles.concat(computed);
    });
    output[key] = '{'+selectorStyles.map(style => `${camelCaseToHyphenated(style.prop)}:${cssNormalizeValue(style.value)}`).join(';')+'}';
  });
  return output;
}


export function useCSS<A>(styles: A): {
  [P in keyof A]: string;
} {
  const id = useUID();
  const styleSheet = reactStylesToCSS(styles);

  let classNames: any = {};
  ObjectKeys(styleSheet).map(key => {
    const css = styleSheet[key];
    const [,pseudo] = splitClassFromPseudo(key+'');
    let className = `${generateComponentId(pseudo+css)}-${id}`;
    classNames[key] = className;
    registerStyle({
      selector: '.'+className+pseudo,
      css,
      key: className+pseudo
    });
  });
  return classNames;
}

function prefix({ prop, value }: { prop: string, value: string }): {
  prop: string,
  value: string
}[] {
  const computed = prefixer({
    [prop]: value
  }) as {
    [key: string]: any // string | string[]
  };
  // TODO: check if this generates duplicate prop/value pairs
  const output = Object.keys(computed).map(key => {
    if(typeof computed[key] === 'string') {
      return [
        {
          prop: key,
          value: computed[key]
        }
      ];
    } else {
      return [
        ...computed[key].map((val: string) => ({
          prop: key,
          value: val
        }))
      ]
    }
  })[0];

  let containsOriginal = false;
  output.forEach(style => {
    if(style.prop === prop && style.value === value) {
      containsOriginal = true;
    }
  })

  // Sometimes prefix does not include
  // the original value in which case
  // we add it to the end of the array
  if (!containsOriginal) {
    output.push({prop, value})
  }

  return output;
}

export function splitClassFromPseudo(selector: string) {
  const split = selector.split(':');
  return [split[0], split[1] ? ':'+split[1] : ''];
}

export function Provider<T = Theme>({ 
  theme = defaultTheme as any,
  children
}: { 
  theme: T,
  children: React.ReactNode
}) {
  return (
    <Context.Provider value={theme}>
      <UIDReset>
        {children}
      </UIDReset>
    </Context.Provider>
  );
}