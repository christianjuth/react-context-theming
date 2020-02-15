This is an alpha release! The API of this library will likely change a little. 

This library supports ReactJS and React Native! My goal is to design a theme library that is very customizable and independent of any component libraries.

### Basic Usage

```jsx
import { Provider as ThemeProvider, useTheme } from 'react-context-theming';

function StyledText(props) {
  let { colors } = useTheme();
  return (
    <Text 
      style={[{ color: colors.text }, props.style]}
      {...props}
    />
  );
};

function App() {
  return (
    <ThemeProvider>
      <StyledText>Hello World!!!</StyledText>
    </ThemeProvider>
  );
}

export default App;
```

### Custom Theme

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
    <ThemeProvider theme={theme}>
      <StyledText>Hello World!!!</StyledText>
    </ThemeProvider>
  );
}

export default App;
```

### Similar Syntax to React Native StyleSheet

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

### TypeScript

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