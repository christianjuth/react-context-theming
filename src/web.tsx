import * as React from 'react';
import { useTheme, Context, Theme } from './index';
import { processCSS, camelCaseToHyphenated, cssNormalizeValue, ObjectKeys, removeCSSExtras } from './utils';
import { defaultTheme } from './constants';
import { useStore, useId, useDispatch, storeActions, StoreProvider } from './web-store';

const CLASS_PREFIX = 'context';

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

export function StyleSheet() {
  const { state, serverStyles } = useStore();

  const computedStyles = Object.values({
    ...state.styles,
    ...serverStyles?.current
  }).reverse().join(' ');

  return (
    <style 
      type='text/css'
      id='react-context-themeing--Component'
    >
      {computedStyles}
    </style>
  );
}

/**
 * Style API allows the user to specify just a
 * number for many properties with px being inferred.
 * This function adds the px to properties that support
 * this feature.
 * 
 * Example: "padding: 10" becomes "padding: 10px"
 */
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

    selectorStyles.push({
      prop: prop+'',
      // number values should default to px unit
      value: typeof val === 'number' ? addUnitToPeropertyIfNeeded(prop+'', val) : val+''
    })
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
  const id = useId();
  const dispatch = useDispatch();
  const { state, serverStyles } = useStore();
  const updateKey = React.useRef(0); 
  let requestSSR = false

  const styleSheet = reactStylesToCSS(styles, id);
  // const environmant = typeof window === 'undefined' ? 'server' : 'browser';

  const computedStyles: any = {};

  const classNames: any = {};
  ObjectKeys(styleSheet).map(key => {

    const className = `${CLASS_PREFIX}${id}-${key+''}`;
    classNames[key] = className;

    const oldCSS = state.styles[key];
    const css = processCSS(styleSheet[key]);

    if (oldCSS === undefined) {
      requestSSR = true;
    }

    if (oldCSS !== css) {
      updateKey.current++;
      computedStyles[className] = css;
    }

  });

  // check for SSR
  if (requestSSR && serverStyles) {
    let componentStyles: any = {};

    Object.keys(computedStyles).map(key => {
      const css = computedStyles[key];

      componentStyles = {
        [key]: css,
        ...componentStyles
      }
    });

    serverStyles.current = {
      ...serverStyles.current,
      ...componentStyles
    }
  }

  React.useEffect(() => {
    
    Object.keys(computedStyles).map(key => {

      const css = computedStyles[key];
      dispatch(storeActions.registerStyle({
        css,
        key: key+''
      }))

    });

  }, [updateKey]);

  return classNames;
}


export function Provider<T = Theme>({ 
  theme = defaultTheme as any,
  children
}: { 
  theme: T,
  children: React.ReactNode
}) {

  return (
    <StoreProvider>
      <Context.Provider value={theme}>
        {children}
        <StyleSheet/>
      </Context.Provider>
    </StoreProvider>
  );
}