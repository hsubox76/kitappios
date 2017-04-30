import React, { PropTypes } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../../data/constants';

const NavHeader = (props) => {
  const color = props.color || COLORS.CONTACTS.PRIMARY;
  return (
    <View style={[styles.titleBar, { borderBottomColor: color }]}>
      <TouchableOpacity onPress={props.onBack}>
        <View style={styles.navButton}>
          <Icon name="chevron-left" size={20} />
        </View>
      </TouchableOpacity>
      <View style={styles.contactName}>
        <Text style={[styles.nameText, { color }]}>{props.title}</Text>
      </View>
      {props.onEdit &&
        <TouchableOpacity onPress={props.onEdit}>
          <View style={styles.navButton}>
            <Icon name="pencil-square-o" size={20} />
          </View>
        </TouchableOpacity>
      }
      {props.onDelete &&
        <TouchableOpacity onPress={props.onDelete}>
          <View style={styles.navButton}>
            <Icon name="trash" size={20} />
          </View>
        </TouchableOpacity>
      }
      {!props.onEdit && !props.onDelete &&
        <View style={styles.navButton} />
      }
    </View>
  );
};

NavHeader.propTypes = {
  onBack: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  title: PropTypes.string,
  color: PropTypes.string,
};

const styles = {
  titleBar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2
  },
  navButton: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactName: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  nameText: {
    fontSize: 24
  },
};

export default NavHeader;
