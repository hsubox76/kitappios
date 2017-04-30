import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import firebaseApp from '../api/firebase';

import MainApp from './MainApp';
import Login from './Login';
import * as Actions from '../actions';

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToActions(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

class Main extends Component {
  constructor() {
    super();
    this.state = {
      authChecked: false
    };
  }
  componentWillMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.actions.setUser(user);
      } else {
        this.props.actions.setUser(null);
      }
      this.setState({ authChecked: true });
    });
  }
  render() {
    return this.props.user ? <MainApp /> : <Login authChecked={this.state.authChecked} />;
  }
}

Main.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func),
  user: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToActions)(Main);
