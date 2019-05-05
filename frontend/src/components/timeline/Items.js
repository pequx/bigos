import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { actions } from '../../redux/modules/timeline/items';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Loader from '../../components/Loader';

const propTypes = {
  itemsRefresh: PropTypes.func.isRequired,
  items: PropTypes.object.isRequired
};

// const styles = theme => ({
//   paper: {
//     padding: theme.spacing.unit * 2,
//     textAlign: 'center',
//     color: theme.palette.text.secondary
//   }
// });

class TimelineItems extends Component {
  componentDidMount() {
    if (!this.props.items.records) this.props.itemsRefresh();
  }

  componentWillUpdate() {
    if (this.props.items.records) this.props.itemsRefresh();
  }

  render() {
    return this.props.items.records !== false ? (
      <Grid item xs={12}>
        <Paper>{JSON.stringify(this.props.items)}</Paper>
      </Grid>
    ) : (
      <Grid item xs={12}>
        <Loader />
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    items: state.timelineItems
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(actions, dispatch)
});

TimelineItems.propTypes = propTypes;

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TimelineItems)
);
