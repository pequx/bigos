import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

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

const mapStateToProps = state => {
  return {};
};
const mapDispatchToProps = dispatch => {
  return {};
};

TimelineHome.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineHome);
