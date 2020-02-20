import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Provider, defaultTheme, useTheme, withTheme, WithTheme, Context, Theme } from '../index';

describe('context', () => {

  it('useTheme', () => {
    let theme;
    function ReadTheme() {
      theme = useTheme();
      return null;
    }

    renderer.create(
      <Provider theme={defaultTheme}>
        <ReadTheme/>
      </Provider>
    ).toJSON();
    expect(theme).toBe(defaultTheme);
  });

  it('withTheme', () => {
    let theme;
    const ReadTheme = withTheme((props: WithTheme) => {
      theme = props.theme;
      return null;
    });

    renderer.create(
      <Provider theme={defaultTheme}>
        <ReadTheme/>
      </Provider>
    ).toJSON();
    expect(theme).toBe(defaultTheme);
  });

  it('Context', () => {
    let theme;
    class ReadTheme extends React.Component<{context?: Theme}> {
      static contextType = Context;
      render() {
        theme = this.context;
        return null;
      }
    }

    renderer.create(
      <Context.Provider value={defaultTheme}>
        <ReadTheme/>
      </Context.Provider>
    ).toJSON();
    expect(theme).toBe(defaultTheme);
  });

});