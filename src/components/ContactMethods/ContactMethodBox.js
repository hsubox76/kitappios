import React, { Component, PropTypes } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ContactMethodBoxDisplay from './ContactMethodBoxDisplay';
import ContactMethodBoxEdit from './ContactMethodBoxEdit';
import * as Actions from '../../actions';

function mapDispatchToActions(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

class ContactMethodBox extends Component {
  constructor(props) {
    super(props);
    this.setEditingOn = this.setEditingOn.bind(this);
    this.setEditingOff = this.setEditingOff.bind(this);
    this.state = {
      isEditing: props.isEditing || false
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
    if (this.props.onCloseEdit) {
      this.props.onCloseEdit();
    }
    this.setState({
      isEditing: false
    });
  }
  render() {
    const props = this.props;
    if (this.state.isEditing) {
      return (
        <ContactMethodBoxEdit
          contactMethod={props.contactMethod}
          closeForm={this.setEditingOff}
          onContactMethodUpdate={this.props.onContactMethodUpdate}
        />);
    }
    return (
      <ContactMethodBoxDisplay
        contactMethod={props.contactMethod}
        onEditButtonClick={this.setEditingOn}
        onDeleteButtonClick={() => this.onDeleteButtonClick()}
      />);
  }
}

ContactMethodBox.propTypes = {
  contactMethod: PropTypes.object.isRequired,
  isEditing: PropTypes.bool,
  actions: PropTypes.objectOf(PropTypes.func),
  contactId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCloseEdit: PropTypes.func,
  onContactMethodUpdate: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToActions)(ContactMethodBox);
