import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import TabView from 'react-native-scrollable-tab-view';

import Upcoming from './Upcoming';
import Contacts from './Contacts';
import Settings from './Settings';
import TabBar from './TabBar';
import * as Actions from '../actions';

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
      notification: null
    };
  }
  componentWillMount() {
    this.props.actions.fetchStoreFromStorage();
  }
  componentDidMount() {
    const self = this;
    // PushNotification.configure({
    //   onNotification: (notification) => {
    //     self.props.actions.setNavigationDestination(0, [{ index: 0 }, {
    //       title: 'event',
    //       index: 1,
    //       event: { index: parseInt(notification.id, 10) }
    //     }]);
    //   }
    // });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.hasUnsavedChanges) {
      this.props.actions.writeStoreToStorage();
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
