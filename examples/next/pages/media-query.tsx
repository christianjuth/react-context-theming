import React from 'react';
import { makeStyleCreator, useStyleCreator, useClassNameGenerator } from 'react-context-theming/web';
import Link from 'next/link';


export default function Home() {
  const styles = useStyleCreator(styleCreator);
  const cg = useClassNameGenerator();

  return (
    <>
      <div className={cg(styles.box)}>
        {cg(styles.box)}
      </div>
      <div className={cg(styles.box2)}>
        {cg(styles.box2)}
      </div>
    </>
  )
}

const styleCreator = makeStyleCreator(theme => ({
  box: {
    height: 100,
    width: 100,
    backgroundColor: '#f00',
    [theme.mediaQuery('lg')]: {
      backgroundColor: '#0f0'
    }
  },
  box2: {
    [theme.mediaQuery('lg')]: {
      backgroundColor: '#00f'
    },
    height: 80,
    width: 80,
    backgroundColor: '#999'
  }
}))