import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text, Navigator, ActivityIndicator, BackAndroid } from 'react-native';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import ContactList from '../components/ContactList/ContactList';
import AddContactButton from '../components/AddContactButton';
import ImportContactView from '../components/ImportContactView/ImportContactView';
import SingleContactEdit from '../components/SingleContactView/SingleContactEdit';
import SingleContactView from '../components/SingleContactView/SingleContactView';
import SingleRotationView from '../components/SingleRotationView/SingleRotationView';
import SingleRotationEdit from '../components/SingleRotationView/SingleRotationEdit';
import { CONTACT_TYPE } from '../data/constants';

import * as Actions from '../actions';

function filterPrimaryContactsOnly(contacts) {
  return _.filter(contacts, (contact) => contact.connection === CONTACT_TYPE.PRIMARY);
}

function mapStateToProps(state) {
  return {
    contacts: state.contacts,
    lastUpdated: state.ui.lastUpdated,
    currentPageIndex: state.ui.currentPageIndex,
  };
}

function mapDispatchToActions(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

class ContactsComponent extends Component {
  constructor() {
    super();
    this._navigator = null;
  }
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
      && nextProps.currentPageIndex !== 1
      && this._navigator) {
      this._navigator.popToTop();
    }
  }
  render() {
    const props = this.props;
    const routes = [
      { title: 'Contacts', index: 0 }
    ];
    if (!this.props.lastUpdated.contacts) {
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
          initialRoute={routes[0]}
          initialRouteStack={routes}
          renderScene={(route, navigator) => {
            if (route.index === 0) {
              return (
                <View>
                  <AddContactButton
                    onPress={() =>
                      navigator.push({ title: 'Add Contact', index: 2 })}
                  />
                  <ContactList
                    contacts={filterPrimaryContactsOnly(props.contacts)}
                    onAddContactPress={() => navigator.push({ title: 'Add New Contact', index: 3 })}
                    onNavigatePress={(title, contactId) =>
                      navigator.push({ title, contactId, index: 1 })}
                  />
                </View>
              );
            } else if (route.index === 1) {
              return (
                <SingleContactView
                  contactId={route.contactId}
                  onBack={() => navigator.pop()}
                  onEdit={(contactId) =>
                    navigator.push({ title: 'Edit Contact', index: 6, contactId })}
                  onNewRotationPress={() =>
                    navigator.push({ title: 'Add Schedule', index: 7, rotationId: '', contactId: route.contactId })}
                  onRotationPress={(rotation) =>
                    navigator.push({ title: rotation.name, index: 4, rotationId: rotation.id })}
                />);
            } else if (route.index === 2) {
              return (
                <ImportContactView
                  addContact={props.actions.addContact}
                  onBack={() => navigator.pop()}
                />);
            } else if (route.index === 3) {
              return (
                <SingleContactEdit
                  onSaveContact={props.actions.addContact}
                  onBack={() => navigator.pop()}
                />
              );
            } else if (route.index === 4) {
              return (
                <SingleRotationView
                  onBack={() => navigator.pop()}
                  rotationId={route.rotationId}
                />
              );
            } else if (route.index === 5) {
              // edit rotation
              return (
                <SingleRotationEdit
                  onBack={() => navigator.pop()}
                  rotationId={route.rotationId}
                  onSaveRotation={(rotation) => props.actions.updateRotation(rotation)}
                />
              );
            } else if (route.index === 6) {
              return (
                <SingleContactEdit
                  onSaveContact={(contactData) =>
                    props.actions.updateContact(route.contactId, contactData)}
                  contactId={route.contactId}
                  onBack={() => navigator.pop()}
                  onBackAfterDelete={() => navigator.popN(2)}
                />
              );
            } else if (route.index === 7) {
              // add new rotation
              return (
                <SingleRotationView
                  onBack={() => navigator.pop()}
                  rotationId={route.rotationId}
                  contactId={route.contactId}
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

ContactsComponent.propTypes = {
  contacts: PropTypes.object.isRequired,
  actions: PropTypes.objectOf(PropTypes.func),
  lastUpdated: PropTypes.object,
  modalVisible: PropTypes.bool,
  currentPageIndex: PropTypes.number,
};

const styles = {
  container: {
    flex: 1,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default connect(mapStateToProps, mapDispatchToActions)(ContactsComponent);
