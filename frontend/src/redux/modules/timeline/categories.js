import { createSagaAction } from '../../../shared/sagas';
import { createReducer } from '../../../shared/reducers';

/**
 * Constants
 */
export const constants = {
  CATEGORIES_REFRESH: createSagaAction('CATEGORIES_REFRESH')
};

/**
 * Actions
 */
export const actions = {
  categoriesRefresh: () => ({ type: constants.CATEGORIES_REFRESH.ACTION })
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
    case constants.CATEGORIES_REFRESH.SUCCESS:
      return { ...state, records: payload.records, total: payload.total };
  }
});
