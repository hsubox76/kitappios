import { ACTIONS } from './types';
import * as Storage from '../data/storage';
import firebaseApp from '../api/firebase';
import pushNotification from '../api/notification';
import _ from 'lodash';
import moment from 'moment';
import { Alert } from 'react-native';
import { contacts as testContacts } from '../data/contacts';
import { rotations as testRotations } from '../data/rotations';
import { getTimestampsFromUntil } from '../utils/utils';
import { DATE_FORMAT, EVENT_STATUS, CONTACT_TYPE } from '../data/constants';


function updateTimestamp(userId, type) {
  return firebaseApp.database()
    .ref(`users/${userId}/lastUpdated/${type}`)
    .set(moment().valueOf());
}

// Action creators

export function setSelectedContact(contactId) {
  return { type: ACTIONS.SET_SELECTED_CONTACT, payload: { contactId } };
}

export function setUser(user) {
  return { type: ACTIONS.SET_USER, payload: { user } };
}

export function setPageIndex(index) {
  return { type: ACTIONS.SET_PAGE_INDEX, payload: { index } };
}

export function setNavigationDestination(index, stack) {
  return { type: ACTIONS.SET_NAVIGATION_DESTINATION, payload: { index, stack } };
}

export function testAction() {
  return { type: ACTIONS.TEST };
}

export function createAccountWithEmail(email, password) {
  return (dispatch) => {
    firebaseApp.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        dispatch(setUser(user));
        updateTimestamp(user.uid, 'contacts');
        updateTimestamp(user.uid, 'rotations');
      })
      .catch(error => {
        Alert.alert('Error Creating Account', error.message);
      });
  };
}

export function loginWithEmail(email, password) {
  return (dispatch) => {
    firebaseApp.auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        dispatch(setUser(user));
      })
      .catch(error => {
        Alert.alert('Login Error', error.message);
      });
  };
}

export function logout() {
  return dispatch => {
    firebaseApp.auth().signOut()
    .then(() => {
      dispatch(setUser(null));
    });
  };
}

export function fetchStoreFromStorage() {
  return (dispatch, getStore) => {
    const { user } = getStore();

    const db = firebaseApp.database();

    // initial load of all data
    db.ref(`users/${user.uid}`)
      .once('value')
      .then((snapshot) => {
        const results = snapshot.val();
        if (results) {
          dispatch({
            type: ACTIONS.SET_STORE,
            payload: results
          });
          dispatch(generateAllEvents('update')).then(() => updateTimestamp(user.uid, 'events'));
        }

        // listeners for changes in different data
        db.ref(`users/${user.uid}/contacts`).on('value', (snap) => {
          const contacts = snap.val();
          if (contacts) {
            dispatch({
              type: ACTIONS.SET_CONTACTS,
              payload: { contacts }
            });
          }
        });

        db.ref(`users/${user.uid}/rotations`).on('value', (snap) => {
          const rotations = snap.val();
          if (rotations) {
            dispatch({
              type: ACTIONS.SET_ROTATIONS,
              payload: { rotations }
            });
          }
        });

        db.ref(`users/${user.uid}/events`).on('value', (snap) => {
          const events = snap.val();
          if (events) {
            dispatch({
              type: ACTIONS.SET_EVENTS,
              payload: { events }
            });
          }
        });

        db.ref(`users/${user.uid}/lastUpdated`).on('value', (snap) => {
          const lastUpdated = snap.val();
          if (lastUpdated) {
            dispatch({
              type: ACTIONS.SET_LAST_UPDATED,
              payload: { lastUpdated }
            });
          }
        });
      });
  };
}

export function writeStoreToStorage(customStore) {
  return (dispatch, getStore) => {
    const store = customStore || getStore();

    Storage.writeStoreToStorage(store)
    .then(() => {
      // probably set some state to indicate write succeeded
    })
    .catch((error) => console.warn(error));

    firebaseApp.database().ref(`users/${store.user.uid}`).update({
      contacts: store.contacts,
      rotations: store.rotations,
      events: store.events
    });
  };
}

export function resetToTestData() {
  return (dispatch, getStore) => {
    const newStore = Object.assign({}, getStore(), {
      contacts: testContacts,
      rotations: testRotations,
      events: {}
    });
    dispatch({
      type: ACTIONS.SET_CONTACTS,
      payload: testContacts
    });
    dispatch({
      type: ACTIONS.SET_ROTATIONS,
      payload: testRotations
    });
    dispatch(writeStoreToStorage(newStore));
  };
}

export function addContact(contactData) {
  return (dispatch, getStore) => {
    const { user } = getStore();
    let contactDataToAdd = {};
    const newContactKey = firebaseApp.database().ref(`users/${user.uid}/contacts`).push().key;
    if (_.isArray(contactData.contactMethods)) {
      contactDataToAdd = _.extend({}, contactData, {
        id: newContactKey
      });
      contactDataToAdd = _.omit(contactDataToAdd, 'contactMethods');
    } else {
      contactDataToAdd = _.extend({}, contactData, {
        id: newContactKey
      });
    }
    const db = firebaseApp.database();
    return db.ref(`users/${user.uid}/contacts/${newContactKey}`)
      .set(_.extend({}, contactData, {
        id: newContactKey
      }))
      .then(() => {
        const newMethods = _(contactData.contactMethods)
          .map((contactMethod) => {
            const newMethodId = db
              .ref(`users/${user.uid}/contacts/${newContactKey}/contactMethods`).push().key;
            return _.extend({}, contactMethod, { id: newMethodId });
          })
          .keyBy('id')
          .value();
        return db.ref(`users/${user.uid}/contacts/${newContactKey}/contactMethods`)
          .set(newMethods)
          .then(() => updateTimestamp(user.uid, 'contacts'));
      });
  };
}

export function updateContact(contactId, contactData) {
  return (dispatch, getStore) => {
    const { user } = getStore();
    return firebaseApp.database().ref(`users/${user.uid}/contacts/${contactId}`)
      .update(contactData)
      .then(() => updateTimestamp(user.uid, 'contacts'));
  };
}

export function deleteContact(id) {
  return (dispatch, getStore) => {
    const { user } = getStore();
    return firebaseApp.database().ref(`users/${user.uid}/contacts/${id}`)
      .remove()
      .then(() => updateTimestamp(user.uid, 'contacts'));
  };
}

export function updateFamilyMember(contactId, memberIndex, memberData) {
  return (dispatch, getStore) => {
    const { user } = getStore();
    const db = firebaseApp.database();
    if (memberData.new) {
      // adding new family member
      // probably name and birthdate only
      const familyMemberContactId = db.ref(`users/${user.uid}/contacts`).push().key;
      db.ref(`users/${user.uid}/contacts/${familyMemberContactId}`)
        .set({
          id: familyMemberContactId,
          name: memberData.name,
          birthdate: memberData.birthdate,
          connection: CONTACT_TYPE.SECONDARY })
        .then(() =>
          db.ref(`users/${user.uid}/contacts/${contactId}/family/${memberIndex}`)
            .set({
              id: familyMemberContactId,
              title: memberData.title
            })
        )
        .then(() => updateTimestamp(user.uid, 'contacts'));
    } else {
      // editing existing family member
      db.ref(`users/${user.uid}/contacts/${contactId}/family/${memberIndex}`)
        .set(memberData)
        .then(() => updateTimestamp(user.uid, 'contacts'));
    }
  };
}

export function deleteFamilyMember(contactId, memberIndex) {
  return (dispatch, getStore) => {
    const { user, contacts } = getStore();
    const personToDelete = contacts[contactId].family[memberIndex];
    if (personToDelete.connection !== CONTACT_TYPE.PRIMARY) {
      // for secondary contacts, remove their contact entry too
      firebaseApp.database()
        .ref(`users/${user.uid}/contacts/${personToDelete.id}`)
        .remove();
    }
    firebaseApp.database()
      .ref(`users/${user.uid}/contacts/${contactId}/family/${memberIndex}`)
      .remove()
      .then(() => updateTimestamp(user.uid, 'contacts'));
  };
}

export function updateContactMethod(contactId, contactMethod) {
  return (dispatch, getStore) => {
    const { user } = getStore();
    firebaseApp.database()
      .ref(`users/${user.uid}/contacts/${contactId}/contactMethods/${contactMethod.id}`)
      .set(contactMethod)
      .then(() => updateTimestamp(user.uid, 'contacts'));
  };
}

export function deleteContactMethod(contactId, methodId) {
  return (dispatch, getStore) => {
    const { user } = getStore();
    firebaseApp.database()
      .ref(`users/${user.uid}/contacts/${contactId}/contactMethods/${methodId}`)
      .remove()
      .then(() => updateTimestamp(user.uid, 'contacts'));
  };
}

export function addRotation(rotation) {
  return (dispatch, getStore) => {
    const { user } = getStore();
    const newRotationKey = firebaseApp.database().ref(`users/${user.uid}/rotations`).push().key;
    return firebaseApp.database().ref(`users/${user.uid}/rotations/${newRotationKey}`)
      .set(_.extend({}, rotation, {
        id: newRotationKey
      }))
      .then(() => updateTimestamp(user.uid, 'rotations'))
      .then(() => dispatch(generateEventsForRotation(rotation, 'new')));
  };
}

export function updateRotation(rotation) {
  return (dispatch, getStore) => {
    const { user } = getStore();
    return firebaseApp.database()
      .ref(`users/${user.uid}/rotations/${rotation.id}`)
      .set(rotation)
      .then(() => updateTimestamp(user.uid, 'rotations'))
      // if you modify a rotation, all dates are out the window
      // this should probably be fine tuned so name & method changes don't trigger this
      .then(() => dispatch(generateEventsForRotation(rotation, 'new')));
  };
}

function generateEventSetFromRotation(rotation, events, mode = 'new') {
  // if update mode
  //  if timestamp of last event is before now
  //  add 3 more events starting from now
  // if new mode
  //  replace set entirely
  let timestamps = [];
  if (mode === 'update') {
    const lastEvent = _.findLast(rotation.events,
      event => event.status === EVENT_STATUS.NOT_DONE);
    const lastEventTimestamp = _.get(lastEvent, 'timestamp') || moment();
    if (lastEventTimestamp < moment().add(1, 'month').valueOf()) {
      timestamps = getTimestampsFromUntil(rotation, lastEventTimestamp, moment().add(1, 'month'));
    }
  } else if (mode === 'new') {
    timestamps = getTimestampsFromUntil(rotation, moment(), moment().add(1, 'month'));
  }
  // remove timestamps that already appear as originalTimestamp of an existing event
  // with same rotationId
  timestamps = _.filter(timestamps,
    timestamp => !_.find(events, { timestampOriginal: timestamp, rotationId: rotation.id }));
  return _.map(timestamps, timestamp => ({
    tries: [],
    rotationId: rotation.id,
    status: EVENT_STATUS.NOT_DONE,
    timestampOriginal: timestamp,
    timestamp
  }));
}

export function generateEventsForRotation(rotation, mode = 'new') {
  return (dispatch, getStore) => {
    const { user, events } = getStore();
    const newEventSet = generateEventSetFromRotation(rotation, mode);
    const newEvents = _(events)
      .filter(event => event.rotationId !== rotation.id)
      .concat(newEventSet)
      .sortBy('timestamp')
      .value();
    firebaseApp.database().ref(`users/${user.uid}/events`)
      .set(newEvents)
      .then(() => updateTimestamp(user.uid, 'events'));
  };
}

function scheduleNotificationsForAllEvents(events) {
  return (dispatch, getStore) => {
    const { rotations, contacts } = getStore();
    pushNotification.cancelAllLocalNotifications();
    _.forEach(events, (event, index) => {
      const rotation = rotations[event.rotationId];
      const contact = contacts[rotation.contactId];
      const eventName = `${rotation.name} (${contact.name})`;
      // I should notify on past-due events too, but differently?
      if (event.timestamp >= moment()) {
        pushNotification.localNotificationSchedule({
          id: `00${index}`,
          message: eventName,
          date: new Date(event.timestamp)
        });
      }
    });
  };
}

// generate all events from scratch based on rotations?
export function generateAllEvents(mode = 'new') {
  return (dispatch, getStore) => {
    const { user, rotations, events } = getStore();
    const eventList = _(rotations)
      .map(rotation => generateEventSetFromRotation(rotation, events, mode))
      .filter(eventSet => eventSet.length > 0)
      .flatten()
      .value();
    if (eventList.length > 0) {
      const mergedEvents = _.sortBy(events.concat(eventList), 'timestamp');
      return firebaseApp.database().ref(`users/${user.uid}/events`)
        .set(mergedEvents)
        .then(() => updateTimestamp(user.uid, 'events'))
        .then(() => {
          // dispatch(scheduleNotificationsForAllEvents(mergedEvents));
        });
    } else {
      // dispatch(scheduleNotificationsForAllEvents(events));
      // updateTimestamp(user.uid, 'events');
      return Promise.resolve();
    }
  };
}

export function setEventTried(event) {
  return (dispatch, getStore) => {
    const { user } = getStore();
    const tries = event.tries || [];
    return firebaseApp.database()
      .ref(`users/${user.uid}/events/${event.index}`).update({
        tries: tries.concat(moment().format(DATE_FORMAT))
      });
  };
}

export function setEventStatus(event, status) {
  return (dispatch, getStore) => {
    const { user } = getStore();
    return firebaseApp.database()
      .ref(`users/${user.uid}/events/${event.index}`).update({
        status
      });
  };
}

export function setEventTimestamp(event, timestamp) {
  return (dispatch, getStore) => {
    const { user } = getStore();
    return firebaseApp.database()
      .ref(`users/${user.uid}/events/${event.index}`).update({
        timestamp
      });
  };
}

export function schedulePushNotification() {
  return (dispatch) => {
    pushNotification.localNotificationSchedule({
      message: 'Notification message!',
      date: new Date(Date.now() + 1000)
    });
    // save state that event has been scheduled
  };
}
