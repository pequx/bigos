import { createSagaAction } from '../../../shared/sagas';
import { createReducer } from '../../../shared/reducers';
import history from '../../../history';
import { routes } from '../../../constants';

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
    history.push(`${routes.timeline.home}/${value}`);
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
