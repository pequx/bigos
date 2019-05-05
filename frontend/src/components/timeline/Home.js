import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import TimelineItems from './Items';

import Grid from '@material-ui/core/Grid';

class TimelineHome extends Component {
  render() {
    return (
      <Grid container spacing={24}>
        <Helmet>
          <title>Timeline Home</title>
        </Helmet>
        <TimelineItems />
      </Grid>
    );
  }
}

export default TimelineHome;
