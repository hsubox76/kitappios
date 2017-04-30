import { AsyncStorage } from 'react-native';

const STORAGE_KEYS = {
  CONTACTS: 'CONTACTS',
  ROTATIONS: 'ROTATIONS',
  EVENTS: 'EVENTS'
};

export function writeStoreToStorage(store) {
  const { contacts, rotations, events } = store;
  return new Promise((resolve, reject) => {
    AsyncStorage.multiSet([
      [STORAGE_KEYS.CONTACTS, JSON.stringify(contacts)],
      [STORAGE_KEYS.ROTATIONS, JSON.stringify(rotations)],
      [STORAGE_KEYS.EVENTS, JSON.stringify(events)],
    ])
    .then(() => resolve(true))
    .catch(error => reject(error));
  });
}

export function getStoreFromStorage() {
  return new Promise((resolve, reject) => {
    AsyncStorage.multiGet([
      STORAGE_KEYS.CONTACTS,
      STORAGE_KEYS.ROTATIONS,
      STORAGE_KEYS.EVENTS
    ])
    .then(result => {
      const parsedResult = {
        contacts: JSON.parse(result[0][1]),
        rotations: JSON.parse(result[1][1]),
        events: JSON.parse(result[2][1])
      };
      resolve(parsedResult);
    })
    .catch(error => reject(error));
  });
}
