import * as React from 'react';
import { Header } from '../navigation';
import { ScrollView, View, Button, TextInput, Slider, Switch, Text, Image } from 'react-native';
import { useStyleCreator, makeStyleCreator } from 'react-context-theming/native';
import { useTheme, Provider as ThemeProvider, defaultTheme, colors } from 'react-context-theming';

const lightTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: colors.pink[300],
    accent: colors.pink[300],
    background: colors.grey[100]
  },
};
const darkTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: '#000',
    accent: colors.pink[300],
    background: '#111',
    text: '#fff',
    divider: '#333',
    surface: '#000'
  },
  dark: true
};

function BasicUsage() {
  const {colors, dark} = useTheme();
  const styles = useStyleCreator(styleCreator);
  const dispatch = useDispatch();
  const darkMode = useSelector((s) => s.darkMode);
  const [switchValue, setSwitchValue] = React.useState(false);

  return (
    <>
      <Header/>
      <ScrollView 
        style={styles.container}
        indicatorStyle={dark ? 'white' : 'black'}
      >

        <View style={styles.card}>
          <Text style={styles.text}>
            Toggle Dark Mode!
          </Text>
          <View style={styles.spacer}/>
          <Switch
            style={styles.switch}
            value={darkMode}
            onValueChange={() => dispatch({
              type: TOGGLE_DARK_MODE
            })}
            trackColor={{
              true: colors.accent,
              false: ''
            }}
          />
        </View>

        
        <View style={styles.card}>

          <Text style={styles.text}>
            RN Components
          </Text>

          <View style={styles.spacer}/>
          <Button
            color={colors.accent}
            title='StyledButton'
            onPress={() => {}}
          />

          <View style={styles.spacer}/>
          <Image
            source={require('../assets/icon.png')}
            style={styles.image}
          />

          <View style={styles.spacer}/>
          <TextInput style={styles.input} />

          <View style={styles.spacer}/>
          <Slider
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.divider}
          />

          <View style={styles.spacer}/>
          <Switch
            style={styles.switch}
            value={switchValue}
            onValueChange={setSwitchValue}
            trackColor={{
              true: colors.accent,
              false: ''
            }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.text}>Custom Components</Text>
          <View style={styles.spacer}/>
          <View style={styles.divider}/>
        </View>
        
      </ScrollView>
    </>
  );
}

const styleCreator = makeStyleCreator((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },

  card: {
    backgroundColor: theme.colors.surface,
    padding: 30,
    marginTop: 10
  },

  spacer: {
    height: 20
  },

  image: {
    height: 100,
    width: 100,
    alignSelf: 'center'
  },

  input: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
    padding: 10,
    borderRadius: theme.roundness,
    color: theme.colors.text
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.divider
  },
  
  switch: {
    alignSelf: 'center'
  },

  text: {
    fontSize: 22,
    fontWeight: '600',
    flexDirection: 'row',
    textAlign: 'center',
    color: theme.colors.text
  }
}));


export default function App() {
  return (
    <ReduxProvider>
      <Redux.Consumer>
        {({state}) => (
          <ThemeProvider theme={state.darkMode ? darkTheme : lightTheme}>
            <BasicUsage/>
          </ThemeProvider>
        )}
      </Redux.Consumer>
    </ReduxProvider>
  );
}


// FAKE REDUX!
const Redux = React.createContext<any>({});

const TOGGLE_DARK_MODE = 'TOGGLE_DARK_MODE';

const initialState = {
  darkMode: false
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case TOGGLE_DARK_MODE:
      return {
        ...state,
        darkMode: !state.darkMode
      };
    default:
      return state;
  }
}

function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <Redux.Provider value={{state, dispatch}}>
      {children}
    </Redux.Provider>
  );
}

const useDispatch = () => React.useContext(Redux).dispatch;
const useSelector = (fn: (s: any) => any) => fn(React.useContext(Redux).state);