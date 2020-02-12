import * as React from 'react';
import { Header } from '../navigation';
import { ScrollView, View, Button, TextInput, Slider, Switch } from 'react-native';
import { useStyleCreator, makeStyleCreator } from 'react-context-theming/native';
import { useTheme, Provider as ThemeProvider, defaultTheme, colors } from 'react-context-theming';
const darkTheme = {
    ...defaultTheme,
    colors: {
        ...defaultTheme.colors,
        primary: '#000',
        accent: colors.pink[300],
        background: '#111',
        text: '#fff',
        divider: '#333'
    },
    dark: true
};
function BasicUsage() {
    const { colors, dark } = useTheme();
    const styles = useStyleCreator(styleCreator);
    const [switchValue, setSwitchValue] = React.useState(false);
    return (React.createElement(React.Fragment, null,
        React.createElement(Header, null),
        React.createElement(ScrollView, { style: styles.container, indicatorStyle: dark ? 'white' : 'black' },
            React.createElement(Button, { color: colors.accent, title: 'StyledButton', onPress: () => alert('button!') }),
            React.createElement(View, { style: styles.spacer }),
            React.createElement(TextInput, { style: styles.input }),
            React.createElement(View, { style: styles.spacer }),
            React.createElement(View, { style: styles.divider }),
            React.createElement(View, { style: styles.spacer }),
            React.createElement(Slider, { minimumTrackTintColor: colors.accent, maximumTrackTintColor: colors.divider }),
            React.createElement(View, { style: styles.spacer }),
            React.createElement(Switch, { style: styles.switch, value: switchValue, onValueChange: setSwitchValue, trackColor: {
                    true: colors.accent,
                    false: ''
                } }))));
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
export default () => (React.createElement(ThemeProvider, { theme: darkTheme },
    React.createElement(BasicUsage, null)));
