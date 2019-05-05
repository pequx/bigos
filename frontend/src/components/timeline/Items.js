import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { actions } from '../../redux/modules/timeline/items';

// import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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

  render() {
    return (
      <Grid item xs={10}>
        <Paper>{JSON.stringify(this.props.items)}</Paper>
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

TimelineItems.propTypes = propTypes;

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TimelineItems)
);
