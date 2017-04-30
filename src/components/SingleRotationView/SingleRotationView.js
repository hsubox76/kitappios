import React, { Component, PropTypes } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getTimestampOfNextEvent } from '../../utils/utils';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS, METHOD_TYPE_ICONS } from '../../data/constants';
import NavHeader from '../SharedComponents/NavHeader';

const { width } = Dimensions.get('window');

function mapStateToProps(state, ownProps) {
  const rotation = _.find(state.rotations, { id: ownProps.rotationId });
  return {
    rotation,
    contact: _.find(state.contacts, { id: rotation.contactId })
  };
}

class SingleRotationView extends Component {
  render() {
    const rotation = this.props.rotation;
    const contact = this.props.contact;
    const method = contact.contactMethods[rotation.contactMethodId];
    const methodData = _.isString(method.data) ? method.data : '(mailing address)';
    return (
      <View style={styles.container}>
        <NavHeader
          title="Schedule"
          onBack={this.props.onBack}
          onEdit={() => this.props.onEdit(rotation.id)}
          color={COLORS.ROTATIONS.PRIMARY}
        />
        <View style={styles.row}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Name:</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.contentText}>{rotation.name}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Method:</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.subContent}>
              <Icon name={METHOD_TYPE_ICONS[method.type]} size={18} />
            </View>
            <View style={styles.subContent}>
              <Text style={styles.contentText}>{methodData}</Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Frequency:</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.contentText}>
              {`every ${rotation.every[0]} ${rotation.every[1]}`}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Next:</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.contentText}>
              {getTimestampOfNextEvent(rotation).format('LLL')}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

SingleRotationView.propTypes = {
  rotationId: PropTypes.string,
  rotation: PropTypes.object,
  contact: PropTypes.object,
  onBack: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
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
    paddingHorizontal: 5
  },
  subContent: {
    marginRight: 10
  },
  contentText: {
    fontSize: 18
  }
};

export default connect(mapStateToProps)(SingleRotationView);
