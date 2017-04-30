import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity,
  Dimensions, DatePickerAndroid, Alert } from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import ContactMethods from '../ContactMethods/ContactMethods';
import NavHeader from '../SharedComponents/NavHeader';
import { CONTACT_TYPE, DATE_FORMAT } from '../../data/constants';
import * as Actions from '../../actions';

const { width } = Dimensions.get('window');

function mapStateToProps(state, ownProps) {
  const contact = _.find(state.contacts, { id: ownProps.contactId });
  const family = contact ? _.map(contact.family,
    person => _.extend({}, person, state.contacts[person.id])) : [];
  return {
    contact,
    family
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteContact: (id) => dispatch(Actions.deleteContact(id))
  };
}

class SingleContactEdit extends Component {
  constructor(props) {
    super(props);
    if (props.contact) {
      this.state = {
        name: props.contact.name,
        birthdate: props.contact.birthdate ? moment(props.contact.birthdate, DATE_FORMAT) : null,
        contactMethods: props.contact.contactMethods,
        family: props.family,
        familyEditModalOpen: false
      };
    } else {
      this.state = {
        name: '',
        birthdate: null,
        contactMethods: [],
        family: [],
        familyEditModalOpen: false
      };
    }
  }
  onNameValueChange(text) {
    this.setState({ name: text });
  }
  onDeletePress() {
    const props = this.props;
    Alert.alert(
      'Delete Contact',
      `Delete contact ${props.contact.name}?`,
      [
        { text: 'Cancel', onPress: () => {} },
        { text: 'OK', onPress: () => this.deleteContact() },
      ]
    );
  }
  deleteContact() {
    this.props.deleteContact(this.props.contactId)
      .then(() => {
        this.props.onBackAfterDelete();
      })
      .catch(error => console.warn('Could not delete contact', error));
  }
  openDatePicker() {
    DatePickerAndroid.open({
      date: this.state.birthdate ? this.state.birthdate.valueOf() : new Date()
    })
    .then(({ action, year, month, day }) => {
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({
          birthdate: moment().year(year)
                          .month(month)
                          .date(day)
        });
      }
    });
  }
  updateContactMethod(contactMethod) {
    if (this.props.contactId && _.has(this.state.contactMethods, contactMethod.id)) {
      this.setState({
        contactMethods: _.extend({}, this.state.contactMethods,
          { [contactMethod.id]: contactMethod })
      });
    } else if (_.find(this.state.contactMethods, { id: contactMethod.id })) {
      // TODO: update existing contact method (rare case in a new contact)
    } else {
      // add
      this.setState({
        contactMethods: this.state.contactMethods
          .concat(_.extend({}, contactMethod, { id: this.state.contactMethods.length }))
      });
    }
  }
  updateFamilyMember(person) {
    let updatedPerson;
    if (_.has(person, 'index')) {
      // existing contact being modified
      updatedPerson = _.extend({}, this.state.family[person.index], {
        id: person.id,
        title: person.title
      });
      this.setState({
        family: [...this.state.family.slice(0, person.index),
        updatedPerson,
        ...this.state.family.slice(person.index + 1)]
      });
    } else {
      // new contact
      this.setState({
        family: this.state.family.concat(person)
      });
    }
  }
  formatAndAddContact() {
    if (!this.state.name) {
      // need a warning message
      return;
    }
    const newContactData = {
      name: this.state.name,
      connection: CONTACT_TYPE.PRIMARY
    };
    if (this.state.birthdate) {
      newContactData.birthdate = this.state.birthdate.format('MM-DD-YYYY');
    }
    if (_.size(this.state.contactMethods) > 0) {
      newContactData.contactMethods = this.state.contactMethods;
    }
    if (_.size(this.state.family) > 0) {
      newContactData.family = this.state.family;
    }
    this.props.onSaveContact(newContactData)
      .then(() => {
        this.props.onBack();
      })
      .catch(error => console.warn(error));
  }
  render() {
    const contact = this.props.contact || { contactMethods: this.state.contactMethods };
    return (
      <View style={styles.container}>
        <NavHeader
          title={this.props.contactId ? 'Edit Contact' : 'Add New Contact'}
          onBack={this.props.onBack}
          onDelete={this.props.contact ? () => this.onDeletePress() : null}
        />
        <View style={styles.formContainer}>
          <View style={styles.formRow}>
            <View style={styles.formLabel}><Text style={styles.formLabelText}>name</Text></View>
            <TextInput
              style={styles.formField}
              value={this.state.name}
              placeholder="enter contact name"
              onChangeText={text => this.onNameValueChange(text)}
            />
          </View>
          <View style={styles.formRow}>
            <View style={styles.formLabel}>
              <Text style={styles.formLabelText}>birthdate</Text>
            </View>
            <TouchableOpacity style={styles.birthdateButton} onPress={() => this.openDatePicker()}>
              <Text style={styles.birthdateText}>
                {this.state.birthdate ? this.state.birthdate.format('LL') : 'choose birthdate'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>contact methods</Text>
          </View>
        </View>
        <ContactMethods
          contact={contact}
          onContactMethodUpdate={(contactMethod) => this.updateContactMethod(contactMethod)}
        />
        <TouchableOpacity
          style={styles.saveContactButton}
          onPress={() => this.formatAndAddContact()}
        >
          <Text style={styles.buttonText}>
            {this.props.contactId ? 'Save Changes' : 'Save New Contact'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

SingleContactEdit.propTypes = {
  onBack: PropTypes.func,
  onBackAfterDelete: PropTypes.func, // optional
  onSaveContact: PropTypes.func,
  deleteContact: PropTypes.func, // optional
  contactId: PropTypes.string, // optional
  contact: PropTypes.object, // optional
  events: PropTypes.array,
  rotations: PropTypes.object,
  family: PropTypes.array,
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  titleBar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FF5E3A'
  },
  navButton: {
    width: 20,
    marginLeft: 10,
    alignItems: 'center'
  },
  contactName: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  nameText: {
    fontSize: 24,
    color: '#FF5E3A'
  },
  formContainer: {
    width: width - 20,
    marginLeft: 10
  },
  formRow: {
    flexDirection: 'row',
    width: width - 20,
    alignItems: 'center',
    marginBottom: 10
  },
  formLabel: {
    width: 100,
  },
  formLabelText: {
    fontSize: 18,
    color: '#FF5E3A'
  },
  sectionHeader: {
    marginTop: 10,
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  sectionHeaderText: {
    fontSize: 18,
    color: '#FF5E3A'
  },
  formField: {
    flex: 1,
    fontSize: 16
  },
  birthdateButton: {
    padding: 7,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  birthdateText: {
    fontSize: 16
  },
  saveContactButton: {
    width: width - 20,
    marginTop: 10,
    marginLeft: 10,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#FF5E3A'
  },
  buttonText: {
    color: '#fff'
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleContactEdit);
