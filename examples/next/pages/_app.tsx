import React from 'react';
import { AppProps } from 'next/app';
import { Provider as ThemeProvider } from 'react-context-theming/web';
import { defaultTheme } from 'react-context-theming';

function App({
  Component, 
  pageProps
}: AppProps) {
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

export function reportWebVitals(metric: any) {
  console.log(metric)
}

export default App;