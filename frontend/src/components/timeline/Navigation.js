import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { actions as actionsCategories } from '../../redux/modules/timeline/categories';
import { actions as actionsNavigation } from '../../redux/modules/timeline/navigation';
import { schema, routes, labels } from '../../constants';

import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Icon from '@material-ui/core/Icon';

const _ = require('lodash');
const { column } = schema.timeline.category;

const propTypes = {
  classes: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  categoriesRefresh: PropTypes.func.isRequired,
  category: PropTypes.string,
  navigationChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired
};

const config = {
  label: {
    truncate: {
      length: 20
    }
  }
};

const styles = {
  wrapper: {
    width: '100%',
    position: 'fixed',
    bottom: 0
  },
  root: {
    width: '100%'
  }
};

class TimelineNavigation extends Component {
  componentDidMount() {
    const { categories, value, history, categoriesRefresh, navigationChange } = this.props;

    if (categories.total > 0) {
      if (value !== 'all') {
        history.push(`${routes.timeline.home}/${value}`);
      }
      if (value === 'all') {
        history.push(`${routes.timeline.home}`);
      }
      if (!value) {
        navigationChange(false, 'all');
      }
    }
    if (categories.total === 0) {
      categoriesRefresh();
    }
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    const value = nextProps.value;

    if (this.props.value !== value) {
      nextProps.history.push(
        value === 'all' ? routes.timeline.home : `${routes.timeline.home}/${value}`
      );
    }
  }

  render() {
    const { classes, categories, locale, navigationChange, value } = this.props;

    const tabs = Object.values(categories.records).map((current, index) => {
      const icon = <Icon>favorites</Icon>;

      return (
        <BottomNavigationAction
          key={index}
          label={_.truncate(current[column.description][locale], {
            length: config.label.truncate.length
          })}
          showLabel={true}
          value={current[column.name]}
          icon={icon}
        />
      );
    });

    tabs.unshift(
      <BottomNavigationAction
        key={tabs.length}
        label={_.truncate(labels.timeline.navigation.all[locale], {
          length: config.label.truncate.length
        })}
        showLabel={true}
        value="all"
      />
    );

    return (
      <section className={classes.wrapper}>
        <Helmet>
          <title>Timeline Home</title>
        </Helmet>
        <BottomNavigation
          value={value}
          onChange={navigationChange}
          showLabels={true}
          className={classes.root}
        >
          {tabs}
        </BottomNavigation>
      </section>
    );
  }
}

const mapStateToProps = ({ timelineCategories, timelineNavigation }, ownProps) => {
  return {
    locale: 'ENG',
    categories: timelineCategories,
    value: timelineNavigation.value
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(_.merge(actionsNavigation, actionsCategories), dispatch)
});

TimelineNavigation.propTypes = propTypes;

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(TimelineNavigation))
);
