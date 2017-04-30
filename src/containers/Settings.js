import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';
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
  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.props.actions.resetToTestData}>
          reset to test data
        </Button>
        <Button onPress={this.props.actions.schedulePushNotification}>
          send push notification
        </Button>
        <Button onPress={() => this.props.actions.setNavigationDestination(0, [{ index: 0 }, {
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
