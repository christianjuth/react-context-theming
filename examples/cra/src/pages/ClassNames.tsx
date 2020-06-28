import * as React from 'react';
import { Provider as ThemeProvider, defaultTheme } from 'react-context-theming';
import { makeStyleCreator, useStyleCreatorClassNames } from 'react-context-theming/web';

function ClassNames() {
  const classes = useStyleCreatorClassNames(styleCreator);
  return (
    <div className={classes.container}>
      <h1 className={classes.text}>Class Names</h1>
      <div className={classes.square}/>
      <div className={classes.circle}/>
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
    color: '#f00',
    fontSmoothing: 'auto',
    display: 'flex'
  },
  square: {
    height: 150,
    width: 150,
    backgroundColor: '#f00',
    marginBottom: 20
  },
  circle: {
    height: 150,
    width: 150,
    backgroundColor: '#0f0',
    borderRadius: '100%'
  }
}));


export default () => (
  <ThemeProvider theme={defaultTheme}>
    <ClassNames/>
  </ThemeProvider>
);