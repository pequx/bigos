import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { actions } from '../../redux/modules/timeline/categories';
import { schema, routes } from '../../constants';
import history from '../../history';

import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Icon from '@material-ui/core/Icon';

const _ = require('lodash');

const propTypes = {
  classes: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  categoriesRefresh: PropTypes.func.isRequired,
  category: PropTypes.string
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
      // value: (props => {
      //   const { params } = props.match;
      //   const { category } = schema.timeline;
      //   const first = 0;
      //
      //   if (_.isString(params.category)) {
      //     const match = params.category
      //       ? _.find(props.categories.records, [category.column.name, params.category])
      //       : false;
      //     return match ? match[category.column.id] - 1 : first;
      //   }
      //   if (_.isNumber(params.category)) {
      //     return params.category;
      //   }
      //   return first;
      // })(props)
      value: props.match.params.category
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    /**
     * @todo: implement a timeout validation for the cached items.
     */
    this.props.categoriesRefresh();
  }

  /**
   * @todo: implement dispatch pattern
   */
  handleChange = (event, value) => {
    this.setState({ value });
    history.push(`${routes.timeline.category.home}/${value}`);
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
          showLabels={true}
          className={classes.root}
        >
          {Object.values(categories.records).map((current, index) => {
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
          })}
        </BottomNavigation>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    locale: 'ENG',
    categories: state.timelineCategories,
    value: false
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
