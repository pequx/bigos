import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { actions } from '../redux/modules/account';
import { routes, labels } from '../constants';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';

const propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired,
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
  return <Tab component={NavLink} to={props.href} {...props} />;
}

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * @todo: implement dispatch pattern
   */
  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { props } = this;
    const { classes, value, locale } = props;

    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          {value !== false ? (
            <NoSsr>
              <div className={classes.root}>
                <AppBar position="static">
                  <Tabs variant="fullWidth" value={value} onChange={this.handleChange}>
                    <LinkTab label={labels.home[locale]} href={routes.home} />
                    <LinkTab label={labels.timeline.home[locale]} href={routes.timeline.home} />
                    {props.user && <LinkTab label="Products" href="/products" />}
                  </Tabs>
                </AppBar>
              </div>
            </NoSsr>
          ) : (
            <div>Navigation disabled.</div>
          )}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state, { location }) => ({
  location,
  locale: 'ENG',
  value: (input => {
    const { location, routes } = input;

    if (location.pathname === routes.home) {
      return 0;
    } else if (location.pathname.includes(routes.timeline.home)) {
      return 1;
    }
    return false;
  })({ location, routes }),
  user: state.account.user
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  logout: () => dispatch(actions.logout())
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
