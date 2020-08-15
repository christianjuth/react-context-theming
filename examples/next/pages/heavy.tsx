import React from 'react';
import { makeStyleCreator, useStyleCreatorClassNames } from 'react-context-theming/web';
import Link from 'next/link';

function Box() {
  const classes = useStyleCreatorClassNames(styleCreator);
  return (
    <div 
      className={[
        classes.box
      ].join(' ')}
    />
  )
}

export default function Page() {
  const arr = Array.from({ length: 100 }, (_, i) => i);
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

const styleCreator = makeStyleCreator(() => ({
  box: {
    height: 100,
    width: 100,
    margin: 5,
    backgroundColor: '#000',
    ':hover': {
      backgroundColor: '#f00'
    }
  }
}))