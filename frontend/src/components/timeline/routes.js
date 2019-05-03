import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Detail from './Detail';
import EnsureAuthenticated from '../EnsureAuthenticated';
import Settings from './Settings';

export default () => (
  <Switch>
    <Route path="/" component={Home} />
    <Route path="/item" component={Detail} />
    <EnsureAuthenticated>
      <Route path="/account/settings" component={Settings} />
    </EnsureAuthenticated>
  </Switch>
);
