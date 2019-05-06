import { createSagaAction } from '../../../shared/sagas';
import { createReducer } from '../../../shared/reducers';

/**
 * Constants
 */
export const constants = {
  ITEMS_REFRESH: createSagaAction('ITEMS_REFRESH')
};

/**
 * Actions
 */
export const actions = {
  itemsRefresh: (criteria = false) => ({ type: constants.ITEMS_REFRESH.ACTION, criteria })
};

/**
 * Reducer
 */
const initialState = {
  records: false,
  total: 0
};

export default createReducer(initialState, (state, { type, payload }) => {
  switch (type) {
    default:
      return state;
    case constants.ITEMS_REFRESH.SUCCESS:
      return { ...state, records: payload.records, total: payload.total };
  }
});
