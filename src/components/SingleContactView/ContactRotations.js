import React, { PropTypes } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS, METHOD_TYPE_ICONS } from '../../data/constants';
import LinearGradient from 'react-native-linear-gradient';
import { getMillisUntilNextEvent } from '../../utils/utils';
import AddItemButton from '../SharedComponents/AddItemButton';

const ContactRotations = (props) => {
  const contact = props.contact;
  const rotationViews = props.rotations.map((rotation, index) => {
    const contactMethod = _.find(contact.contactMethods,
      currentContactMethod => currentContactMethod.id === rotation.contactMethodId);
    const millisTillNext = getMillisUntilNextEvent(rotation);
    return (
      <TouchableOpacity
        key={index}
        onPress={() => props.onRotationPress(rotation)}
      >
        <LinearGradient
          style={styles.rotationRow}
          colors={[COLORS.ROTATIONS.PRIMARY, COLORS.ROTATIONS.SECONDARY]}
        >
          <View style={styles.contactTypeIcon}>
            <Icon
              name={METHOD_TYPE_ICONS[contactMethod.type]}
              size={20}
              style={styles.rotationRowText}
            />
          </View>
          <View>
            <Text style={[styles.rotationRowText, styles.rotationRowNameText]}>{rotation.name}</Text>
            <Text style={[styles.rotationRowText, styles.rotationRowDateText]}>
              every {moment.duration(...rotation.every).humanize()} ...
              next in {moment.duration(millisTillNext).humanize()}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  });
  return (
    <View>
      {rotationViews}
      <AddItemButton
        onPress={props.onNewRotationPress}
        text="add KIT schedule"
        color={COLORS.ROTATIONS.PRIMARY}
      />
    </View>
  );
};

ContactRotations.propTypes = {
  contact: PropTypes.object.isRequired,
  rotations: PropTypes.array.isRequired,
  onRotationPress: PropTypes.func.isRequired,
  onNewRotationPress: PropTypes.func.isRequired,
};

const styles = {
  rotationRow: {
    height: 50,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 2
  },
  contactTypeIcon: {
    width: 40,
    paddingLeft: 10
  },
  editIcon: {
    width: 40,
    paddingRight: 10,
    alignItems: 'flex-end'
  },
  rotationRowData: {
    flex: 1
  },
  rotationRowText: {
    color: 'white',
    backgroundColor: 'transparent'
  },
  rotationRowNameText: {
    fontSize: 14
  },
  rotationRowDateText: {
    fontSize: 10
  }
};

export default ContactRotations;
