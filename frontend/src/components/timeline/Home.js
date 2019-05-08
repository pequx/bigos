import React, { Component } from 'react';

import TimelineItems from './Items';
import TimelineNavigation from './Navigation';

import Grid from '@material-ui/core/Grid';

class TimelineHome extends Component {
  render() {
    return (
      <Grid container spacing={24}>
        <TimelineItems />
        <TimelineNavigation />
      </Grid>
    );
  }
}

export default TimelineHome;
