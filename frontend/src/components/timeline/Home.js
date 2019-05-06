import React, { Component } from 'react';

import TimelineItems from './Items';
import TimelineNavigation from './Navigation';

import Grid from '@material-ui/core/Grid';

class TimelineHome extends Component {
  render() {
    const { match } = this.props;
    return (
      <Grid container spacing={24}>
        <TimelineItems />
        <TimelineNavigation category={match.params.category ? match.params.category : null} />
      </Grid>
    );
  }
}

export default TimelineHome;
