import React from 'react';
import NextApp from 'next/app';
import { Provider as ThemeProvider } from 'react-context-theming/web';
import { defaultTheme } from 'react-context-theming';

class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={defaultTheme}>
        <Component {...pageProps}/>
      </ThemeProvider>
    );
  }
}

export default App;