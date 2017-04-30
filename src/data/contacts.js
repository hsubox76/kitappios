import {
  CONTACT_TYPE,
  FAM_TYPE,
  METHOD_TYPE
} from './constants';

/**
 * Rules:
 * - Don't store family for secondary contacts
 * - family member "title" is editable and displayed, "type" is not visible
 *   and hardcoded for system use
 * - birthdate format MM-DD-YYYY
 * **/
export const contacts = {
  a: {
    id: 'a',
    name: 'Mom',
    connection: CONTACT_TYPE.PRIMARY,
    birthdate: '09-09-1959',
    rotationIds: [1, 2],
    contactMethods: {
      cm_a: {
        id: 'cm_a',
        type: METHOD_TYPE.CALL,
        data: '555-555-1234'
      },
      cm_b: {
        id: 'cm_b',
        type: METHOD_TYPE.TEXT,
        data: '555-111-1234'
      },
      cm_c: {
        id: 'cm_c',
        type: METHOD_TYPE.EMAIL,
        data: 'mom@mom.mom'
      },
      cm_d: {
        id: 'cm_d',
        type: METHOD_TYPE.POSTAL,
        data: [
          { fieldName: 'street', value: '123 Fake Street' },
          { fieldName: 'city', value: 'Faketown' },
          { fieldName: 'state', value: 'CA' },
          { fieldName: 'postcode', value: '90210' },
          { fieldName: 'country', value: 'USA' },
        ]
      },
    },
  },
  b: {
    id: 'b',
    name: 'Kevin',
    connection: CONTACT_TYPE.PRIMARY,
    birthdate: '07-07-1979',
    rotationsIds: [3],
    contactMethods: {
      cm_a: {
        id: 'cm_a',
        type: METHOD_TYPE.EMAIL,
        data: 'kevin@kevin.kevin'
      },
    },
    family: [
      { id: 'c', type: FAM_TYPE.PARTNER, title: 'husband' },
      { id: 'd', type: FAM_TYPE.CHILD, title: 'kid' }
    ]
  },
  c: {
    id: 'c',
    name: 'Nathalie',
    connection: CONTACT_TYPE.PRIMARY,
    birthdate: '12-07-1980',
    rotationsIds: [4],
    contactMethods: {
      cm_a: {
        id: 'cm_a',
        type: METHOD_TYPE.CALL,
        data: '555-123-4567'
      },
    },
    family: [
      { id: 'b', type: FAM_TYPE.PARTNER, title: 'husband' },
      { id: 'd', type: FAM_TYPE.CHILD, title: 'kid' }
    ]
  },
  d: {
    id: 'd',
    name: 'Davis',
    connection: CONTACT_TYPE.SECONDARY,
    birthdate: '01-01-2011'
  }
};
