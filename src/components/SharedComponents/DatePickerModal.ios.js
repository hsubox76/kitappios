import React, { Component, PropTypes } from 'react';
import { View, Text, Dimensions, Modal, TouchableOpacity, DatePickerIOS } from 'react-native';
import { COLORS } from '../../data/constants';

const { width } = Dimensions.get('window');

class DatePickerModal extends Component {
  render() {
    return (
        <Modal
          visible={this.props.visible}
          onRequestClose={this.props.onClose}
        >
          <View style={styles.datePickerModal}>
            <View style={styles.title}>
              <Text style={styles.titleText}>{this.props.title || 'Reschedule to:'}</Text>
            </View>
            <DatePickerIOS
              style={{backgroundColor: 'white'}}
              mode={this.props.mode}
              date={this.props.date}
              onDateChange={this.props.onDateChange}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.okButton]}
                onPress={this.props.onApplyDate}
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
  datePickerModal: {
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

DatePickerModal.propTypes = {
  onClose: PropTypes.func,
  onDateChange: PropTypes.func,
  onApplyDate: PropTypes.func,
  date: PropTypes.object,
  visible: PropTypes.bool,
  mode: PropTypes.string
};

DatePickerModal.defaultProps = {
  mode: 'datetime'
};

export default DatePickerModal;