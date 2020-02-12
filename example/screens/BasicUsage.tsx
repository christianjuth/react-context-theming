import * as React from 'react';
import { Header } from '../navigation';
import { ScrollView, View, Button, TextInput, Slider, Switch } from 'react-native';
import { useStyleCreator, makeStyleCreator } from 'react-context-theming/native';
import { useTheme, Provider as ThemeProvider, defaultTheme } from 'react-context-theming';

function BasicUsage() {
  const {colors, dark} = useTheme();
  const styles = useStyleCreator(styleCreator);
  const [switchValue, setSwitchValue] = React.useState(false);

  // const [key, setKey] = React.useState(0);
  // React.useEffect(() => {
  //   const id = setTimeout(() => {
  //     setKey(key+1);
  //   }, 500);
  //   return () => clearTimeout(id);
  // }, [key]);
  // console.log(key);

  return (
    <>
      <Header/>
      <ScrollView 
        style={styles.container}
        indicatorStyle={dark ? 'white' : 'black'}
      >
        <Button
          color={colors.accent}
          title='StyledButton'
          onPress={() => alert('button!')}
        />

        <View style={styles.spacer}/>
        <TextInput style={styles.input} />

        <View style={styles.spacer}/>
        <View style={styles.divider}/>

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
      </ScrollView>
    </>
  );
}

const styleCreator = makeStyleCreator((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 50
  },

  spacer: {
    height: 50
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
  }
}));

export default () => (
  <ThemeProvider theme={defaultTheme}>
    <BasicUsage/>
  </ThemeProvider>
);