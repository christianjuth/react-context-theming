import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Sidebar from './Sidebar';
import { FunctionComponent } from '../pages';

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
          <Route path="/">
            <FunctionComponent/>
          </Route>
        </Switch>

      </div>
    </Router>
  );
}