import { ACTIONS } from '../actions/types';
import _ from 'lodash';

export default function ui(state = {}, action) {
  switch (action.type) {
    case ACTIONS.TEST:
      return state;
    case ACTIONS.SET_PAGE_INDEX:
      return Object.assign({}, state, { currentPageIndex: action.payload.index });
    case ACTIONS.SET_NAVIGATION_DESTINATION:
      const newState = {};
      if (!_.isUndefined(action.payload.index)) {
        newState.desiredPageIndex = action.payload.index;
      }
      if (!_.isUndefined(action.payload.stack)) {
        newState.desiredNavigationStack = action.payload.stack;
      }
      return Object.assign({}, state, newState);
    case ACTIONS.SET_STORE:
    case ACTIONS.SET_LAST_UPDATED:
      return Object.assign({}, state, {
        lastUpdated: _.extend({}, state.lastUpdated, action.payload.lastUpdated)
      });
    case ACTIONS.SET_CONTACTS:
    case ACTIONS.SET_ROTATIONS:
      return Object.assign({}, state, {
        hasUnsavedChanges: false
      });
    case ACTIONS.UPDATE_CONTACT_METHOD:
      return Object.assign({}, state, { hasUnsavedChanges: true });
    case ACTIONS.SET_MODAL_VISIBILITY:
      return Object.assign({}, state, { contactModalVisible: action.payload.isVisible });
    case ACTIONS.SET_SELECTED_CONTACT:
      return Object.assign({}, state, { selectedContactId: action.payload.contactId });
    default:
      return state;
  }
}
