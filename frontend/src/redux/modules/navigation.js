import { createSagaAction } from '../../shared/sagas';
import { createReducer } from '../../shared/reducers';

/**
 * Constants
 */
export const constants = {
  NAVIGATION_CHANGE: createSagaAction('NAVIGATION_CHANGE')
};

/**
 * Actions
 */
export const actions = {
  navigationChange: (event, value) => {
    return { type: constants.NAVIGATION_CHANGE.ACTION, value };
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
    case constants.NAVIGATION_CHANGE.ACTION:
      return { ...state, value: value };
  }
});
