import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Sidebar from './Sidebar';
import * as Screens from '../pages';

export default function App() {
  return (
    <Router>
      <div 
        style={{
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        <Sidebar/>
        <Switch>
          <Route exact path="/">
            <Screens.FunctionComponent/>
          </Route>
          <Route exact path="/class-component">
            <Screens.ClassComponent/>
          </Route>
          <Route exact path="/custom-theme">
            <Screens.CustomTheme/>
          </Route>
          <Route exact path="/typescript">
            <Screens.CustomTypes/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}