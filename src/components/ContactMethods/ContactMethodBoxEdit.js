import React, { Component, PropTypes } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import TypePicker from './TypePicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { METHOD_TYPE } from '../../data/constants';

class ContactMethodBoxEdit extends Component {
  constructor(props) {
    super(props);
    this.onTextInputChange = this.onTextInputChange.bind(this);
    this.onOkButtonClick = this.onOkButtonClick.bind(this);
    this.onPickerValueChange = this.onPickerValueChange.bind(this);
    this.renderSingleLineData = this.renderSingleLineData.bind(this);
    this.renderMultiLineData = this.renderMultiLineData.bind(this);
    if (props.contactMethod.type) {
      const contactData = typeof props.contactMethod.data === 'string'
          ? [{ value: props.contactMethod.data }] : props.contactMethod.data;
      this.state = {
        textInputValues: contactData,
        id: props.contactMethod.id,
        pickerValue: props.contactMethod.type
      };
    } else {
      this.state = {
        textInputValues: [{ value: '' }],
        id: null,
        pickerValue: METHOD_TYPE.CALL
      };
    }
  }
  onTextInputChange(index, text) {
    // should probably do type checking to see if methodType matches method format
    this.setState({ textInputValues:
    [
      ...this.state.textInputValues.slice(0, index),
      _.extend({}, this.state.textInputValues[index], { value: text }),
      ...this.state.textInputValues.slice(index + 1)
    ] });
  }
  onOkButtonClick() {
    const data = this.state.textInputValues.length > 1
      ? this.state.textInputValues : this.state.textInputValues[0].value;
    this.props.onContactMethodUpdate(
      Object.assign({}, this.props.contactMethod, {
        data,
        id: this.state.id,
        type: this.state.pickerValue
      })
    );
    this.props.closeForm();
  }
  onCancelButtonClick() {
    this.props.closeForm();
  }
  onPickerValueChange(itemValue) {
    // should probably do type checking to see if methodType matches method format
    // changing from postal address to something else
    if (this.state.pickerValue === METHOD_TYPE.POSTAL && itemValue !== METHOD_TYPE.POSTAL) {
      this.state.textInputValues = [{ value: '' }];
    }
    // changing from something else to postal address
    if (this.state.pickerValue !== METHOD_TYPE.POSTAL && itemValue === METHOD_TYPE.POSTAL) {
      this.state.textInputValues = [
        { fieldName: 'street', value: '' },
        { fieldName: 'city', value: '' },
        { fieldName: 'state', value: '' },
        { fieldName: 'postcode', value: '' },
        { fieldName: 'country', value: '' },
      ];
    }
    this.setState({ pickerValue: itemValue });
  }
  renderSingleLineData() {
    return (
      <View style={styles.contactRowData}>
        <TextInput
          numberOfLines={1}
          onChangeText={text => this.onTextInputChange(0, text)}
          value={this.state.textInputValues[0].value}
          style={styles.contactRowTextInput}
        />
      </View>
    );
  }
  renderMultiLineData() {
    return (
      <View style={[styles.contactRowData, { height: 180 }]}>
        {_.map(this.state.textInputValues, (field, index) => (
          <TextInput
            key={index}
            numberOfLines={1}
            onChangeText={text => this.onTextInputChange(index, text)}
            value={field.value}
            placeholder={field.fieldName}
            style={styles.contactRowTextInput}
          />
        ))}
      </View>
    );
  }
  render() {
    return (
      <View style={[styles.contactRow, { height: this.state.textInputValues.length > 1 ? 180 : 60 }]}>
        <View style={styles.contactTypePickerContainer}>
          <TypePicker
            onValueChange={this.onPickerValueChange}
            selectedValue={this.state.pickerValue}
          />
        </View>
        {this.state.textInputValues.length > 1 ? this.renderMultiLineData() : this.renderSingleLineData()}
        <TouchableOpacity style={styles.okButton} onPress={this.onOkButtonClick}>
          <Icon name="check-circle" size={20} style={styles.okButtonText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.okButton} onPress={() => this.onCancelButtonClick()}>
          <Icon name="times" size={20} style={styles.cancelButtonText} />
        </TouchableOpacity>
      </View>
    );
  }
}

ContactMethodBoxEdit.propTypes = {
  contactMethod: PropTypes.object,
  closeForm: PropTypes.func,
  onContactMethodUpdate: PropTypes.func
};

const styles = {
  contactRow: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    margin: 2,
    borderWidth: 1,
    borderColor: '#cfc'
  },
  contactTypePickerContainer: {
    height: 60,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  okButton: {
    width: 20,
    height: 60,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  okButtonText: {
    color: 'green'
  },
  cancelButtonText: {
    color: '#999'
  },
  contactRowData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 60,
    marginLeft: 10,
    marginRight: 10
  },
  contactRowTextInput: {
    fontSize: 16,
    color: '#589',
    padding: 7,
    height: 30,
    borderColor: '#ccc',
    borderWidth: 1
  }
};

export default ContactMethodBoxEdit;
