import * as React from 'react';
import { Header } from '../navigation';
import { ScrollView, View, Button, TextInput, Text, Slider, Switch, Image } from 'react-native';
import { withStyleCreator, makeStyleCreator, WithStyleCreator } from 'react-context-theming/native';
import { Provider as ThemeProvider, defaultTheme } from 'react-context-theming';

class ClassComponents extends React.Component<WithStyleCreator> {
  state = {
    switchValue: false
  }

  constructor(props: any) {
    super(props);
    this.handleSwitchToggle = this.handleSwitchToggle.bind(this);
  }

  handleSwitchToggle(val: boolean) {
    this.setState({
      switchValue: val
    });
  }

  render() {
    const {colors, dark} = this.props.theme;
    const styles = this.props.styles;

    return (
      <>
        <Header/>
        <ScrollView 
          style={styles.container}
          indicatorStyle={dark ? 'white' : 'black'}
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
              value={this.state.switchValue}
              onValueChange={this.handleSwitchToggle}
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

const ClassComponentsWithTheme = withStyleCreator(ClassComponents, styleCreator);
export default () => (
  <ThemeProvider theme={defaultTheme}>
    <ClassComponentsWithTheme/>
  </ThemeProvider>
);