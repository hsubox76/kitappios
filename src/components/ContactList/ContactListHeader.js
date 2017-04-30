import React, { PropTypes } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../data/constants';

const ContactListHeader = (props) => (
  <View style={styles.container}>
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>Contacts</Text>
    </View>
    <TouchableOpacity style={styles.iconContainer} onPress={props.onAddContactPress}>
      <Icon name="md-add-circle" size={25} color={mainColor} />
    </TouchableOpacity>
  </View>
);

ContactListHeader.propTypes = {
  onAddContactPress: PropTypes.func,
};

const mainColor = COLORS.CONTACTS.PRIMARY;

const styles = {
  container: {
    height: 40,
    flexDirection: 'row',
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: mainColor
  },
  titleContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
    color: mainColor
  },
  iconContainer: {
    flex: 0.3,
    alignItems: 'flex-end',
    justifyContent: 'center'
  }
};

export default ContactListHeader;
