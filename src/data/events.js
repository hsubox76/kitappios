import { METHOD_TYPE } from './constants';

export const events = {
  aaa: {
    id: 'aaa',
    contactId: 'a',
    name: 'text Mom',
    time: 1467590156054,
    method: METHOD_TYPE.TEXT
  },
  bbb: {
    id: 'bbb',
    contactId: 'b',
    name: 'email Kevin',
    time: 1467668604015,
    method: METHOD_TYPE.EMAIL
  },
  ccc: {
    id: 'ccc',
    contactId: 'c',
    name: 'call Nathalie to ask how vacation to Mexico went'
      + 'and also talk about some other things too',
    time: 1468981860760,
    method: METHOD_TYPE.CALL
  },
  ddd: {
    id: 'ddd',
    contactId: 'a',
    name: 'email Mom about schedule',
    time: 1468981860760,
    method: METHOD_TYPE.EMAIL
  },
};
