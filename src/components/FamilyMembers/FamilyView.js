import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { View, Text, Dimensions } from 'react-native';
import _ from 'lodash';
import FamilyMemberBox from '../FamilyMembers/FamilyMemberBox';
import AddItemButton from '../SharedComponents/AddItemButton';
import FamilyEditModal from '../FamilyMembers/FamilyEditModal';

const { width } = Dimensions.get('window');

function mapStateToProps(state, ownProps) {
  if (!ownProps.familyIds) {
    return { family: [] };
  }
  const family = _.map(ownProps.familyIds,
    person => _.extend({}, person, state.contacts[person.id]));
  return {
    family
  };
}

class FamilyView extends Component {
  constructor() {
    super();
    this.state = {
      familyEditModalOpen: false
    };
  }
  render() {
    const familyEditModal = this.props.contactId ? (
      <FamilyEditModal
        contactId={this.props.contactId}
        visible={this.state.familyEditModalOpen}
        onRequestClose={() => this.setState({ familyEditModalOpen: false })}
        onFamilyMemberUpdate={memberData =>
          this.props.onFamilyMemberUpdate(this.props.family.length, memberData)}
      />
    ) : null;
    const familyDisplay = this.props.family.length > 0
      ? _.map(this.props.family, (person, index) =>
        <FamilyMemberBox
          key={index}
          editable={this.props.editable}
          contactId={this.props.contactId}
          person={_.extend({}, person, { index })}
          onFamilyMemberUpdate={memberData => this.props.onFamilyMemberUpdate(index, memberData)}
          onFamilyMemberDelete={() => this.props.onFamilyMemberDelete(this.props.contactId, index)}
        />
        )
      :
      (
      <View style={styles.familyRow}>
        <Text style={styles.familyText}>no family members linked</Text>
      </View>
      );
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={[styles.row, styles.header]}>
          <Text style={styles.headerText}>Family</Text>
        </View>
        <View>
          {familyDisplay}
          {this.props.editable && (
            <AddItemButton
              text="add family member"
              onPress={() => this.setState({ familyEditModalOpen: true })}
            />
          )}
        </View>
        {familyEditModal}
      </View>
    );
  }
}

FamilyView.propTypes = {
  editable: PropTypes.bool,
  family: PropTypes.array,
  familyIds: PropTypes.array,
  contactId: PropTypes.string.isRequired,
  onFamilyMemberUpdate: PropTypes.func,
  onFamilyMemberDelete: PropTypes.func,
  style: PropTypes.object,
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: width - 10,
    marginLeft: 5
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  familyContainer: {
    flexDirection: 'column'
  },
  familyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    marginBottom: 5,
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  familyText: {
    fontSize: 16
  },
};

export default connect(mapStateToProps)(FamilyView);
