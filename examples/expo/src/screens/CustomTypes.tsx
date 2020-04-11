import * as React from 'react';
import { Header } from '../navigation';
import { ScrollView, View, Button, TextInput, Text, Slider, Switch, Image, StyleSheet } from 'react-native';
import * as Theming from 'react-context-theming';
import * as NativeThemeing from 'react-context-theming/native';

type Theme =  {
  colors: {
    primary: string,
    accent: string,
    divider: string,
    background: string,
    surface: string
  }
}

const theme: Theme = {
  colors: {
    primary: Theming.colors.deepPurple[500],
    accent: Theming.colors.deepPurple[500],
    divider: Theming.colors.grey[300],
    background: Theming.colors.grey[100],
    surface: '#fff'
  }
}

/**
 * Wrapping these functions allows you
 * to reexport them so you don't need 
 * to pass your custom theme type into 
 * every file in your project
 */
const useTheme = (): Theme => Theming.useTheme<Theme>();
function makeStyleCreator<
  T = Theme, 
  S extends StyleSheet.NamedStyles<S> | StyleSheet.NamedStyles<any> = never
>(
  styleFn: NativeThemeing.StyleCreatorFunction<T, S> | NativeThemeing.GenerateStylesFunction<T, S>
): NativeThemeing.GenerateStylesFunction<T, S> {
  return NativeThemeing.makeStyleCreator<T, S>(styleFn);
}

function useStyleCreator<
  T = Theme, 
  S = never
>(
  styleFn: NativeThemeing.GenerateStylesFunction<T, S>,
  ...extraData: any[]
) {
  return NativeThemeing.useStyleCreator<T, S>(styleFn, ...extraData)
};


function TypeScript() {
  const {colors} = useTheme();
  const styles = useStyleCreator(styleCreator);
  const [switchValue, setSwitchValue] = React.useState(false);

  return (
    <>
      <Header/>
      <ScrollView 
        style={styles.container}
        indicatorStyle='black'
      >
        
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

const styleCreator = makeStyleCreator(theme => ({
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
    padding: 10
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
    textAlign: 'center'
  }
}));

export default () => (
  <Theming.Provider<Theme> theme={theme}>
    <TypeScript/>
  </Theming.Provider>
);