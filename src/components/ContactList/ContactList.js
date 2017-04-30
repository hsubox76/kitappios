import React, { Component, PropTypes } from 'react';
import { View, ListView, Dimensions } from 'react-native';
import _ from 'lodash';
import ContactBox from './ContactBox';
import ContactListHeader from './ContactListHeader';

const { width } = Dimensions.get('window');

class ContactList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const sortedContacts = _.sortBy(props.contacts, 'name');
    this.state = {
      dataSource: ds.cloneWithRows(sortedContacts)
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(_.sortBy(nextProps.contacts, 'name'))
    });
  }
  render() {
    return (
      <ListView
        style={styles.listContainer}
        dataSource={this.state.dataSource}
        enableEmptySections
        renderHeader={() =>
          (<ContactListHeader onAddContactPress={this.props.onAddContactPress} />)}
        renderRow={(contact) => (
          <ContactBox
            key={contact.id}
            contactId={contact.id}
            onPress={() => this.props.onNavigatePress(contact.name, contact.id)}
          />
        )}
        renderSeparator={(sectionID, rowID) => <View key={rowID} style={styles.separator} />}
      />
    );
  }
}

ContactList.propTypes = {
  contacts: PropTypes.array.isRequired,
  onNavigatePress: PropTypes.func,
  onAddContactPress: PropTypes.func,
};

const styles = {
  listContainer: {
    width: width - 10,
    margin: 5
  },
  separator: {
    height: 5
  }
};

export default ContactList;
