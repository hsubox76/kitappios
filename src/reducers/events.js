import { ACTIONS } from '../actions/types';

export default function events(state, action) {
  switch (action.type) {
    case ACTIONS.SET_STORE:
      if (action.payload.events) {
        return action.payload.events;
      }
      return state;
    case ACTIONS.SET_EVENTS:
      return action.payload.events;
    case ACTIONS.UPDATE_EVENTS:
      // just overwrite for now, be more complex later
      return action.events;
    default:
      return state;
  }
}
