import moment from 'moment';
import _ from 'lodash';
import { DATE_FORMAT } from '../data/constants';

export function getMillisUntilNextEvent(rotation) {
  const everyMillis = moment.duration(...rotation.every).valueOf();
  const todayMillis = moment().valueOf();
  const startingMillis = moment(rotation.starting, DATE_FORMAT).valueOf();
  const millisSinceStart = todayMillis - startingMillis;
  const remainderMillis = millisSinceStart % everyMillis;
  const millisTillNext = everyMillis - remainderMillis;
  return millisTillNext;
}

export function getTimestampOfNextEvent(rotation) {
  const startMoment = moment(rotation.starting, DATE_FORMAT);
  if (startMoment.isAfter(moment())) {
    return startMoment;
  }
  const millisTillNext = getMillisUntilNextEvent(rotation);
  const nextEventMoment = moment(moment().valueOf() + millisTillNext);
  return nextEventMoment;
}

export function getTimestampsFromUntil(rotation, startTimestamp, endTimestamp,
  minQuantity = 1, maxQuantity = 3) {
  const timestamps = [];
  const nextEventTimestamp = getTimestampOfNextEvent(rotation);
  let currentTimestamp = _.round(Math.max(startTimestamp, nextEventTimestamp), -3);
  const now = moment().valueOf();
  // should always return the first one anyway...
  while (timestamps.length < maxQuantity
    && (currentTimestamp < endTimestamp || timestamps.length === 0)) {
    if (currentTimestamp > now) {
      timestamps.push(currentTimestamp);
    }
    currentTimestamp += moment.duration(...rotation.every).valueOf();
  }
  return timestamps;
}

export function getTimestampsUntil(rotation, endTimestamp, maxQuantity = 3) {
  return getTimestampsFromUntil(rotation, moment(rotation.starting, DATE_FORMAT).valueOf(),
    endTimestamp, 1, maxQuantity);
}
