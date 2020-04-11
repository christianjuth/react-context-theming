import * as React from 'react';
import { Provider as ThemeProvider, defaultTheme } from 'react-context-theming';
import { makeStyleCreator, withStyleCreator, WithStyleCreator } from 'react-context-theming/web';
import { Button } from '../components';

class ClassComponent extends React.Component<WithStyleCreator> {
  render() {
    const {styles, theme} = this.props;
    const {colors} = theme;
    return (
      <div style={styles.container}>
        <h1 style={styles.text}>Class Component</h1>
        <Button color={colors.accent}>Button</Button>
      </div>
    );
  }
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

const WrappedComponent = withStyleCreator(ClassComponent, styleCreator);
export default () => (
  <ThemeProvider theme={defaultTheme}>
    <WrappedComponent/>
  </ThemeProvider>
);