import React from 'react';
import NextApp from 'next/app';
import { Provider as ThemeProvider } from 'react-context-theming/web';
import { defaultTheme } from 'react-context-theming';
// import { StyleSheet } from 'react-context-theming/web';

class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider 
        theme={{
          ...defaultTheme,
          colors: {
            ...defaultTheme.colors,
            // primary: '#f00'
          }
        }}
      >
        <Component {...pageProps}/>
      </ThemeProvider>
    );
  }
}

export default App;