import React from 'react';
import { makeStyleCreator, useStyleCreatorClassNames, useStyleCreator } from 'react-context-theming/web';

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

export default function Page() {
  const classes = useStyleCreatorClassNames(styleCreator);
  return (
    <>
      <div
        className={[
          classes.blueBox,
          classes.greenBox
        ].join(' ')}
      />
      <div
        className={[
          classes.blueBox,
          classes.greenBox
        ].join(' ')}
      />
      <Box
        className={classes.blueBox}
      />
    </>
  )
}

const styleCreator = makeStyleCreator(() => ({
  blueBox: {
    height: 100,
    width: 100,
    backgroundColor: '#00f'
  },
  redBox: {
    height: 100,
    width: 100,
    backgroundColor: '#f00'
  },
  greenBox: {
    height: 100,
    width: 100,
    backgroundColor: '#0f0',
    ':first-child': {
      backgroundColor: '#f00'
    },
    ':hover': {
      backgroundColor: '#f00'
    },
    '@media only screen and (max-width: 600px)': {
      width: 200
    }
  }
}))