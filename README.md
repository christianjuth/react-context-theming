This is an alpha release! The API of this library will likely change a little. My goal is to design a theme library that is very customizable, and independent of any component libraries.

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

### Colors

```jsx
import { colors } from 'react-context-theming';

let theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    // set primary to red material pallet
    primary: colors.red
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

### TypeScript

You can override the default types.

```tsx
import { 
  Provider as ThemeProvider, 
  useTheme, 
  themeType,
  defaultTheme
} from 'react-context-theming';

interface customThemeType extends themeType {
  spacing: number
};

let theme = {
  ...defaultTheme,
  spacing: 10
};

function SpacedText(props) {
  let { spacing } = useTheme<customThemeType>();
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
    <ThemeProvider<customThemeType> theme={theme}>
      <SpacedText/>
    </ThemeProvider>
  );
}

export default App;
```