import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { actions } from '../../redux/modules/timeline/items';
import { schema } from '../../constants';

import Timeline from 'react-visjs-timeline';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Loader from '../../components/Loader';

const _ = require('lodash');

const propTypes = {
  itemsRefresh: PropTypes.func.isRequired,
  items: PropTypes.object.isRequired,
  category: PropTypes.object
};

const config = {
  timeline: {
    width: '100%',
    height: '200px',
    min: false,
    max: _.now(),
    zoomMin: Number('7.884e+9'),
    zoomMax: 315360000000000,
    autoResize: true
  }
};

class TimelineItems extends Component {
  componentDidMount() {
    const { props } = this;
    const { match } = props;
    const { column } = schema.timeline.category;

    if (match.params.category) props.itemsRefresh({ [column.name]: match.params.category });
    if (!match.params.category) props.itemsRefresh();
  }

  // componentWillUpdate(nextProps, nextState, nextContext) {
  //   const { category, itemsRefresh, match } = this.props;
  //   const { params } = match;
  //   const { column } = schema.timeline.category;
  //
  //   if (_.isObject(category)) {
  //     if (_.isObject(nextProps.category)) {
  //       if (nextProps.category[column.id] !== category[column.id] && _.isString(params.category)) {
  //         itemsRefresh({ [column.name]: nextProps.category[column.name] });
  //       }
  //     }
  //     if (_.isNil(nextProps.category) && _.isNil(nextProps.match.params.category)) {
  //       itemsRefresh();
  //     }
  //   }
  //
  //   if (_.isNil(category)) {
  //     if (_.isString(nextProps.match.params.category)) {
  //       itemsRefresh({ [column.name]: nextProps.category[column.name] });
  //     }
  //   }
  // }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   const { category, itemsRefresh, match } = this.props;
  //   const { column } = schema.timeline.category;
  //
  //   if (_.isNil(match.params.category) && _.isNil(category)) {
  //     itemsRefresh();
  //   }
  //
  //   if (
  //     _.isNil(prevProps.category) &&
  //     _.isObject(category) &&
  //     match.params.category === category[column.name]
  //   ) {
  //     itemsRefresh({ [column.name]: category[column.name] });
  //   }
  // }

  componentWillUpdate(nextProps, nextState, nextContext) {
    const { column } = schema.timeline.category;
    const { category } = nextProps;

    if (category[column.name] !== this.props.category[column.name]) {
      this.props.itemsRefresh({ [column.name]: category[column.name] });
    }

    if (!category) {
      this.props.itemsRefresh();
    }
    return true;
  }

  render() {
    const { props } = this;
    let { records } = props.items;

    if (_.size(records) > 0) {
      const { column } = schema.timeline.item;

      records = _.sortBy(records, column.start);

      config.timeline.min = _.first(records)[column.start];
      config.timeline.max = _.last(records)[column.start];

      records = (records =>
        Object.values(records).map(current => ({
          id: current[column.id],
          content: current[column.content][props.locale],
          start: current[column.start],
          end: current[column.end]
        })))(records);

      return (
        <Grid item xs={12}>
          <Paper>
            <Timeline options={config.timeline} items={records} />
          </Paper>
        </Grid>
      );
    }

    return <Loader />;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    items: state.timelineItems,
    category: _.find(state.timelineCategories.records, [
      schema.timeline.category.column.name,
      state.timelineNavigation.value
    ]),
    locale: 'ENG'
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
