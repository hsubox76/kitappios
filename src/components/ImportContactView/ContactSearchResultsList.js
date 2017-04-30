import React, { Component, PropTypes } from 'react';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import { View, ListView,
  TouchableOpacity, TouchableWithoutFeedback, Text, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { METHOD_TYPE, METHOD_TYPE_ICONS } from '../../data/constants';

const { width } = Dimensions.get('window');

class ContactSearchResultsList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(props.results)
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.results)
    });
  }
  render() {
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={() => dismissKeyboard()}>
        <ListView
          style={styles.listContainer}
          dataSource={this.state.dataSource}
          enableEmptySections
          renderHeader={() =>
            <View>
              <View style={styles.result}>
                <Text>{this.props.results.length} matching contacts</Text>
              </View>
              <View style={styles.separator} />
            </View>}
          renderRow={(result, index) => (
            <TouchableOpacity
              key={index}
              style={styles.result}
              onPress={() => this.props.setContact(result)}
            >
              <View style={styles.displayNameContainer}>
                <Text>{result.givenName}</Text>
              </View>
              <View style={styles.contactIconsContainer}>
                {result.phoneNumbers.length > 0 &&
                  <View style={styles.contactIcon}>
                    <Icon size={20} name={METHOD_TYPE_ICONS[METHOD_TYPE.CALL]} />
                  </View>}
                {result.emailAddresses.length > 0 &&
                  <View style={styles.contactIcon}>
                    <Icon size={20} name={METHOD_TYPE_ICONS[METHOD_TYPE.EMAIL]} />
                  </View>}
                {result.postalAddresses.length > 0 &&
                  <View style={styles.contactIcon}>
                    <Icon size={20}name={METHOD_TYPE_ICONS[METHOD_TYPE.POSTAL]} />
                  </View>}
              </View>
            </TouchableOpacity>
          )}
          renderSeparator={(sectionID, rowID) => <View key={rowID} style={styles.separator} />}
        />
      </TouchableWithoutFeedback>
    );
  }
}

ContactSearchResultsList.propTypes = {
  results: PropTypes.array,
  setContact: PropTypes.func.isRequired,
};

const styles = {
  container: {
    flex: 1
  },
  listContainer: {
    flex: 1,
    width: width - 20,
    marginLeft: 10
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  displayNameContainer: {
  },
  contactIconsContainer: {
    flexDirection: 'row',
  },
  contactIcon: {
    marginLeft: 10
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc'
  }
};

export default ContactSearchResultsList;
