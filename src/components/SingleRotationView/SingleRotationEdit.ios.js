import React, { Component, PropTypes } from 'react';
import { View, Text, TextInput, Dimensions, Picker,
  TouchableOpacity, DatePickerAndroid, TimePickerAndroid } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { getTimestampOfNextEvent } from '../../utils/utils';
import { COLORS, TIME_UNITS, DATE_FORMAT } from '../../data/constants';
import NavHeader from '../SharedComponents/NavHeader';

const { width } = Dimensions.get('window');

function mapStateToProps(state, ownProps) {
  if (ownProps.rotationId) {
    const rotation = _.find(state.rotations, { id: ownProps.rotationId });
    return {
      rotation,
      contact: _.find(state.contacts, { id: rotation.contactId })
    };
  }
  return {
    contact: _.find(state.contacts, { id: ownProps.contactId })
  };
}

class SingleRotationEdit extends Component {
  constructor(props) {
    super(props);
    if (props.rotationId) {
      const method = props.contact.contactMethods[props.rotation.contactMethodId];
      this.state = {
        name: props.rotation.name,
        methodId: method.id,
        frequencyNumber: props.rotation.every[0].toString(),
        frequencyUnit: props.rotation.every[1],
        nextMoment: getTimestampOfNextEvent(props.rotation),
        dateTouched: false
      };
    } else {
      this.state = {
        name: '',
        methodId: _.find(props.contact.contactMethods, () => true).id,
        frequencyNumber: '1',
        frequencyUnit: 'weeks',
        nextMoment: moment(),
        dateTouched: false
      };
    }
  }
  onChangeName(text) {
    this.setState({
      name: text
    });
  }
  openDatePicker() {
    DatePickerAndroid.open({ date: this.state.nextMoment.toDate() })
      .then(({ action, year, month, day }) => {
        if (action !== DatePickerAndroid.dismissedAction) {
          this.setState({
            dateTouched: true,
            nextMoment: this.state.nextMoment.year(year)
                            .month(month)
                            .date(day)
          });
        }
      })
      .catch(error => console.warn('Cannot open date picker: ', error));
  }
  openTimePicker() {
    TimePickerAndroid.open({
      hour: this.state.nextMoment.hour(),
      minute: this.state.nextMoment.minute(),
      is24Hour: false
    })
      .then(({ action, hour, minute }) => {
        if (action !== DatePickerAndroid.dismissedAction) {
          this.setState({
            dateTouched: true,
            nextMoment: this.state.nextMoment.hour(hour)
                            .minute(minute)
          });
        }
      })
      .catch(error => console.warn('Cannot open time picker: ', error));
  }
  formatAndUpdateRotation() {
    const rotation = {
      id: _.get(this.props, 'rotation.id') || '',
      name: this.state.name,
      contactId: _.get(this.props, 'contact.id') || this.props.contactId,
      contactMethodId: this.state.methodId,
      every: [parseInt(this.state.frequencyNumber, 10), this.state.frequencyUnit],
      starting: this.state.dateTouched
        ? this.state.nextMoment.format(DATE_FORMAT)
        : (_.get(this.props, 'rotation.starting') || moment().format(DATE_FORMAT))
    };
    this.props.onSaveRotation(rotation)
      .then(() => this.props.onBack())
      .catch(error => console.warn('Error updating rotation:', error));
  }
  render() {
    const contact = this.props.contact;
    return (
      <View style={styles.container}>
        <NavHeader
          title={this.props.rotationId ? 'Edit Schedule' : 'New Schedule'}
          onBack={this.props.onBack}
          color={COLORS.ROTATIONS.PRIMARY}
        />
        <View style={styles.row}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Name:</Text>
          </View>
          <View style={styles.content}>
            <TextInput
              style={styles.contentTextInput}
              value={this.state.name}
              onChangeText={(text) => this.onChangeName(text)}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Method:</Text>
          </View>
          <View style={styles.content}>
            {/*<Picker
              style={styles.methodPicker}
              selectedValue={this.state.methodId}
              onValueChange={val => this.setState({ methodId: val })}
            >
              {_.map(contact.contactMethods, (contactMethod) => {
                const label = _.isString(contactMethod.data)
                  ? contactMethod.data : '(mailing address)';
                return (
                  <Picker.Item
                    key={contactMethod.id}
                    value={contactMethod.id}
                    label={`${contactMethod.type} ${label}`}
                  />
                );
              }
              )}
            </Picker>*/}
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Frequency:</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.contentText}>
              every
            </Text>
            <TextInput
              style={styles.frequencyInput}
              value={this.state.frequencyNumber}
              keyboardType="numeric"
              onChangeText={(text) => this.setState({ frequencyNumber: text })}
            />
            <Picker
              style={styles.timeUnitPicker}
              selectedValue={this.state.frequencyUnit}
              onValueChange={val => this.setState({ frequencyUnit: val })}
            >
              {_.map(TIME_UNITS, (timeUnit) => {
                return (
                  <Picker.Item
                    key={timeUnit}
                    style={{ fontSize: 18 }}
                    value={timeUnit}
                    label={timeUnit}
                  />
                );
              }
              )}
            </Picker>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Next:</Text>
          </View>
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => this.openDatePicker()}
            >
              <Text style={styles.contentText}>
                {this.state.nextMoment.format('LL')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => this.openTimePicker()}
            >
              <Text style={styles.contentText}>
                {this.state.nextMoment.format('LT')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => this.formatAndUpdateRotation()}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

SingleRotationEdit.propTypes = {
  rotationId: PropTypes.string,
  contactId: PropTypes.string,
  rotation: PropTypes.object,
  contact: PropTypes.object,
  onBack: PropTypes.func.isRequired,
  onSaveRotation: PropTypes.func.isRequired,
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
    marginVertical: 10
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
    paddingHorizontal: 5,
  },
  subContent: {
    marginRight: 10
  },
  contentTextInput: {
    fontSize: 18,
    width: width - 30
  },
  contentText: {
    fontSize: 18
  },
  methodPicker: {
    width: width - 30
  },
  timeUnitPicker: {
    width: 140
  },
  frequencyInput: {
    width: 50,
    paddingHorizontal: 10,
    fontSize: 18
  },
  dateTimeButton: {
    marginHorizontal: 10,
    padding: 7,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  saveButton: {
    width: width - 30,
    marginLeft: 15,
    marginTop: 10,
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.ROTATIONS.PRIMARY
  },
  saveButtonText: {
    fontSize: 18,
    color: '#fff'
  }
};

export default connect(mapStateToProps)(SingleRotationEdit);
