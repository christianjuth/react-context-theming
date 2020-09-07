import React from 'react';
import { makeStyleCreator, useStyleCreator, useClassNameGenerator } from 'react-context-theming/web';

function getAvg(times: number[]) {
  const total = times.reduce((acc, c) => acc + c, 0);
  return total / times.length;
}

function Box() {
  const styles = useStyleCreator(styleCreator);
  // const context = React.useContext(Context);

  // let t0 = 0;
  // if(typeof window !== 'undefined') {
  //   t0 = performance.now();
  // }
  
  // let t1 = 0;
  // if(typeof window !== 'undefined') {
  //   t1 = performance.now();
  // }

  // const diff = t1 - t0;

  const cg = useClassNameGenerator();
  const className = cg(styles.box);

  return (
    <div 
      className={className}
    >
    </div>
  )
}

const Context = React.createContext<{
  times: number[]
}>({
  times: []
});

export default function Page() {
  const arr = Array.from({ length: 100 }, (_, i) => i);
  return (
    <Context.Provider value={{ times: [] }}>
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
      {/* <Context.Consumer>
        {({times}) => (
          <p>Avg time: {getAvg(times)}</p>
        )}
      </Context.Consumer> */}
    </Context.Provider>
  )
}

const styleCreator = makeStyleCreator(theme => ({
  box: {
    height: 200,
    width: 200,
    margin: 5,
    backgroundColor: theme.colors.primary,
    ':hover': {
      backgroundColor: '#00f'
    }
  }
}))