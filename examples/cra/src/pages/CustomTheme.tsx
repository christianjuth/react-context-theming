import * as React from 'react';
import { Provider as ThemeProvider, defaultTheme, useTheme, colors } from 'react-context-theming';
import { makeStyleCreator, useStyleCreator } from 'react-context-theming/web';
import { Button } from '../components';

const darkTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: '#000',
    accent: colors.pink[300],
    background: '#111',
    text: '#fff',
    divider: '#333',
    surface: '#000'
  },
  dark: true
};

function FunctionComponents() {
  const styles = useStyleCreator(styleCreator);
  const {colors} = useTheme();
  return (
    <div style={styles.container}>
      <h1 style={styles.text}>Custom Theme</h1>
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
  <ThemeProvider theme={darkTheme}>
    <FunctionComponents/>
  </ThemeProvider>
);