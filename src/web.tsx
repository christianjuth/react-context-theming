import * as React from 'react';
import { useTheme, Context, Theme } from './index';
import { 
  processCSS, 
  ObjectKeys, 
  oneTimeWarn, 
  camelCaseStylesToVanillaCSS
} from './utils';
import { defaultTheme, IS_BROWSER, IS_SERVER, VERSION, CLASS_PREFIX } from './constants';
import { useStore, useDispatch, storeActions, StoreProvider } from './web-store';

export type NamedStyles<T> = { 
  [P in keyof T]: React.CSSProperties
};

export type ObjectWithStringKey<Value> = {
  [key: string]: Value
}
export type ComputedStyles = ObjectWithStringKey<string>;

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




export function useClassNameGenerator() {
  const dispatch = useDispatch();
  const { state } = useStore();
  const computedStyles = React.useRef<any>({});
  const serverStyles = React.useContext(ServerStyleSheetContext);
  const requestUpdate = React.useRef(false);

  // register styles
  React.useEffect(() => {

    if (!requestUpdate.current) {
      return;
    }
    
    Object.keys(computedStyles.current).map(className => {

      const css = computedStyles.current[className];
      dispatch(storeActions.registerStyle({
        css,
        key: className+''
      }));

    });

    requestUpdate.current = false;

  });

  return (styles: Record<string, any>) => {
    const styleSheet = camelCaseStylesToVanillaCSS(styles);
    let requestSSR = false;

    // Runtime Styles
    ObjectKeys(styleSheet).map(className => {
  
      const oldCSS = state.styles[className];
      const css = processCSS(styleSheet[className]);

      // Enable SSR only on first render
      if (IS_SERVER && oldCSS === undefined) {
        requestSSR = true;
      }
  
      if (oldCSS !== css) {
        computedStyles.current[className] = css;
        requestUpdate.current = true;
      }
    });

    // SSR Styles
    if (requestSSR && serverStyles) {
      serverStyles.current = {
        ...serverStyles.current,
        ...computedStyles.current
      }
    }

    return Object.keys(styleSheet).join(' ');
  };
}



export function Provider<T = Theme>({ 
  theme = defaultTheme as any,
  children
}: { 
  theme: T,
  children: React.ReactNode
}) {

  // Cleanup after first render
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.querySelectorAll(`[data-name="${CLASS_PREFIX}__ServerStyleSheet"]`).forEach(elm => {
        elm.innerHTML = '';
        elm.setAttribute('data-active', 'false');
      });
    }
  }, []);

  return (
    <StoreProvider>
      <Context.Provider value={theme}>
        <StyleSheet/>
        {children}
      </Context.Provider>
    </StoreProvider>
  );
}

export function StyleSheet() {
  const { state } = useStore();
  const computedStyles = Object.values(state.styles).join(' ');

  return (
    <style 
      type='text/css'
      data-name={`${CLASS_PREFIX}__StyleSheet`}
      data-version={VERSION}
    >
      {computedStyles}
    </style>
  );
}


const ServerStyleSheetContext = React.createContext<{ 
  current: ComputedStyles 
}>({ 
  current: {} 
});

/**
 * This component is used to collect styles durning SSR and
 * emit a stylesheet that can be rendered inside the head tag.
 * 
 * This component is heavily inspired by Styled Components ServerStyleSheet.
 * See https://github.com/styled-components/styled-components/blob/93a00472e3b9bf2974149e9d767e69e56659fbbb/packages/styled-components/src/models/ServerStyleSheet.js
 */
export class ServerStyleSheet {
  styles: {
    current: ComputedStyles
  } = {
    current: {}
  };
  sealed: boolean = false;

  seal() {
    this.sealed = true;
  }

  getStyleElement() {
    const computedStyles = Object.values({
      ...this.styles.current
    }).join(' ');
  
    return (
      <style 
        type='text/css'
        data-name={`${CLASS_PREFIX}__ServerStyleSheet`}
        data-active='true'
        data-version={VERSION}
      >
        {computedStyles}
      </style>
    );
  }

  collectStyles(children: any) {
    if (this.sealed || IS_BROWSER) {
      oneTimeWarn('attempted to collect styles after ServerStyleSheet was sealed.')
      return children;
    }

    return (
      <ServerStyleSheetContext.Provider value={this.styles}>
        {children}
      </ServerStyleSheetContext.Provider>
    );
  }

}