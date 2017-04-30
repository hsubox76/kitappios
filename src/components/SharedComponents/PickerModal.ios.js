import React, { Component, PropTypes } from 'react';
import { View, Text, Dimensions, Modal, TouchableOpacity, Picker } from 'react-native';
import _ from 'lodash';
import { COLORS } from '../../data/constants';

const { width } = Dimensions.get('window');

class PickerModal extends Component {
  render() {
    return (
        <Modal
          visible={this.props.visible}
          onRequestClose={this.props.onClose}
        >
          <View style={styles.pickerModal}>
            <View style={styles.title}>
              <Text style={styles.titleText}>{this.props.title}</Text>
            </View>
            <Picker
              style={{backgroundColor: 'white', borderWidth: 1, borderColor: '#ccc' }}
              selectedValue={this.props.selectedValue}
              onValueChange={val => this.props.onValueChange(val)}
            >
              {
                _.map(this.props.values, value => (
                  <Picker.Item
                    key={value.value}
                    value={value.value}
                    label={value.label}
                  />
                ))
              }
            </Picker>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.okButton]}
                onPress={this.props.onApplyValue}
              >
                <Text style={styles.doneButtonText}>Ok</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={this.props.onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    );
  }
}

const styles = {
  pickerModal: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 24
  },
  buttonRow: {
    flexDirection: 'row',
    width: width - 30,
    marginLeft: 15,
    marginTop: 15
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    flexShrink: 0
  },
  okButton: {
    backgroundColor: COLORS.EVENTS.SECONDARY,
    marginRight: 10
  },
  cancelButton: {
    borderColor: '#999',
    borderWidth: 2
  },
  cancelButtonText: {
    color: '#999'
  },
  doneButton: {
    backgroundColor: COLORS.CONTACTS.SECONDARY
  },
  doneButtonText: {
    fontSize: 18,
    color: '#fff'
  },
};

PickerModal.propTypes = {
  onClose: PropTypes.func,
  onValueChange: PropTypes.func,
  onApplyValue: PropTypes.func,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  values: PropTypes.array,
  visible: PropTypes.bool,
  title: PropTypes.string
};

export default PickerModal;