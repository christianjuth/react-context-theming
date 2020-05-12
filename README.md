## React Context Theming

This is an alpha release! The API of this library will likely change a little. 

The purpose of this library is to provide one API that allows you to dynamically theme both React Native Apps (including RN Web) and React.js. I hope that this will make it easier to move between RN and React.js project or even share code between projects. The library is inspired by what I've seen from React Native Paper and Material UI, but decoupled from a component library. **WEB API WILL MOST LIKELY CHANGE**. I would like to have it render styles to class names like `styled-components` and `material-ui`.

## Checklist to Make this library production ready

- [ ] Web Support
  - [ ] Next.js SSR styles
  - [ ] Test performance (check for white flash on page load)
- [ ] React Native Support
  - [x] RN StyleSheet like syntax
  - [x] Use dynamic theming to support dark mode
    - [x] Ios
    - [x] Android
    - [x] RN Web (https://awesome-stonebraker-f3e667.netlify.app/)
- [ ] Docs
  - [ ] Better TypeScript examples 
  - [ ] Add Next.js example app to repo

## Examples

#### Custom Theme

```jsx
import { Provider as ThemeProvider, defaultTheme } from 'react-context-theming';

let theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    text: '#fff',
    background: '#000'
  },
  dark: true,
  roundness: 10,
};

function App() {
  return (
    // if theme is not specified,
    // provider will use to defaultTheme
    <ThemeProvider theme={theme}>
      <StyledText>Hello World!!!</StyledText>
    </ThemeProvider>
  );
}

export default App;
```

#### Similar Syntax to React Native StyleSheet

```jsx
import { useStyleCreator, makeStyleCreator } from 'react-context-theming/lib/native';

function Divider() {
  const styles = useStyleCreator(styleCreator);
  return (
    <View style={styles.divider}/>
  );
}

const styleCreator = makeStyleCreator(theme => ({
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider
  }
}));
```

#### TypeScript

You can override the default types.

```tsx
import { 
  Provider as ThemeProvider, 
  useTheme, 
  Theme
} from 'react-context-theming';

interface Theme {
  spacing: number
};

let theme = {
  spacing: 10
};

function SpacedText(props) {
  let { spacing } = useTheme<Theme>();
  return (
    <div>
      <h1>Item 1</h1>
      <div style={{ height: spacing }}/>
      <h1>Item 1</h1>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider<Theme> theme={theme}>
      <SpacedText/>
    </ThemeProvider>
  );
}

export default App;
```

```jsx
import { Provider as ThemeProvider, defaultTheme } from 'react-context-theming';

let theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    text: '#fff',
    background: '#000'
  },
  dark: true,
  roundness: 10,
};

function App() {
  return (
    // if theme is not specified,
    // provider will use to defaultTheme
    <ThemeProvider theme={theme}>
      <StyledText>Hello World!!!</StyledText>
    </ThemeProvider>
  );
}

export default App;
```
