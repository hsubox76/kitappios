import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { AppState, AlertIOS, PushNotificationIOS } from 'react-native';
import TabView from 'react-native-scrollable-tab-view';

import Upcoming from './Upcoming';
import Contacts from './Contacts';
import Settings from './Settings';
import TabBar from './TabBar';
import * as Actions from '../actions';

PushNotificationIOS.getInitialNotification().then(function (notification) {
  if (notification !== null) {
    console.warn('opened by notification');
  }
});

function mapStateToProps(state) {
  return {
    hasUnsavedChanges: state.ui.hasUnsavedChanges,
    // currentPageIndex: state.ui.currentPageIndex,
    desiredPageIndex: state.ui.desiredPageIndex
  };
}

function mapDispatchToActions(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

class MainApp extends Component {
  constructor() {
    super();
    this.state = {
      page: 0,
      notification: null,
      backgroundNotification: null
    };
  }
  componentWillMount() {
    this.props.actions.fetchStoreFromStorage();
    PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification.bind(this));

    AppState.addEventListener('change', (newState) => {
      if (newState === 'active' && this.state.backgroundNotification !== null) {
        this.setState({ backgroundNotification: null });
      }
    });

    PushNotificationIOS.requestPermissions();
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotification);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasUnsavedChanges) {
      this.props.actions.writeStoreToStorage();
    }
  }

  navigateToEvent(id) {
    this.props.actions.setNavigationDestination(0, [{ index: 0, from: 'navigator' }, {
      title: 'event',
      index: 1,
      event: { index: parseInt(id, 10) }
    }]);
  }

  _onLocalNotification(notification){
    const id = notification.getData().id;
    if (AppState.currentState === 'background') {
      this.setState({ backgroundNotification: notification });
      this.navigateToEvent(id);
    } else {
      // Alert if in app
      AlertIOS.alert(
        'Local Notification Received',
        'Alert message: ' + notification.getMessage() + ' ID: ' + id,
        [{
          text: 'Dismiss',
          onPress: () => this.navigateToEvent(id),
        }]
      );
    }
  }

  render() {
    const pageIndex = !_.isUndefined(this.props.desiredPageIndex) ? this.props.desiredPageIndex : null;
    const self = this;
    return (
      <TabView
        initialPage={0}
        page={pageIndex}
        renderTabBar={() => <TabBar />}
        onChangeTab={(page) => {
          self.props.actions.setPageIndex(page.i);
          
        }}
      >
        <Upcoming tabLabel="clock" />
        <Contacts tabLabel="torsos" />
        <Settings tabLabel="widget" />
      </TabView>
    );
  }
}

MainApp.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func),
  hasUnsavedChanges: PropTypes.bool,
  currentPageIndex: PropTypes.number,
  desiredPageIndex: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToActions)(MainApp);
