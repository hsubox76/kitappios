import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { METHOD_TYPE_ICONS, METHOD_TYPE_LABELS } from '../../data/constants';

class TypePicker extends Component {
  constructor() {
    super();
    this.handlePick = this.handlePick.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.state = {
      pickerOpen: false
    };
  }
  handlePick(item) {
    this.props.onValueChange(item);
    this.setState({ pickerOpen: false });
  }
  handleOpen() {
    this.setState({ pickerOpen: true });
  }
  render() {
    const pickList = (
      <View style={styles.pickList}>
        {METHOD_TYPE_LABELS.map((option, index) => (
          <View key={index} style={styles.pickableItem}>
            <TouchableOpacity onPress={() => this.handlePick(option.type)}>
              <Icon style={option.type === this.props.selectedValue ? styles.selectedPickableIcon : styles.pickableIcon} name={METHOD_TYPE_ICONS[option.type]} size={20} />
            </TouchableOpacity>
          </View>
        ))}
      </View>);
    const selectedItem = (
      <View style={styles.selectedItem}>
        <Icon style={styles.selectedIcon} name={METHOD_TYPE_ICONS[this.props.selectedValue]} size={20} />
        <Icon style={styles.caret} name="caret-down" size={20} />
      </View>
    );
    return (
      <View style={styles.pickerContainer}>
        <TouchableOpacity onPress={this.state.pickerOpen ? null : this.handleOpen}>
          {this.state.pickerOpen ? pickList : selectedItem}
        </TouchableOpacity>
      </View>
    );
  }
}

TypePicker.propTypes = {
  selectedValue: PropTypes.string,
  onValueChange: PropTypes.func,
};

const styles = {
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#666',
    padding: 5
  },
  pickList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100
  },
  selectedItem: {
    flexDirection: 'row'
  },
  selectedIcon: {
    color: '#FF5E3A'
  },
  caret: {
    marginLeft: 5
  },
  selectedPickableIcon: {
    color: '#FF5E3A'
  },
  pickableIcon: {
    color: '#666'
  },
  pickableItem: {
    padding: 2
  }
};

export default TypePicker;
