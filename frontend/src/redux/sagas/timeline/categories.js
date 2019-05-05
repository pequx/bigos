import { all, fork, call, put, takeLatest } from 'redux-saga/effects';

import { constants } from '../../modules/timeline/categories';
import * as api from '../../api/timeline/categories';

function* fetchCategories(action) {
  try {
    let payload = yield call(api.getCategoriesList, action);
    payload = {
      records: payload,
      total: payload.length
    };
    yield put({ type: constants.CATEGORIES_REFRESH.SUCCESS, payload });
  } catch (e) {
    yield put({
      type: constants.CATEGORIES_REFRESH.FAILED,
      message: e.message || e
    });
  }
}

/**
 * Saga
 */
function* categoriesRefresh() {
  yield takeLatest(constants.CATEGORIES_REFRESH.ACTION, fetchCategories);
}

/**
 * Export the root saga by forking all available sagas
 */
export function* rootSaga() {
  // add more sagas here
  yield all([fork(categoriesRefresh)]);
}
