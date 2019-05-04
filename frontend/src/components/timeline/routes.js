import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Detail from './Detail';
import EnsureAuthenticated from '../EnsureAuthenticated';

import { routes } from '../../constants';

const { timeline } = routes;

export default () => (
  <Switch>
    <Route path={timeline.home} component={Home} />
    <Route path={timeline.detail} component={Detail} />
    <EnsureAuthenticated>
      <Route path="/account/settings" component={Home} />
    </EnsureAuthenticated>
  </Switch>
);
