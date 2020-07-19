import React from 'react';
import { makeStyleCreator, useStyleCreatorClassNames, Provider as ThemeProvider } from 'react-context-theming/web';
import { defaultTheme } from 'react-context-theming';

function Box({
  className
}: {
  className?: string
}) {
  const classes = useStyleCreatorClassNames(styleCreator);
  return (
    <div 
      className={[
        classes.redBox,
        className
      ].join(' ')}
    />
  )
}

function Page() {
  const classes = useStyleCreatorClassNames(styleCreator);
  return (
    <Box
      className={classes.blueBox}
    />
  )
}

export default () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Page/>
    </ThemeProvider>
  )
};

const styleCreator = makeStyleCreator(() => ({
  redBox: {
    height: 100,
    width: 100,
    backgroundColor: '#f00'
  },
  blueBox: {
    height: 100,
    width: 100,
    backgroundColor: '#00f'
  }
}))