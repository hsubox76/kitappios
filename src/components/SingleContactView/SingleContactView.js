import React, { Component, PropTypes } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import ContactMethods from '../ContactMethods/ContactMethods';
import ContactRotations from './ContactRotations';
import NavHeader from '../SharedComponents/NavHeader';
import FamilyView from '../FamilyMembers/FamilyView';
import * as Actions from '../../actions';

function mapStateToProps(state, ownProps) {
  const selectedContact = _.find(state.contacts, { id: ownProps.contactId });
  return {
    selectedContact,
    events: state.events,
    rotations: state.rotations,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateContactMethod:
      (contactId, contactMethod) => dispatch(Actions.updateContactMethod(contactId, contactMethod)),
    updateFamilyMember:
      (contactId, memberIndex, memberData) =>
        dispatch(Actions.updateFamilyMember(contactId, memberIndex, memberData)),
    deleteFamilyMember:
      (contactId, memberIndex) => dispatch(Actions.deleteFamilyMember(contactId, memberIndex))
  };
}

function getDaysUntilNextBirthday(birthdate) {
  const birthdateMoment = moment(birthdate, 'MM-DD-YYYY');
  const today = moment();
  const nextBirthday = moment().month(birthdateMoment.month()).date(birthdateMoment.date());
  if (nextBirthday.isBefore(today)) {
    nextBirthday.year(today.year() + 1);
  } else {
    nextBirthday.year(today.year());
  }
  return nextBirthday.diff(today, 'days');
}

class SingleContactView extends Component {
  render() {
    let contents = null;
    const contact = this.props.selectedContact;

    if (contact) {
      const rotations = _.filter(this.props.rotations,
        rotation => rotation.contactId === contact.id);
      const daysUntilNextBirthday = getDaysUntilNextBirthday(contact.birthdate);

      contents = (
        <View style={styles.container}>
          <NavHeader
            title={contact.name}
            onBack={this.props.onBack}
            onEdit={() => this.props.onEdit(contact.id)}
          />
          <View style={styles.birthdayBar}>
            <Text style={styles.birthdayBarText}>
              {_.has(contact, 'birthdate')
                ? `${daysUntilNextBirthday} days until next birthday`
                : 'you haven\'t entered a birthday for this person'}
            </Text>
          </View>
          <ScrollView style={{ flex: 1 }}>
            <ContactRotations
              onRotationPress={this.props.onRotationPress}
              onNewRotationPress={this.props.onNewRotationPress}
              contact={contact}
              rotations={rotations}
            />
            <ContactMethods
              contact={contact}
              onContactMethodUpdate={
                // bind contact ID here, lower views need only worry about contactMethod
                (contactMethod) => this.props.updateContactMethod(contact.id, contactMethod)
              }
            />
            <FamilyView
              style={{ marginTop: 8 }}
              editable
              contactId={contact.id}
              familyIds={contact.family}
              onFamilyMemberUpdate={(memberIndex, memberData) =>
                this.props.updateFamilyMember(contact.id, memberIndex, memberData)}
              onFamilyMemberDelete={this.props.deleteFamilyMember}
            />
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {contents}
      </View>
    );
  }
}

SingleContactView.propTypes = {
  selectedContact: PropTypes.object,
  contactId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onBack: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  events: PropTypes.array,
  rotations: PropTypes.object,
  updateContactMethod: PropTypes.func.isRequired,
  updateFamilyMember: PropTypes.func.isRequired,
  deleteFamilyMember: PropTypes.func.isRequired,
  deleteContact: PropTypes.func,
  onRotationPress: PropTypes.func.isRequired,
  onNewRotationPress: PropTypes.func.isRequired,
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  birthdayBar: {
    height: 30,
    alignItems: 'center',
    padding: 5,
    marginTop: 5,
    marginBottom: 2,
    marginLeft: 2,
    marginRight: 2,
    backgroundColor: '#999'
  },
  birthdayBarText: {
    fontSize: 14,
    color: 'white'
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleContactView);
