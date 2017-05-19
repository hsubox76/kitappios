import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Modal, View, Text, Picker, TextInput, Dimensions,
  TouchableHighlight, TouchableOpacity, DatePickerAndroid } from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePickerModal from '../SharedComponents/DatePickerModal';
import { COLORS, CONTACT_TYPE } from '../../data/constants';

const { width } = Dimensions.get('window');

function mapStateToProps(state) {
  return { contacts: state.contacts };
}

class FamilyEditModal extends Component {
  constructor(props) {
    super(props);
    if (props.person) {
      this.state = {
        showDatePicker: false,
        selectedId: props.person.id,
        isPrimary: props.person.connection === CONTACT_TYPE.PRIMARY,
        name: props.person.name,
        title: props.person.title,
        birthdate: props.person.birthdate ? moment(props.person.birthdate, 'MM-DD-YYYY') : null
      };
    } else {
      this.state = {
        showDatePicker: false,
        isPrimary: true,
        name: '',
        title: '',
        selectedId: 'none'
      };
    }
  }
  onSelectContact(id) {
    if (id === 'none') {
      this.setState({
        selectedId: 'none',
        birthdate: null
      });
    } else {
      const contact = this.props.contacts[id];
      this.setState({
        selectedId: id,
        birthdate: contact.birthdate ? moment(contact.birthdate, 'MM-DD-YYYY') : null
      });
    }
  }
  onOkClick() {
    const props = this.props;
    const newPerson = {};
    if (props.person) {
      // if editing
      if (this.state.selectedId) {
        newPerson.id = this.state.selectedId;
      } else {
        newPerson.id = props.person.id;
      }
      newPerson.title = this.state.title;
    } else {
      if (this.state.isPrimary) {
        const contact = props.contacts[this.state.selectedId];
        newPerson.id = contact.id;
        newPerson.name = contact.name;
        newPerson.connection = CONTACT_TYPE.PRIMARY;
      } else {
        // if new
        // send a flag to let the action know this is new
        newPerson.new = true;
        newPerson.name = this.state.name;
        newPerson.connection = CONTACT_TYPE.SECONDARY;
      }
      newPerson.birthdate = this.state.birthdate ? this.state.birthdate.format('MM-DD-YYYY') : null;
      newPerson.title = this.state.title;
    }
    props.onFamilyMemberUpdate(newPerson);
    this.setState({
      name: '',
      title: '',
      selectedId: _.find(props.contacts, contact => contact).id
    });
    props.onRequestClose();
  }
  render() {
    const contact = _.find(this.props.contacts, { id: this.props.contactId });
    const picker = (
      <View style={styles.formRow}>
        <View style={styles.label}>
          <Text style={styles.labelText}>choose</Text>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={this.state.selectedId}
            onValueChange={(val) => this.onSelectContact(val)}
          >
            <Picker.Item key={'none'} value={'none'} label={'pick a contact'} />
            {_(this.props.contacts)
              .filter(contact => contact.id !== this.props.contactId)
              .map((contact) =>
                <Picker.Item key={contact.id} value={contact.id} label={contact.name} />)
              .value()
            }
          </Picker>
        </View>
      </View>
    );
    const nameInputRow = (
      <View style={styles.formRow}>
        <View style={styles.label}>
          <Text style={styles.labelText}>name</Text>
        </View>
        <View style={styles.nameInputContainer}>
          <TextInput
            style={styles.nameInput}
            value={this.state.name}
            placeholder="name"
            onChangeText={(val) => this.setState({ name: val })}
          />
        </View>
      </View>
    );
    const relationshipRow = (
      <View style={styles.formRow}>
        <View style={styles.label}>
          <Text style={styles.labelText}>relationship</Text>
        </View>
        <View style={styles.nameInputContainer}>
          <TextInput
            style={styles.nameInput}
            value={this.state.title}
            placeholder={'title ("son", "wife")'}
            onChangeText={val => this.setState({ title: val })}
          />
        </View>
      </View>
    );
    const birthdateRow = (
      <View style={[styles.formRow, styles.nonTextRow]}>
        <View style={styles.label}>
          <Text style={styles.labelText}>birthdate</Text>
        </View>
        {this.state.isPrimary
          ?
          <View style={styles.birthdateNoButton}>
            <Text>{this.state.birthdate ? this.state.birthdate.format('LL') : '-'}</Text>
          </View>
          :
          <TouchableOpacity
            style={styles.birthdateButton}
            onPress={() => this.setState({ showDatePicker: true })}
          >
            <Text style={styles.birthdateText}>
              {this.state.birthdate ? this.state.birthdate.format('LL') : 'choose birthdate (optional)'}
            </Text>
          </TouchableOpacity>
        }
      </View>
    );
    const selectExisting = (
        <TouchableHighlight
          style={[styles.modeSelectButton,
            this.state.isPrimary ? [] : styles.modeSelectButtonSelected]}
          onPress={() => this.setState({
            isPrimary: true,
            selectedId: _.find(this.props.contacts, contact => contact).id,
            birthdate: null
          })}
        >
          <Text
            style={!this.state.isPrimary
              ? styles.modeSelectTextSelected
              : styles.modeSelectText}
          >
            {this.state.isPrimary ? 'Pick one of your existing contacts below, or...'
              : 'click to pick from existing contacts instead'}
          </Text>
        </TouchableHighlight>
    );
    const manualEntry = (
        <TouchableHighlight
          style={[styles.modeSelectButton,
            this.state.isPrimary ? styles.modeSelectButtonSelected : []]}
          onPress={() => this.setState({
            isPrimary: false,
            name: '',
            title: '',
            birthdate: null
          })}
        >
          <Text
            style={this.state.isPrimary
            ? styles.modeSelectTextSelected : styles.modeSelectText}
          >
            {this.state.isPrimary
                ? 'click to enter a new name instead'
                : `Enter a new family member for ${contact.name} below, or...`}
          </Text>
        </TouchableHighlight>
    );
    const selector = (
      <View style={styles.modeSelectContainer}>
        {this.state.isPrimary ? selectExisting : manualEntry}
        {this.state.isPrimary ? manualEntry : selectExisting}
      </View>
    );
    return (
      <Modal
        transparent
        onRequestClose={this.props.onRequestClose}
        visible={this.props.visible}
      >
        <View style={styles.container}>
          <View style={styles.box}>
            <View style={styles.header}>
              <Text style={styles.headerText}>
                {`${this.props.person ? 'Edit' : 'Add'} Family Member`}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={this.props.onRequestClose}
              >
                <Icon name="times" size={20} />
              </TouchableOpacity>
            </View>
            {!this.props.person && selector}
            <View style={styles.form}>
              {this.state.isPrimary ? picker : nameInputRow}
              {relationshipRow}
              {birthdateRow}
            </View>
            <TouchableOpacity
              style={styles.goButton}
              onPress={() => this.onOkClick()}
            >
              <Text style={styles.goButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>

        <DatePickerModal
          onClose={() => this.setState({ showDatePicker: false })}
          onDateChange={(date) => this.setState({date})}
          onApplyDate={() => this.setState({ birthdate: moment(this.state.date), showDatePicker: false })}
          title="Select contact's birthdate"
          visible={this.state.showDatePicker}
          date={this.state.date || new Date()}
          mode="date"
        />
      </Modal>
    );
  }
}

FamilyEditModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  person: PropTypes.object,
  contacts: PropTypes.object,
  contactId: PropTypes.string.isRequired,
  onFamilyMemberUpdate: PropTypes.func.isRequired,
};

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.7)'
  },
  box: {
    width: width - 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: COLORS.CONTACTS.PRIMARY,
    paddingVertical: 10
  },
  header: {
    flexDirection: 'row',
    width: width - 50,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerText: {
    fontSize: 24,
    marginLeft: 10,
    color: COLORS.CONTACTS.PRIMARY
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modeSelectContainer: {
    width: width - 50,
    marginVertical: 10,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  modeSelectButton: {
    margin: 8
  },
  modeSelectButtonSelected: {
    margin: 8,
    padding: 8,
    borderRadius: 5,
    backgroundColor: COLORS.CONTACTS.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modeSelectText: {
    fontSize: 20,
    color: COLORS.CONTACTS.SECONDARY
  },
  modeSelectTextSelected: {
    fontSize: 16,
    color: 'white'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5
  },
  picker: {
    width: 200
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  nonTextRow: {
    marginVertical: 10
  },
  label: {
    width: 80
  },
  labelText: {
    fontSize: 14,
    color: COLORS.CONTACTS.PRIMARY
  },
  nameInputContainer: {
    height: 40,
    borderColor: COLORS.CONTACTS.PRIMARY,
    borderWidth: 2,
    justifyContent: 'center',
    padding: 5
  },
  nameInput: {
    height: 30,
    width: width * 0.75 - 80,
    fontSize: 18
  },
  birthdateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    padding: 5
  },
  birthdateNoButton: {
    alignItems: 'center',
    padding: 5
  },
  birthdateText: {
    fontSize: 16
  },
  goButton: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 5,
    backgroundColor: COLORS.EVENTS.SECONDARY
  },
  goButtonText: {
    color: 'white',
    fontSize: 18
  }
};

export default connect(mapStateToProps)(FamilyEditModal);
