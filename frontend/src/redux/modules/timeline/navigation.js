import { createSagaAction } from '../../../shared/sagas';
import { createReducer } from '../../../shared/reducers';
/**
 * Constants
 */
export const constants = {
  TIMELINE_NAVIGATION_CHANGE: createSagaAction('TIMELINE_NAVIGATION_CHANGE')
};

/**
 * Actions
 */
export const actions = {
  navigationChange: (event, value = false) => {
    return { type: constants.TIMELINE_NAVIGATION_CHANGE.ACTION, value };
  }
};

/**
 * Reducer
 */
const initialState = {
  value: false
};

export default createReducer(initialState, (state, { type, value }) => {
  switch (type) {
    default:
      return state;
    case constants.TIMELINE_NAVIGATION_CHANGE.ACTION:
      return { ...state, value: value };
  }
});
