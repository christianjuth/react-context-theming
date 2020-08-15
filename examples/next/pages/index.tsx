import React from 'react';
import { makeStyleCreator, useStyleCreator, useClassGenerator } from 'react-context-theming/web';
import Link from 'next/link';

function Box({
  style
}: {
  style?: React.CSSProperties
}) {
  const styles = useStyleCreator(styleCreator);
  const cg = useClassGenerator();
  return (
    <div 
      className={cg({
        ...styles.redBox,
        ...style
      })}
    />
  )
}

export default function Page() {
  const styles = useStyleCreator(styleCreator);
  const cg = useClassGenerator();
  return (
    <>
      <Link href='/page2'>
        <a>
          page2
        </a>
      </Link>
      <div
        className={cg({
          ...styles.blueBox,
          ...styles.greenBox
        })}
      />
      <div
        className={cg({
          ...styles.blueBox,
          ...styles.greenBox
        })}
      />
      <Box
        style={styles.blueBox}
      />
      <input/>
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