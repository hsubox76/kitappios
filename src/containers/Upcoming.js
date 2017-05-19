import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, ActivityIndicator, Navigator, BackAndroid } from 'react-native';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import { EVENT_STATUS } from '../data/constants';
import EventList from '../components/EventList/EventList';
import SingleEventView from '../components/SingleEventView/SingleEventView';
import * as Actions from '../actions';

function formatEventList(rotations, contacts, events) {
  if (!events || !rotations || !contacts || _.isEmpty(rotations) || _.isEmpty(contacts)) {
    return [];
  }
  return _(events)
  .map((event, index) => {
    const rotation = _.find(rotations, rot => rot.id === event.rotationId);
    if (!rotation) {
      return null;
    }
    const contact = _.find(contacts,
      (con) => con.id === rotation.contactId);
    if (!contact) {
      return null;
    }
    const contactMethod = _.find(contact.contactMethods,
        cMethod => cMethod.id === rotation.contactMethodId);
    return _.extend({}, event, {
      index,
      contactId: contact.id,
      contactName: contact.name,
      contactMethod,
      name: rotation.name,
      // flag events more than a year from now to format differently
    });
  })
  .filter(event => event && event.status !== EVENT_STATUS.CANCELED && event.status !== EVENT_STATUS.DONE)
  .sortBy('timestamp')
  .value();
}

function mapStateToProps(state) {
  return {
    rotations: state.rotations,
    contacts: state.contacts,
    events: formatEventList(state.rotations, state.contacts, state.events),
    lastUpdated: state.ui.lastUpdated,
    user: state.user,
    currentPageIndex: state.ui.currentPageIndex,
    desiredNavigationStack: state.ui.desiredNavigationStack
  };
}

function mapDispatchToActions(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

class UpcomingComponent extends Component {
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this._navigator && this._navigator.getCurrentRoutes().length > 1) {
        this._navigator.pop();
        return true;
      }
      return false;
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPageIndex !== this.props.currentPageIndex
      && nextProps.currentPageIndex !== 0
      && this._navigator) {
      this._navigator.popToTop();
    }
    if (!this.props.desiredNavigationStack && nextProps.desiredNavigationStack) {
      this._navigator.immediatelyResetRouteStack(nextProps.desiredNavigationStack);
      // this.props.actions.setNavigationDestination(null, null);
    }
  }
  render() {
    if (!this.props.lastUpdated.contacts && !this.props.lastUpdated.rotations) {
      return (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Navigator
          ref={(nav) => { this._navigator = nav; }}
          initialRoute={{ title: 'Upcoming', index: 0 }}
          renderScene={(route, navigator) => {
            if (route.index === 0) {
              return (
                <EventList
                  events={this.props.events}
                  fromNavigator={route.from === 'navigator'}
                  onEventPress={(event) => navigator.push({ title: 'event', index: 1, event })}
                />
              );
            } else if (route.index === 1) {
              return (
                <SingleEventView
                  eventIndex={route.event.index}
                  onBack={() => navigator.pop()}
                />
              );
            }
            return <View><Text>oops unexpected route</Text></View>;
          }}
          configureScene={() =>
            Navigator.SceneConfigs.PushFromRight}
        />
      </View>
    );
  }
}

UpcomingComponent.propTypes = {
  rotations: PropTypes.object.isRequired,
  contacts: PropTypes.object.isRequired,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  events: PropTypes.array.isRequired,
  lastUpdated: PropTypes.object,
  user: PropTypes.object,
  currentPageIndex: PropTypes.number,
  notification: PropTypes.object,
  onNotificationNavDone: PropTypes.func,
  desiredNavigationStack: PropTypes.array,
};

const styles = {
  container: {
    flex: 1
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default connect(mapStateToProps, mapDispatchToActions)(UpcomingComponent);
