import React, { Component } from 'react';

// import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const propTypes = {};

// const styles = theme => ({
//   paper: {
//     padding: theme.spacing.unit * 2,
//     textAlign: 'center',
//     color: theme.palette.text.secondary
//   }
// });

class TimelineItems extends Component {
  render() {
    return (
      <Grid item xs={10}>
        <Paper>{JSON.stringify(this.props.timelineItems)}</Paper>
      </Grid>
    );
  }
}

TimelineItems.propTypes = propTypes;

export default TimelineItems;
