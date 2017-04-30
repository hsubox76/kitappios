import React, { PropTypes } from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '../../data/constants';

const EventListHeader = (props) => (
  <View style={styles.container}>
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>Upcoming Events</Text>
    </View>
  </View>
);

EventListHeader.propTypes = {
};

const mainColor = COLORS.EVENTS.SECONDARY;

const styles = {
  container: {
    height: 40,
    flexDirection: 'row',
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: mainColor
  },
  titleContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
    color: mainColor
  },
  iconContainer: {
    flex: 0.3,
    alignItems: 'flex-end',
    justifyContent: 'center'
  }
};

export default EventListHeader;
