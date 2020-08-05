import React from 'react';
import { makeStyleCreator, useStyleCreatorClassNames } from 'react-context-theming/web';
import Link from 'next/link';


export default function Home() {
  const classes = useStyleCreatorClassNames(styleCreator);
  return (
    <>
      <Link href='/'>
        <a>
          page2
        </a>
      </Link>
      <div className={classes.box} />
    </>
  )
}

const styleCreator = makeStyleCreator(theme => ({
  box: {
    height: 100,
    width: 100,
    backgroundColor: '#f00'
  }
}))