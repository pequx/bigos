import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { routes, labels } from '../constants';
import { actions } from '../redux/modules/navigation';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';

const _ = require('lodash');

const propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  locale: PropTypes.string.isRequired,
  user: PropTypes.object
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

function LinkTab(props) {
  return (
    <Tab component={NavLink} onClick={event => event.preventDefault()} to={props.href} {...props} />
  );
}

class Navigation extends Component {
  componentDidMount() {
    const { value, location, navigationChange, history } = this.props;

    if (!value) {
      switch (location.pathname) {
        case routes.home:
          navigationChange(false, 0);
          break;
        case routes.timeline.home:
          navigationChange(false, 1);
          break;
        default:
          navigationChange(false, 0);
          break;
      }
    }

    if (_.isNumber(value)) {
      switch (value) {
        case 0:
          history.push(routes.home);
          break;
        case 1:
          history.push(routes.timeline.home);
          break;
        default:
          history.push(routes.home);
          break;
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { value, history } = this.props;

    if (_.isNumber(prevProps.value) && _.isNumber(value)) {
      if (prevProps.value !== value) {
        switch (value) {
          case 0:
            history.push(routes.home);
            break;
          case 1:
            history.push(routes.timeline.home);
            break;
          default:
            history.push(routes.home);
            break;
        }
      }
    }
  }

  render() {
    try {
      const { classes, value, locale, navigationChange } = this.props;

      return (
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <NoSsr>
              <div className={classes.root}>
                <AppBar position="static">
                  <Tabs variant="fullWidth" value={value} onChange={navigationChange}>
                    <LinkTab label={labels.home[locale]} href={routes.home} />
                    <LinkTab label={labels.timeline.home[locale]} href={routes.timeline.home} />
                  </Tabs>
                </AppBar>
              </div>
            </NoSsr>
          </Grid>
        </Grid>
      );
    } catch (error) {
      return <div>{error}</div>;
    }
  }
}

const mapStateToProps = ({ navigation }, ownProps) => {
  return {
    locale: 'ENG',
    value: navigation.value
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(actions, dispatch)
});

Navigation.propTypes = propTypes;

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Navigation)
  )
);
