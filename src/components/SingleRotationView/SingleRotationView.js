import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { View, Text, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { getTimestampOfNextEvent } from '../../utils/utils';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS, METHOD_TYPE_ICONS, DATE_FORMAT, TIME_UNITS } from '../../data/constants';
import NavHeader from '../SharedComponents/NavHeader';
import DatePickerModal from '../SharedComponents/DatePickerModal';
import PickerModal from '../SharedComponents/PickerModal';
import * as Actions from '../../actions';

const { width } = Dimensions.get('window');

function mapStateToProps(state, ownProps) {
  const rotation = ownProps.rotationId === ''
    ? {
      name: 'Just say hi',
      contactMethodId: 0,
      every: [1, 'weeks'],
      contactId: ownProps.contactId,
      starting: moment().add(1, 'weeks').format(DATE_FORMAT)
    }
    : _.find(state.rotations, { id: ownProps.rotationId });
  const contact = _.find(state.contacts, { id: rotation.contactId });
  if (rotation.contactMethodId === 0) {
    rotation.contactMethodId = Object.keys(contact.contactMethods)[0];
  }
  return {
    isNew: ownProps.rotationId === '',
    rotation,
    contact
  };
}

function mapDispatchToActions(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

class SingleRotationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNameInput: false,
      showMethodPicker: false,
      showFrequencyValuePicker: false,
      showFrequencyUnitPicker: false,
      showDatePicker: false,
      rotationName: props.rotation.name,
      contactMethodValue: props.rotation.contactMethodId,
      frequencyValue: parseInt(props.rotation.every[0], 10),
      frequencyUnit: props.rotation.every[1],
      date: new Date(getTimestampOfNextEvent(props.rotation))
    };
  }
  onApplyName() {
    if (this.state.rotationName === this.props.rotation.name) {
      return;
    }
    if (!this.props.isNew) {
      const newRotation = _.extend({}, this.props.rotation, { name: this.state.rotationName });
      this.props.actions.updateRotation(newRotation);
    }
    this.setState({ showNameInput: false });
  }
  onApplyNewDate() {
    if (!this.props.isNew) {
      const newRotation = _.extend({}, this.props.rotation, { starting: moment(this.state.date).format(DATE_FORMAT) });
      this.props.actions.updateRotation(newRotation);
    }
    this.setState({ showDatePicker: false });
  }
  onApplyContactMethod() {
    if (!this.props.isNew) {
      const newRotation = _.extend({}, this.props.rotation, { contactMethodId: this.state.contactMethodValue });
      this.props.actions.updateRotation(newRotation);
    }
    this.setState({ showMethodPicker: false });
  }
  onApplyFrequency() {
    if (!this.props.isNew) {
      const newRotation = _.extend({}, this.props.rotation, {
        every: [parseInt(this.state.frequencyValue, 10), this.state.frequencyUnit] });
      this.props.actions.updateRotation(newRotation);
    }
    this.setState({ showFrequencyUnitPicker: false, showFrequencyValuePicker: false });
  }
  onAddRotation() {
    const rotation = {
      name: this.state.rotationName,
      contactMethodId: this.state.contactMethodValue,
      every: [this.state.frequencyValue, this.state.frequencyUnit],
      contactId: this.props.contact.id,
      starting: moment(this.state.date).format(DATE_FORMAT)
    };
    this.props.actions.addRotation(rotation);
    this.props.onBack();
  }
  render() {
    const rotation = this.props.rotation;
    const contact = this.props.contact;
    const method = contact.contactMethods[rotation.contactMethodId];
    const methodData = _.isString(method.data) ? method.data : '(mailing address)';
    const methodsList = _.map(contact.contactMethods, (contactMethod) => {
      const label = _.isString(contactMethod.data)
        ? contactMethod.data : '(mailing address)';
      return { value: contactMethod.id, label: `${contactMethod.type} ${label}` };
    });
    const nameText = (
      <View style={styles.content}>
        <Text style={styles.contentText}>
          {rotation.name}
        </Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => this.setState({ showNameInput: true })}
        >
          <Icon style={styles.editIcon} name={'pencil'} size={18} />
        </TouchableOpacity>
      </View>
    );
    const nameInput = (
      <View style={[styles.content, styles.contentInput]}>
        <TextInput
          style={styles.nameInput}
          value={this.state.rotationName}
          onChangeText={(text) => this.setState({rotationName: text})}
        />
        <TouchableOpacity
          style={styles.okButton}
          onPress={() => this.onApplyName()}
        >
          <Icon style={styles.okIcon} name={'check'} size={18} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => this.setState({ showNameInput: false })}
        >
          <Icon style={styles.cancelIcon} name={'times'} size={18} />
        </TouchableOpacity>
      </View>
    );
    //TODO: Need to be able to delete rotations.
    return (
      <View style={styles.container}>
        <NavHeader
          title="Schedule"
          onBack={this.props.onBack}
          color={COLORS.ROTATIONS.PRIMARY}
        />
        <View style={styles.row}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Name:</Text>
          </View>
          {this.state.showNameInput ? nameInput : nameText}
        </View>
        <View style={styles.row}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Method:</Text>
          </View>
          <TouchableOpacity
            style={[styles.content, styles.contentEditable]}
            onPress={() => this.setState({showMethodPicker: true})}
          >
            <View style={styles.subContent}>
              <Icon name={METHOD_TYPE_ICONS[method.type]} size={18} />
            </View>
            <View style={styles.subContent}>
              <Text style={styles.contentText}>{methodData}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Frequency:</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ alignItems: 'center', padding: 5 }}>
              <Text style={styles.contentText}>
                every
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.content, styles.contentEditable, { marginRight: 10 }]}
              onPress={() => this.setState({showFrequencyValuePicker: true})}
            >
              <Text style={styles.contentText}>
                {rotation.every[0]}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.content, styles.contentEditable]}
              onPress={() => this.setState({showFrequencyUnitPicker: true})}
            >
              <Text style={styles.contentText}>
                {rotation.every[1]}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Next:</Text>
          </View>
          <TouchableOpacity
            style={[styles.content, styles.contentEditable]}
            onPress={() => this.setState({showDatePicker: true})}
          >
            <Text style={styles.contentText}>
              {getTimestampOfNextEvent(rotation).format('LLL')}
            </Text>
          </TouchableOpacity>
        </View>

        {this.props.isNew && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => this.onAddRotation()}
          >
            <Text style={styles.addButtonText}>Schedule It!</Text>
          </TouchableOpacity>
        )}

        <DatePickerModal
          onClose={() => this.setState({ showDatePicker: false })}
          onDateChange={(date) => this.setState({date})}
          onApplyDate={() => this.onApplyNewDate()}
          visible={this.state.showDatePicker}
          date={this.state.date}
        />
        <PickerModal
          onClose={() => this.setState({ showMethodPicker: false })}
          onValueChange={(value) => this.setState({contactMethodValue: value})}
          onApplyValue={() => this.onApplyContactMethod()}
          visible={this.state.showMethodPicker}
          selectedValue={this.state.contactMethodValue}
          values={methodsList}
          title="Choose a contact method:"
        />
        <PickerModal
          onClose={() => this.setState({ showFrequencyValuePicker: false })}
          onValueChange={(value) => this.setState({frequencyValue: value})}
          onApplyValue={() => this.onApplyFrequency()}
          visible={this.state.showFrequencyValuePicker}
          selectedValue={this.state.frequencyValue}
          values={_.map(_.range(1, 10), unit => ({ value: unit, label: unit.toString() }))}
          title={'Choose number of ' + this.state.frequencyUnit}
        />
        <PickerModal
          onClose={() => this.setState({ showFrequencyUnitPicker: false })}
          onValueChange={(value) => this.setState({frequencyUnit: value})}
          onApplyValue={() => this.onApplyFrequency()}
          visible={this.state.showFrequencyUnitPicker}
          selectedValue={this.state.frequencyUnit}
          values={_.map(TIME_UNITS, unit => ({ value: unit, label: '' + unit }))}
          title="Choose a unit of time:"
        />
      </View>
    );
  }
}

SingleRotationView.propTypes = {
  rotationId: PropTypes.string,
  rotation: PropTypes.object,
  contact: PropTypes.object,
  onBack: PropTypes.func.isRequired,
  isNew: PropTypes.bool
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  row: {
    flexDirection: 'column',
    width: width - 20,
    marginLeft: 10,
    marginVertical: 10,
    alignItems: 'flex-start'
  },
  label: {
    paddingHorizontal: 5,
    marginBottom: 5
  },
  labelText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5
  },
  contentEditable: {
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.ROTATIONS.PRIMARY,
    borderRadius: 5
  },
  contentInput: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.ROTATIONS.PRIMARY
  },
  nameInput: {
    width: width - 150
  },
  addButton: {
    marginLeft: 50,
    marginTop: 15,
    height: 30,
    width: width - 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.ROTATIONS.PRIMARY,
  },
  addButtonText: {
    color: 'white',
    fontSize: 20
  },
  editButton: {
    marginLeft: 10
  },
  editIcon: {
    color: COLORS.ROTATIONS.PRIMARY
  },
  okButton: {
    marginLeft: 20,
    padding: 5,
    backgroundColor: COLORS.EVENTS.PRIMARY
  },
  okIcon: {
    color: 'white'
  },
  cancelButton: {
    marginLeft: 20,
    marginRight: 10,
    padding: 5,
    backgroundColor: '#666'
  },
  cancelIcon: {
    color: 'white'
  },
  subContent: {
    marginRight: 10
  },
  contentText: {
    fontSize: 18
  }
};

export default connect(mapStateToProps, mapDispatchToActions)(SingleRotationView);
