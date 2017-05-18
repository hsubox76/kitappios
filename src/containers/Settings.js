import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, AlertIOS, PushNotificationIOS } from 'react-native';
import Button from 'apsl-react-native-button';
import * as Actions from '../actions';

function mapStateToProps(state) {
  return {};
}

function mapDispatchToActions(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

class Settings extends Component {
  componentWillMount() {
    // PushNotificationIOS.addEventListener('register', this._onRegistered);
    // PushNotificationIOS.addEventListener('registrationError', this._onRegistrationError);
    // PushNotificationIOS.addEventListener('notification', this._onRemoteNotification);
    // PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);

    // PushNotificationIOS.requestPermissions();
  }

  componentWillUnmount() {
    // PushNotificationIOS.removeEventListener('register', this._onRegistered);
    // PushNotificationIOS.removeEventListener('registrationError', this._onRegistrationError);
    // PushNotificationIOS.removeEventListener('notification', this._onRemoteNotification);
    // PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotification);
  }
  _sendNotification() {
    require('RCTDeviceEventEmitter').emit('remoteNotificationReceived', {
      aps: {
        alert: 'Sample notification',
        badge: '+1',
        sound: 'default',
        category: 'REACT_NATIVE'
      },
    });
  }

  _sendLocalNotification() {
    require('RCTDeviceEventEmitter').emit('localNotificationReceived', {
      aps: {
        alert: 'Sample local notification',
        badge: '+1',
        sound: 'default',
        category: 'REACT_NATIVE'
      },
    });
  }

  _onRegistered(deviceToken) {
    AlertIOS.alert(
      'Registered For Remote Push',
      `Device Token: ${deviceToken}`,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  _onRegistrationError(error) {
    AlertIOS.alert(
      'Failed To Register For Remote Push',
      `Error (${error.code}): ${error.message}`,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  _onRemoteNotification(notification) {
    AlertIOS.alert(
      'Push Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  _onLocalNotification(notification){
    AlertIOS.alert(
      'Local Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.props.actions.resetToTestData}>
          reset to test data
        </Button>
        <Button onPress={this.props.actions.schedulePushNotification}>
          send push notification
        </Button>
        <Button onPress={() => this.props.actions.setNavigationDestination(0, [{ index: 0, from: 'navigator' }, {
          title: 'event',
          index: 1,
          event: { index: 0 }
        }])}>
          force navigate
        </Button>
        <Button onPress={() => this.props.actions.logout()}>
          logout firebase
        </Button>
      </View>
    );
  }
}

Settings.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  user: PropTypes.object
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

export default connect(mapStateToProps, mapDispatchToActions)(Settings);
