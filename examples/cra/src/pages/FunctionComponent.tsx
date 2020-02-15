import * as React from 'react';
import { Provider as ThemeProvider, defaultTheme, useTheme } from 'react-context-theming';
import { makeStyleCreator, useStyleCreator } from 'react-context-theming/web';
import { Button } from '../components';

function FunctionComponents() {
  const styles = useStyleCreator(styleCreator);
  const {colors} = useTheme();

  return (
    <div style={styles.container}>
      <h1 style={styles.text}>FunctionComponents</h1>

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
  <ThemeProvider theme={defaultTheme}>
    <FunctionComponents/>
  </ThemeProvider>
);