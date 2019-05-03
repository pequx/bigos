import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { actions } from '../redux/modules/account';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

function LinkTab(props) {
  return (
    <Tab component={NavLink} to={props.href} onClick={event => event.preventDefault()} {...props} />
  );
}

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const {
      props,
      state: { value }
    } = this;
    const { classes } = props;

    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <NoSsr>
            <div className={classes.root}>
              <AppBar position="static">
                <Tabs variant="fullWidth" value={value} onChange={this.handleChange}>
                  <LinkTab label="Home" href="/" />
                  {props.user && <LinkTab label="Products" href="/products" />}
                </Tabs>
              </AppBar>
            </div>
          </NoSsr>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state, { location }) => ({
  location,
  user: state.account.user
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  logout: () => dispatch(actions.logout())
});

Navigation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Navigation)
  )
);
