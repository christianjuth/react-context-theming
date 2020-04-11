import * as React from 'react';
import * as Theming from 'react-context-theming';
import * as WebTheming from 'react-context-theming/web';
import { Button } from '../components';

type Theme =  {
  colors: {
    primary: string,
    accent: string,
    divider: string,
    background: string,
    surface: string,
    text: string
  }
}
  
const theme: Theme = {
  colors: {
    primary: Theming.colors.deepPurple[500],
    accent: Theming.colors.deepPurple[500],
    divider: Theming.colors.grey[300],
    background: Theming.colors.grey[100],
    surface: '#fff',
    text: '#000'
  }
}
  
/**
 * Wrapping these functions allows you
 * to reexport them so you don't need 
 * to pass your custom theme type into 
 * every file in your project
 */
const useTheme = (): Theme => Theming.useTheme<Theme>();
function makeStyleCreator<
  T = Theme, 
  S extends WebTheming.NamedStyles<S> | WebTheming.NamedStyles<any> = never
>(
  styleFn: WebTheming.StyleCreatorFunction<T, S> | WebTheming.GenerateStylesFunction<T, S>
): WebTheming.GenerateStylesFunction<T, S> {
  return WebTheming.makeStyleCreator<T, S>(styleFn);
}

function useStyleCreator<
  T = Theme, 
  S = never
>(
  styleFn: WebTheming.GenerateStylesFunction<T, S>,
  ...extraData: any[]
) {
  return WebTheming.useStyleCreator<T, S>(styleFn, ...extraData)
};

function CustomTypes() {
  const styles = useStyleCreator(styleCreator);
  const {colors} = useTheme();

  return (
    <div style={styles.container}>
      <h1 style={styles.text}>TypeScript</h1>
      <Button color={colors.accent}>Button</Button>
    </div>
  );
}

const styleCreator = makeStyleCreator(theme => ({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background
  },
  text: {
    color: theme.colors.text
  }
}));

export default () => (
  <Theming.Provider theme={theme}>
    <CustomTypes/>
  </Theming.Provider>
);