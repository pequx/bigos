import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { actions } from '../../redux/modules/timeline/items';
import { schema } from '../../constants';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Loader from '../../components/Loader';

const _ = require('lodash');

const propTypes = {
  itemsRefresh: PropTypes.func.isRequired,
  items: PropTypes.object.isRequired,
  category: PropTypes.object
};

class TimelineItems extends Component {
  /**
   * @todo: implement a timeout validation for the cached items.
   */
  componentDidMount() {
    const { props } = this;

    if (!props.items.records) props.itemsRefresh();
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    const { props } = this;
    if (nextProps && props.category) {
      const { category } = nextProps.match.params;
      const { column } = schema.timeline.category;

      if (category !== props.category[column.name]) {
        props.itemsRefresh({ [column.name]: category });
      }
    }
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

const mapStateToProps = (state, ownProps) => {
  return {
    items: state.timelineItems,
    category: _.find(state.timelineCategories.records, [
      schema.timeline.category.column.name,
      ownProps.match.params.category
    ])
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
