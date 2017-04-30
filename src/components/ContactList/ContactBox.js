import React, { PropTypes } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';
import { COLORS } from '../../data/constants';

import * as Actions from '../../actions';

function mapStateToProps(state, ownProps) {
  const selectedContact = _.find(state.contacts, { id: ownProps.contactId });
  return {
    contact: selectedContact,
    modalVisible: state.ui.contactModalVisible
  };
}

function mapDispatchToActions(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

const ContactBox = (props) => {
  const colors = [COLORS.CONTACTS.PRIMARY, COLORS.CONTACTS.SECONDARY];
  if (props.contact) {
    return (
      <TouchableOpacity
        onPress={() => {
          props.actions.setSelectedContact(props.contact.id);
          props.onPress();
        }}
      >
        <LinearGradient colors={colors} style={styles.container}>
          <View style={styles.contactName}>
            <Text style={styles.contactNameText} numberOfLines={1}>
                {props.contact.name}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  return <View />;
};

ContactBox.propTypes = {
  contact: PropTypes.object,
  actions: PropTypes.object,
  modalVisible: PropTypes.bool,
  onPress: PropTypes.func,
};

const styles = {
  container: {
    height: 50,
    flexDirection: 'row'
  },
  date: {
    width: 50,
    alignItems: 'center'
  },
  month: {
    marginTop: 3
  },
  day: {
    borderWidth: 1,
    borderColor: 'white',
    height: 26,
    width: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  monthText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  },
  dayText: {
    color: 'white'
  },
  contactName: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center'
  },
  contactNameText: {
    color: 'white'
  }
};

export default connect(mapStateToProps, mapDispatchToActions)(ContactBox);
