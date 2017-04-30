import React, { PropTypes, Component } from 'react';
import { View } from 'react-native';
import _ from 'lodash';
import ContactMethodBox from './ContactMethodBox';
import AddItemButton from '../SharedComponents/AddItemButton';

class ContactMethods extends Component {
  constructor() {
    super();
    this.onMethodAdded = this.onMethodAdded.bind(this);
    this.state = {
      addingNewMethod: false
    };
  }
  onAddNewMethod() {
    this.setState({
      addingNewMethod: true
    });
  }
  onMethodAdded() {
    this.setState({
      addingNewMethod: false
    });
  }
  render() {
    const props = this.props;
    const contact = props.contact;
    const contactMethods = _.map(contact.contactMethods,
        (contactMethod, index) => (
          <View key={index} >
            <ContactMethodBox
              contactId={contact.id}
              contactMethod={contactMethod}
              onContactMethodUpdate={this.props.onContactMethodUpdate}
            />
          </View>
          )
        );
    return (
      <View>
        {contactMethods}
        {this.state.addingNewMethod
          ?
          <ContactMethodBox
            isEditing
            contactId={contact.id}
            onCloseEdit={this.onMethodAdded}
            onContactMethodUpdate={this.props.onContactMethodUpdate}
            contactMethod={{ id: contactMethods.length }}
          />
          :
          <AddItemButton
            onPress={() => this.onAddNewMethod()}
            text="add contact method"
          />
        }
      </View>
    );
  }
}

ContactMethods.propTypes = {
  contact: PropTypes.object.isRequired,
  onContactMethodUpdate: PropTypes.func.isRequired,
};

export default ContactMethods;
