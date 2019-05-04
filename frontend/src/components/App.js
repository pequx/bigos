import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { actions } from '../redux/modules/account';

import Navigation from './Navigation';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      burgerOpen: false
    };
    // this.addBurgerOpenClass = this.addBurgerOpenClass.bind(this);
  }

  // addBurgerOpenClass(classes) {
  //   const { burgerOpen } = this.state;
  //   if (burgerOpen) {
  //     classes = [...classes, 'is-active'];
  //   }
  //   return classes.join(' ');
  // }

  render() {
    const {
      props
      // state: { burgerOpen }
    } = this;

    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="view" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        </Helmet>
        <Navigation />
        {props.children}
      </div>
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

App.propTypes = {
  children: PropTypes.object
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
