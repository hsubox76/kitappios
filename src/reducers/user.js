import { ACTIONS } from '../actions/types';

export default function user(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return action.payload.user;
    default:
      return state;
  }
}
