import React, { Component, PropTypes } from 'react';
import { View, Text, Dimensions, TouchableOpacity, DatePickerAndroid, Linking } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS, EVENT_STATUS, METHOD_TYPE, DATE_FORMAT,
  METHOD_TYPE_ICONS, METHOD_TYPE_LABELS } from '../../data/constants';
import NavHeader from '../SharedComponents/NavHeader';
import FamilyView from '../FamilyMembers/FamilyView';
import { setNavigationDestination,
  setEventTried, setEventTimestamp, setEventStatus } from '../../actions';

const { width } = Dimensions.get('window');

function mapStateToProps(state, ownProps) {
  const event = state.events[ownProps.eventIndex];
  const rotation = state.rotations[event.rotationId];
  const contact = state.contacts[rotation.contactId];
  const contactMethod = contact.contactMethods[rotation.contactMethodId];
  const family = _.map(contact.family, person => _.extend({}, person, state.contacts[person.id]));
  return {
    desiredNavigationStack: state.ui.desiredNavigationStack,
    event: _.extend({},
      state.events[ownProps.eventIndex],
      {
        index: ownProps.eventIndex,
        name: rotation.name,
        contact,
        contactMethod,
        family
      })
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setEventTried: (event) =>
      dispatch(setEventTried(event)),
    setEventTimestamp: (event, timestamp) =>
      dispatch(setEventTimestamp(event, timestamp)),
    setEventCanceled: event =>
      dispatch(setEventStatus(event, EVENT_STATUS.CANCELED)),
    setEventDone: event =>
      dispatch(setEventStatus(event, EVENT_STATUS.DONE)),
    clearNavigationDestination: () => dispatch(setNavigationDestination(0, null))
  };
}

class SingleEventView extends Component {
  componentDidUpdate() {
    if (this.props.desiredNavigationStack) {
      this.props.clearNavigationDestination();
    }
  }
  onAction(contactMethod) {
    switch (contactMethod.type) {
      case METHOD_TYPE.CALL:
        Linking.openURL(`tel:${contactMethod.data}`);
        break;
      case METHOD_TYPE.TEXT:
        Linking.openURL(`sms:${contactMethod.data}`);
        break;
      case METHOD_TYPE.EMAIL:
        Linking.openURL(`mailto:${contactMethod.data}`);
        break;
      default:
        console.warn('unknown contact method type');
    }
  }
  onReschedule() {
    DatePickerAndroid.open({
      date: new Date(this.props.event.timestamp)
    })
    .then(({ action, year, month, day }) => {
      if (action !== DatePickerAndroid.dismissedAction) {
        const newTimestamp = moment().year(year)
          .month(month)
          .date(day)
          .valueOf();
        this.props.setEventTimestamp(this.props.event, newTimestamp);
      }
    });
  }
  onCancel(event) {
    this.props.setEventCanceled(event)
      .then(() => this.props.onBack());
  }
  onDone(event) {
    this.props.setEventDone(event)
      .then(() => this.props.onBack());
  }
  render() {
    const event = this.props.event;
    const contactMethod = this.props.event.contactMethod;
    const attemptsText = event.tries
      ? `${event.tries.length} (last on ${moment(_.last(event.tries), DATE_FORMAT).format('L')})`
      : 0;
    return (
      <View style={styles.container}>
        <NavHeader
          title="Event"
          onBack={this.props.onBack}
          color={COLORS.EVENTS.SECONDARY}
        />
        <View style={styles.row}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Name:</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.contentText}>
              {this.props.event.name} ({this.props.event.contact.name})
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.label}>
            <Text style={styles.labelText}>At:</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.contentText}>
              {moment(this.props.event.timestamp).format('LLL')}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Attempts:</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.contentText}>
              {attemptsText}
            </Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => this.props.setEventTried(event)}
            style={[styles.button, styles.triedButton]}
          >
            <Icon
              style={[styles.buttonText, styles.triedButtonText, styles.buttonIcon]}
              name={'ellipsis-h'}
              size={20}
            />
            <Text style={[styles.buttonText, styles.triedButtonText]}>Tried</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rescheduleButton]}
            onPress={() => this.onReschedule()}
          >
            <Icon
              style={[styles.buttonText, styles.rescheduleButtonText, styles.buttonIcon]}
              name={'calendar-o'}
              size={20}
            />
            <Text style={[styles.buttonText, styles.rescheduleButtonText]}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.onCancel(event)}
            style={[styles.button, styles.cancelButton]}
          >
            <Icon
              style={[styles.buttonText, styles.cancelButtonText, styles.buttonIcon]}
              name={'times'}
              size={20}
            />
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.buttonRow, styles.lastButtonRow]}>
          <TouchableOpacity
            onPress={() => this.onAction(event.contactMethod)}
            style={[styles.button, styles.actionButton]}
          >
            <Icon
              style={[styles.buttonText, styles.actionIcon]}
              name={METHOD_TYPE_ICONS[contactMethod.type]}
              size={20}
            />
            <Text style={styles.buttonText}>
              {_.capitalize(_.find(METHOD_TYPE_LABELS, { type: contactMethod.type }).label)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.onDone(event)}
            style={[styles.button, styles.doneButton]}
          >
            <Text style={styles.doneButtonText}>Done!</Text>
          </TouchableOpacity>
        </View>
        <FamilyView contactId={this.props.event.contact.id} familyIds={event.family} />
      </View>
    );
  }
}

SingleEventView.propTypes = {
  eventIndex: PropTypes.number.isRequired,
  event: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  setEventTried: PropTypes.func.isRequired,
  setEventTimestamp: PropTypes.func.isRequired,
  setEventCanceled: PropTypes.func.isRequired,
  setEventDone: PropTypes.func.isRequired,
  desiredNavigationStack: PropTypes.array,
  clearNavigationDestination: PropTypes.func,
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  row: {
    flexDirection: 'row',
    width: width - 20,
    marginLeft: 10,
    marginVertical: 10
  },
  label: {
    paddingHorizontal: 5
  },
  labelText: {
    fontSize: 18,
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
    fontSize: 16
  },
  buttonRow: {
    flexDirection: 'row',
    width: width - 30,
    marginLeft: 15,
    marginTop: 15
  },
  lastButtonRow: {
    marginBottom: 20,
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
  buttonText: {
    fontSize: 17,
    color: '#fff'
  },
  buttonIcon: {
    marginRight: 5
  },
  actionButton: {
    flexDirection: 'row',
    marginRight: 10,
    flexGrow: 0,
    paddingHorizontal: 20,
    backgroundColor: COLORS.EVENTS.SECONDARY
  },
  actionIcon: {
    marginRight: 10
  },
  cancelButton: {
    borderColor: '#999',
    borderWidth: 2
  },
  cancelButtonText: {
    color: '#999'
  },
  triedButton: {
    marginRight: 5,
    borderColor: COLORS.EVENTS.SECONDARY,
    borderWidth: 2,
  },
  triedButtonText: {
    color: COLORS.EVENTS.SECONDARY
  },
  rescheduleButton: {
    marginRight: 5,
    borderColor: COLORS.EVENTS.SECONDARY,
    borderWidth: 2,
  },
  rescheduleButtonText: {
    color: COLORS.EVENTS.SECONDARY
  },
  doneButton: {
    backgroundColor: COLORS.CONTACTS.SECONDARY
  },
  doneButtonText: {
    fontSize: 18,
    color: '#fff'
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleEventView);
