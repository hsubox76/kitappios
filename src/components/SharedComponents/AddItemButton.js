import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, View, Text, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

class AddItemButton extends Component {
  render() {
    const color = this.props.color || '#999';
    const textStyle = { color, fontSize: 14 };
    return (
      <TouchableOpacity style={styles.addMethodButton} onPress={this.props.onPress}>
        <View style={styles.addMethodButtonItem}>
          <Icon name="plus" size={14} style={textStyle} />
        </View>
        <View style={styles.addMethodButtonItem}>
          <Text style={textStyle}>{this.props.text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

AddItemButton.propTypes = {
  color: PropTypes.string,
  text: PropTypes.string,
  onPress: PropTypes.func,
};

const styles = {
  addMethodButton: {
    paddingVertical: 7,
    width: width - 10,
    marginLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addMethodButtonItem: {
    marginHorizontal: 5
  }
};

export default AddItemButton;
