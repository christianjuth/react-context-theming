import React from 'react';
import { makeStyleCreator, useStyleCreator, useClassGenerator } from 'react-context-theming/web';
import Link from 'next/link';

function Box() {
  const styles = useStyleCreator(styleCreator);
  const cg = useClassGenerator();

  return (
    <div 
      className={cg(styles.box)}
    />
  )
}

export default function Page() {
  const arr = Array.from({ length: 1000 }, (_, i) => i);
  return (
    <>
      <Link href='/'>
        <a>
          page2
        </a>
      </Link>
      <div 
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}
      >
        {arr.map(i => (
          <Box key={i}/>
        ))}
      </div>
    </>
  )
}

const styleCreator = makeStyleCreator(theme => ({
  box: {
    height: 100,
    width: 100,
    margin: 5,
    backgroundColor: theme.colors.primary,
    ':hover': {
      backgroundColor: '#00f'
    }
  }
}))