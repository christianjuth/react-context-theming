import React from 'react';
import { makeStyleCreator, useStyleCreatorClassNames } from 'react-context-theming/web';
import { Provider as ThemeProvider, defaultTheme } from 'react-context-theming'


export default function Home() {
  const classes = useStyleCreatorClassNames(styleCreator);
  return (
    <ThemeProvider theme={defaultTheme}>
      <div className={classes.box}/>
    </ThemeProvider>
  )
}

const styleCreator = makeStyleCreator(theme => ({
  box: {
    height: 100,
    width: 100,
    backgroundColor: '#f00',
    borderBottomColor: 'rgba(0,0,0,0.1)'
  }
}))