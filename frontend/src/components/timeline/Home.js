import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { actions } from '../../redux/modules/timeline/items';

import TimelineItems from './Items';

import Grid from '@material-ui/core/Grid';

const propTypes = {};

class TimelineHome extends Component {
  componentDidMount() {
    if (!this.props.items.records) this.props.itemsRefresh();
  }

  render() {
    return (
      <Grid container spacing={24}>
        <Helmet>
          <title>Timeline Home</title>
        </Helmet>
        {JSON.stringify(this.props)}
        <TimelineItems />
      </Grid>
    );
  }
}

const mapStateToProps = (state, { records, total }) => {
  return {
    items: state.timelineItems
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(actions, dispatch)
});

TimelineHome.propTypes = propTypes;
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TimelineHome)
);
