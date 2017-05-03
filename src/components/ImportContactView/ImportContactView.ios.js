import React, { Component, PropTypes } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import _ from 'lodash';
import Contacts from 'react-native-contacts';
import Icon from 'react-native-vector-icons/FontAwesome';
import ContactSearchResultsList from './ContactSearchResultsList';
import { CONTACT_TYPE, METHOD_TYPE } from '../../data/constants';

const { width } = Dimensions.get('window');

function formatAddress(address) {
  const fields = [address.street];
  if (address.city) {
    fields.push(address.city);
  }
  if (address.region) {
    fields.push(address.region);
  }
  if (address.postCode) {
    fields.push(address.postCode);
  }
  if (address.country) {
    fields.push(address.country);
  }
  return fields.join(', ');
}

class ImportContactView extends Component {
  constructor(props) {
    super(props);
    this.renderResultsContainer = this.renderResultsContainer.bind(this);
    this.renderContact = this.renderContact.bind(this);
    this.state = {
      contactSuccessfullyAdded: false,
      contact: null,
      searchInput: '',
      searchResults: [],
      allContacts: []
    };
  }
  componentDidMount() {
    Contacts.getAll((err, contacts) => this.setState({ allContacts: contacts }));
  }
  onInputChange(value) {
    this.setState({
      contactSuccessfullyAdded: false,
      contact: null,
      searchInput: value
    });
    if (value !== '') {
      const searchResults = _(this.state.allContacts)
        .map(contact => {
          const lowerValue = value.toLowerCase();
          if (contact.givenName.toLowerCase().includes(lowerValue) || contact.familyName.toLowerCase().includes(lowerValue)) {
            return _.extend({}, contact, { matchName: `${contact.givenName} ${contact.familyName}` });
          } else if (contact.middleName.toLowerCase().includes(lowerValue)) {
            return _.extend({}, contact, { matchName: `${contact.givenName} ${contact.middleName} ${contact.familyName}` });
          } else if (contact.company.toLowerCase().includes(lowerValue)) {
            return _.extend({}, contact, { matchName: `${contact.givenName} ${contact.company}` });
          } else if (contact.emailAddresses.some(address => address.email.toLowerCase().includes(lowerValue))) {
            const email = contact.emailAddresses.find(address => address.email.toLowerCase().includes(lowerValue)).email;
            return _.extend({}, contact, { matchName: `${contact.givenName} ${email}` });
          }
          return null;
        })
        .filter(contact => contact)
        .value();
      this.setState({ searchResults })
    }
  }
  setContact(contact) {
    this.setState({ contact });
  }
  formatAndAddContact() {
    const contact = this.state.contact;
    const formattedContact = {
      connection: CONTACT_TYPE.PRIMARY,
      name: `${contact.givenName} ${contact.familyName}`,
    };
    const contactMethods = [];
    if (contact.phoneNumbers.length > 0) {
      _.forEach(contact.phoneNumbers, (phoneNumber) => {
        contactMethods.push({
          type: METHOD_TYPE.CALL,
          id: contactMethods.length,
          data: phoneNumber.number
        });
      });
    }
    if (contact.emailAddresses.length > 0) {
      _.forEach(contact.emailAddresses, (emailAddress) => {
        contactMethods.push({
          type: METHOD_TYPE.EMAIL,
          id: contactMethods.length,
          data: emailAddress.email
        });
      });
    }
    if (contact.postalAddresses.length > 0) {
      _.forEach(contact.postalAddresses, (postalAddress) => {
        contactMethods.push({
          type: METHOD_TYPE.POSTAL,
          id: contactMethods.length,
          data: formatAddress(postalAddress)
        });
      });
    }
    formattedContact.contactMethods = contactMethods;
    this.props.addContact(formattedContact)
      .then(() => {
        this.setState({
          contactSuccessfullyAdded: true,
          contact: null,
          searchInput: '',
          searchResults: []
        });
      })
      .catch(error => {
        console.warn(`error writing contact to firebase: ${error}`);
      });
  }
  showContacts(contacts) {
    this.setState({
      searchResults: contacts
    });
  }
  renderResultsContainer() {
    return (
      <View style={styles.resultsContainer}>
        <ContactSearchResultsList
          results={this.state.searchResults}
          setContact={(contact) => this.setContact(contact)}
        />
      </View>
    );
  }
  renderContact() {
    const contact = this.state.contact;
    return (
      <View style={styles.selectedContactContainer}>
        <TouchableOpacity
          onPress={() => this.formatAndAddContact()}
          style={styles.importContactButton}
        >
          <Text style={styles.importContactText}>import this contact</Text>
        </TouchableOpacity>
        <View style={styles.contactField}>
          <Text style={styles.contactLabel}>name</Text>
          <Text>{`${contact.givenName} ${contact.familyName}`}</Text>
        </View>
        {contact.phoneNumbers.length > 0 &&
          <View style={styles.contactField}>
            <Text style={styles.contactLabel}>phone</Text>
            <Text>{contact.phoneNumbers[0].label} : {contact.phoneNumbers[0].number}</Text>
          </View>}
        {contact.emailAddresses.length > 0 &&
          <View style={styles.contactField}>
            <Text style={styles.contactLabel}>email</Text>
            <Text>{contact.emailAddresses[0].label} : {contact.emailAddresses[0].email}</Text>
          </View>}
        {contact.postalAddresses.length > 0 &&
          <View style={styles.contactField}>
            <Text style={styles.contactLabel}>postal</Text>
            <Text>{contact.postalAddresses[0].label} : {formatAddress(contact.postalAddresses[0])}</Text>
          </View>}
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={this.props.onBack}>
          <Icon style={styles.backIcon} name="chevron-left" size={20} />
          <Text style={styles.backText}>back to Contacts</Text>
        </TouchableOpacity>
        {this.state.contactSuccessfullyAdded &&
          <View style={styles.successMessage}>
            <Text style={styles.successMessageText}>Contact successfully added!</Text>
          </View>}
        <View style={styles.searchContainer}>
          <Icon style={styles.searchIcon} name="search" size={24} />
          <TextInput
            style={styles.searchInput}
            value={this.state.searchInput}
            onChangeText={value => this.onInputChange(value)}
            placeholder="search for contacts"
          />
        </View>
        {!this.state.contact && this.renderResultsContainer()}
        {this.state.contact && this.renderContact()}
      </View>
    );
  }
}

ImportContactView.propTypes = {
  onBack: PropTypes.func.isRequired,
  addContact: PropTypes.func.isRequired,
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  resultsContainer: {
    flex: 1
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5E3A',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  backIcon: {
    color: '#fff',
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10
  },
  searchContainer: {
    marginLeft: 10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  searchInput: {
    width: width - 80,
    marginLeft: 10
  },
  searchIcon: {
    color: '#00897B'
  },
  selectedContactContainer: {
    width: width - 30,
    marginLeft: 15
  },
  contactField: {
    marginBottom: 10
  },
  contactLabel: {
    fontWeight: 'bold'
  },
  addViewText: {
    fontColor: '#666'
  },
  importContactButton: {
    width: 150,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF5E3A'
  },
  importContactText: {
    color: '#FF5E3A'
  },
  successMessage: {
    width: width - 20,
    marginTop: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'green',
    padding: 5
  },
  successMessageText: {
    color: 'green'
  }
};

export default ImportContactView;
