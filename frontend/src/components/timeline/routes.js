import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TimelineHome from './Home';
import EnsureAuthenticated from '../EnsureAuthenticated';

import { routes } from '../../constants';

const { timeline } = routes;

export default () => (
  <Switch>
    <Route path={timeline.home} component={TimelineHome} />
    <EnsureAuthenticated>
      <Route path="/account/settings" component={TimelineHome} />
    </EnsureAuthenticated>
  </Switch>
);
