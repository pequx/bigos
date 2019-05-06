import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { actions } from '../../redux/modules/timeline/categories';
import { schema } from '../../constants';

import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Icon from '@material-ui/core/Icon';

const _ = require('lodash');

const propTypes = {
  classes: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  categoriesRefresh: PropTypes.func.isRequired
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
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (!this.props.categories.records) this.props.categoriesRefresh();
  }

  /**
   * @todo: implement dispatch pattern
   */
  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, categories, locale } = this.props;
    const { value } = this.state;
    const { column } = schema.timeline.category;

    return (
      <section className={classes.wrapper}>
        <Helmet>
          <title>Timeline Home</title>
        </Helmet>
        <BottomNavigation
          value={value}
          onChange={this.handleChange}
          showLabels
          className={classes.root}
        >
          {Object.values(categories.records).map((current, index) => {
            const icon = <Icon>favorites</Icon>;
            return (
              <BottomNavigationAction
                key={index}
                label={_.truncate(current[column.name][locale], {
                  length: config.label.truncate.length
                })}
                value={index}
                icon={icon}
              />
            );
          })}
        </BottomNavigation>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    locale: 'ENG',
    categories: state.timelineCategories
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(actions, dispatch)
});

TimelineNavigation.propTypes = propTypes;

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(TimelineNavigation))
);
