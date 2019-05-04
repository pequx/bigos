import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import App from './components/App';
import Products from './components/products/Products';
import Home from './components/Home';
import EnsureAuthenticated from './components/EnsureAuthenticated';
import accountRoutes from './components/account/routes';
import timelineRoutes from './components/timeline/routes';

import NoMatch from './components/NoMatch';

import history from './history';

import { routes } from './constants';

export default () => (
  <Router history={history}>
    <App>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/account" component={accountRoutes} />
        <Route path={routes.timeline.home} component={timelineRoutes} />
        <EnsureAuthenticated>
          <Route path="/products" component={Products} />
        </EnsureAuthenticated>
        <Route component={NoMatch} />
      </Switch>
    </App>
  </Router>
);
