import React, { PropTypes } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import { METHOD_TYPE_ICONS } from '../../data/constants';

const ContactMethodBoxDisplay = (props) => {
  const contactData = props.contactMethod.data;
  const contactDataDisplay = _.isString(props.contactMethod.data)
    ? (
    <Text
      style={[styles.contactRowText, styles.contactRowDataText]}
      numberOfLines={1}
    >
      {contactData}
    </Text>
    )
    : (
    <View>
      <Text>{_.map(contactData, field => field.value).join(' ')}</Text>
    </View>
    );
  return (
    <View style={styles.contactRow}>
      <View style={styles.contactTypeIcon}>
        <Icon
          name={METHOD_TYPE_ICONS[props.contactMethod.type]}
          size={20}
          style={styles.contactRowText}
        />
      </View>
      <View style={styles.contactRowData}>
        {contactDataDisplay}
      </View>
      <View style={styles.deleteIcon}>
        <TouchableOpacity onPress={props.onDeleteButtonClick}>
          <Icon name="trash" size={20} style={styles.contactRowText} />
        </TouchableOpacity>
      </View>
      <View style={styles.editIcon}>
        <TouchableOpacity onPress={props.onEditButtonClick}>
          <Icon name="pencil" size={20} style={styles.contactRowText} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

ContactMethodBoxDisplay.propTypes = {
  contactMethod: PropTypes.object.isRequired,
  onEditButtonClick: PropTypes.func.isRequired,
  onDeleteButtonClick: PropTypes.func.isRequired,
};

const styles = {
  contactRow: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    margin: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  contactTypeIcon: {
    width: 40,
    marginLeft: 20
  },
  deleteIcon: {
    width: 20,
    marginRight: 30,
    alignItems: 'flex-end'
  },
  editIcon: {
    width: 20,
    marginRight: 20,
    alignItems: 'flex-end'
  },
  contactRowData: {
    flex: 1,
    justifyContent: 'center'
  },
  contactRowText: {
    color: '#666'
  },
  contactRowDataText: {
    fontSize: 16
  }
};

export default ContactMethodBoxDisplay;
