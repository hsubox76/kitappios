import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import { METHOD_TYPE_ICONS, COLORS, EVENT_STATUS } from '../../data/constants';


class EventBox extends Component {
  render() {
    const props = this.props;
    let type;
    let contentColor;
    if (props.event.status === EVENT_STATUS.CANCELED) {
      type = 'canceled';
      contentColor = 'white';
    } else if (props.event.timestamp > moment()) {
      if (props.event.timestamp < moment().add(1, 'weeks')) {
        type = 'soon';
        contentColor = 'white';
      } else {
        type = 'later';
        contentColor = COLORS.EVENTS.SECONDARY;
      }
    } else {
      type = 'missed';
      contentColor = COLORS.ROTATIONS.PRIMARY;
    }
    const gradientColors = type === 'soon'
      ? [COLORS.EVENTS.PRIMARY, COLORS.EVENTS.SECONDARY] : ['#fff', '#fff'];
    return (
      <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
        <TouchableOpacity
          style={[styles.container.all, styles.container[type], { borderColor: contentColor }]}
          onPress={() => this.props.onPress(this.props.event)}
        >
          <View style={styles.date}>
            <View style={styles.month}>
              <Text style={[styles.monthText, { color: contentColor }]}>
                {moment(props.event.timestamp).format('MMM').toUpperCase()}
              </Text>
            </View>
            <View style={[styles.day.all, { borderColor: contentColor }]}>
              <Text style={{ color: contentColor }}>
                {moment(props.event.timestamp).format('D')}
              </Text>
            </View>
          </View>
          <View style={styles.eventName}>
            <Text style={{ color: contentColor }} numberOfLines={2}>
              {props.event.name} ({props.event.contactName})
            </Text>
          </View>
          <View style={styles.icon}>
            <Icon
              name={METHOD_TYPE_ICONS[props.event.contactMethod.type]}
              size={25}
              color={contentColor}
            />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  }
}

EventBox.propTypes = {
  event: PropTypes.object,
  onPress: PropTypes.func,
};

const styles = {
  container: {
    all: {
      flex: 1,
      height: 60,
      flexDirection: 'row'
    },
    soon: {
      // placeholder
    },
    later: {
      borderWidth: 2
    },
    missed: {
      borderWidth: 3
    },
    canceled: {
      backgroundColor: '#ccc'
    }
  },
  date: {
    width: 50,
    alignItems: 'center'
  },
  month: {
    marginTop: 3
  },
  day: {
    all: {
      borderWidth: 1,
      height: 26,
      width: 26,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  monthText: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  eventName: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center'
  },
  icon: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default EventBox;
