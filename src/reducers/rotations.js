import { ACTIONS } from '../actions/types';

export default function rotations(state, action) {
  switch (action.type) {
    case ACTIONS.SET_STORE:
      if (action.payload.rotations) {
        return action.payload.rotations;
      }
      return state;
    case ACTIONS.SET_ROTATIONS:
      return action.payload.rotations;
    default:
      return state;
  }
}
