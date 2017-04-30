import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Actions from '../../actions';
import FamilyEditModal from './FamilyEditModal';

function mapDispatchToActions(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

class FamilyMemberBox extends Component {
  constructor(props) {
    super(props);
    this.setEditingOn = this.setEditingOn.bind(this);
    this.setEditingOff = this.setEditingOff.bind(this);
    this.state = {
      isEditing: false
    };
  }
  onDeleteButtonClick() {
    const props = this.props;
    Alert.alert(
      'Delete Contact Method',
      'Delete this contact method?',
      [
        { text: 'Cancel', onPress: () => {} },
        { text: 'OK', onPress: () =>
          props.actions.deleteContactMethod(props.contactId, props.contactMethod.id) },
      ]
    );
  }
  setEditingOn() {
    this.setState({
      isEditing: true
    });
  }
  setEditingOff() {
    this.setState({
      isEditing: false
    });
  }
  getAgeText(birthdate) {
    if (!birthdate) {
      return '';
    }
    const birthMoment = moment(birthdate, 'MM-DD-YYYY');
    const years = Math.floor((moment() - birthMoment) / moment.duration(1, 'year'));
    return `age ${years}, birthday ${birthMoment.format('MMM DD')}`;
  }
  render() {
    const person = this.props.person;
    const actionButtons = this.props.editable && (
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={this.props.onFamilyMemberDelete}
        >
          <Icon name="trash" size={18} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={this.setEditingOn}
        >
          <Icon name="pencil" size={18} />
        </TouchableOpacity>
      </View>
    );
    return (
      <View style={styles.familyContainer} key={person.id}>
        <Text>{person.name} ({person.title}) {this.getAgeText(person.birthdate)}</Text>
        {actionButtons}
        <FamilyEditModal
          contactId={this.props.contactId}
          person={person}
          visible={this.state.isEditing}
          onRequestClose={() => this.setEditingOff()}
          onFamilyMemberUpdate={this.props.onFamilyMemberUpdate}
        />
      </View>
    );
  }
}

FamilyMemberBox.propTypes = {
  editable: PropTypes.bool,
  person: PropTypes.object.isRequired,
  contactId: PropTypes.string.isRequired,
  onFamilyMemberUpdate: PropTypes.func,
  onFamilyMemberDelete: PropTypes.func,
};

const styles = {
  familyContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexGrow: 0,
    justifyContent: 'space-between'
  },
  actionButton: {
    padding: 10
  }
};

export default connect(null, mapDispatchToActions)(FamilyMemberBox);
