import React, { PropTypes } from 'react';
import { TouchableOpacity, Text } from 'react-native';

const AddContactButton = (props) => (
  <TouchableOpacity
    onPress={props.onPress}
    style={styles.addContactButton}
  >
    <Text style={styles.addContactButtonText}>+ Import From My Contacts</Text>
  </TouchableOpacity>
);

AddContactButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

const styles = {
  addContactButton: {
    backgroundColor: '#555',
    margin: 5,
    padding: 10
  },
  addContactButtonText: {
    color: '#fff'
  }
};

export default AddContactButton;
