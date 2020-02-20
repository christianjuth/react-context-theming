import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { View } from 'react-native';
import { Provider, defaultTheme, Theme } from '../index';
import { makeStyleCreator, useStyleCreator, withStyleCreator, WithStyleCreator } from '../native';

describe('native', () => {

  it('makeStyleCreator', () => {
    const styleCreator = makeStyleCreator(theme => ({
      container: {
        flex: 1,
        backgroundColor: theme.colors.background
      }
    }));
    expect(styleCreator(defaultTheme)).toMatchSnapshot();
  });

  it('useStyleCreator', () => {
    const styleCreator = makeStyleCreator(theme => ({
      foo: {
        height: 100,
        width: 100,
        backgroundColor: theme.colors.primary
      }
    }));

    function Foo() {
      const styles = useStyleCreator(styleCreator);
      return <View style={styles.foo}/>;
    }

    const result = renderer.create(
      <Provider theme={defaultTheme}>
        <Foo/>
      </Provider>
    ).toJSON();

    expect(result).toMatchSnapshot();
  });

  it('withStyleCreator', () => {
    const styleCreator = makeStyleCreator(theme => ({
      foo: {
        height: 100,
        width: 100,
        backgroundColor: theme.colors.primary
      }
    }));

    let theme;
    class Foo extends React.Component<WithStyleCreator> {
      render() {
        theme = this.props.theme;
        return <View style={this.props.styles.foo}/>;
      }
    }
    const FooWithStyleCreator = withStyleCreator(Foo, styleCreator);

    const result = renderer.create(
      <Provider theme={defaultTheme}>
        <FooWithStyleCreator/>
      </Provider>
    ).toJSON();

    expect(result).toMatchSnapshot();
    expect(theme).toBe(defaultTheme);
  });

});