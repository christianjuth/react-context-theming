import * as React from 'react';
import { useTheme, Context, Theme } from './index';
import { processCSS, camelCaseToHyphenated, cssNormalizeValue, ObjectKeys, removeCSSExtras } from './utils';
import { defaultTheme } from './constants';
import { useUID, UIDReset, UIDFork } from 'react-uid';

const CLASS_PREFIX = 'context';

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
  return removeCSSExtras(styleFn(useTheme<T>(), ...extraData));
};

export function useStyleCreatorClassNames<
  T = Theme,
  S = never
>(
  styleFn: GenerateStylesFunction<T, S>,
  ...extraData: any[]
) {
  return useCSS(styleFn(useTheme<T>(), ...extraData));
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
  css,
  key,
}: {
  css: string
  key: string
}) {
  if(!registeredStyles[key]) {
    // @ts-ignore
    if(style?.sheet?.insertRule) {
      // @ts-ignore
      style?.sheet.insertRule(css, 0);
    }
    ref.styles[key] = css;
    registeredStyles[key] = true;
    ref.updateStyleSheet();
  }
}

function resetStyles() {
  ref.styles = {};
  registeredStyles = {};
  ref.updateStyleSheet();
}

export function getStyles() {
  const out = Object.values(ref.styles).reverse().join(' ');
  return out;
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

function processSelectorStyles<A, B>(selector: A, styles: B): {
  [key: string]: {
    [key: string]: string
  }[]
} {
  const output: any = {};

  let selectorStyles: {
    prop: string,
    value: string
  }[] = [];

  ObjectKeys(styles).forEach(prop => {
    if ((prop+'').indexOf(':') === 0 || (prop+'').indexOf('@') === 0) {
      Object.assign(output, processSelectorStyles(`${selector}${prop}`, styles[prop]));
      return;
    }

    const val = styles[prop];
  
    const computed = prefix({
      prop: prop+'',
      // number values should default to px unit
      value: typeof val === 'number' ? addUnitToPeropertyIfNeeded(prop+'', val) : val+''
    });

    selectorStyles = selectorStyles.concat(computed);
  });

  return {
    [selector+'']: selectorStyles,
    ...output
  };
}

/**
 * Convert camcelCase CSS to standard CSS
 */
export function reactStylesToCSS<A extends { [key: string]: any }>(styles: A, id: string): {
  [key: string]: string;
} {
  let output: any = {};

  ObjectKeys(styles).forEach(async (key) => {
    const selectorStyles = processSelectorStyles(key, styles[key]);
    let className = `${CLASS_PREFIX}${id}-${key}`;

    ObjectKeys(selectorStyles).forEach(selector => {
      const query = (selector+'').match(/@.*/)?.[0];
      const pseudo = (selector+'').match(/:.*/)?.[0] ?? '';

      if(query) {
output[selector] = `
${query} {
  .${className} { 
    ${selectorStyles[selector].map(style => `${camelCaseToHyphenated(style.prop)}:${cssNormalizeValue(style.value)}`).join(';')}
  }
}
`;
      } else {
output[selector] = `
.${className}${pseudo} { 
  ${selectorStyles[selector].map(style => `${camelCaseToHyphenated(style.prop)}:${cssNormalizeValue(style.value)}`).join(';')}
}
`;
      }
    })
  });

  return output;
}


export function useCSS<A>(styles: A): {
  [P in keyof A]: string;
} {
  const id = useUID();
  const styleSheet = reactStylesToCSS(styles, id);
  const environmant = typeof window === 'undefined' ? 'server' : 'browser';

  let classNames: any = {};
  ObjectKeys(styleSheet).reverse().map(key => {
    const css = processCSS(styleSheet[key]);
    let className = `${CLASS_PREFIX}${id}-${key}`;

    classNames[key] = className;
    registerStyle({
      css,
      key: className+environmant
    });
  });
  return classNames;
}


/**
 * Apply vendor prefixes where needed
 */
function prefix({ 
  prop, 
  value 
}: { 
  prop: string
  value: string 
}): {
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
    } 
    
    else if(typeof computed[key] === 'object') {
      return [
        ...computed[key].map((val: string) => ({
          prop: key,
          value: val
        }))
      ]
    }

    else {
      return [];
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


export function Provider<T = Theme>({ 
  theme = defaultTheme as any,
  children
}: { 
  theme: T,
  children: React.ReactNode
}) {

  if (typeof window === 'undefined') {
    resetStyles();
  }

  return (
    <Context.Provider value={theme}>
      <UIDReset>
        {children}
      </UIDReset>
    </Context.Provider>
  );
}


/**
 * Used to wrap async components like suspense
 * Nessesary if using suspense to keep classNames
 * consistent on SSR and client
 */
export function Fork({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <UIDFork>
      {children}
    </UIDFork>
  )
}