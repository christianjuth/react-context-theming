import React from 'react';
import { makeStyleCreator, useStyleCreatorClassNames } from 'react-context-theming/web';
import Link from 'next/link';


export default function Home() {
  const [color, setColor] = React.useState('#f00');
  const classes = useStyleCreatorClassNames(styleCreator, color);

  console.log(color)

  React.useEffect(() => {
    setTimeout(() => {
      setColor('#0f0');
    }, 1000); 
  }, []);

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

const styleCreator = makeStyleCreator((theme, color: string) => ({
  box: {
    height: 100,
    width: 100,
    backgroundColor: color
  }
}))