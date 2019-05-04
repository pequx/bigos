import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { actions } from '../../redux/modules/timeline/items';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
});

class TimelineItems extends Component {
  /**
   * @todo: make it safe
   */
  UNFSAFE_componentWillMount() {
    if (this.props.items.records.length === 0) this.props.itemsRefresh();
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid item xs={10}>
        <Paper className={classes.paper}>test</Paper>
      </Grid>
    );
  }
}

const mapStateToProps = ({ items }, ownProps) => ({ items });

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(actions, dispatch)
});

TimelineItems.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.object.isRequired,
  itemsRefresh: PropTypes.func.isRequired
};

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(TimelineItems)
  )
);
