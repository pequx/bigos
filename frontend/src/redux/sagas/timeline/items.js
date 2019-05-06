import { all, fork, call, put, takeLatest } from 'redux-saga/effects';

import { constants } from '../../modules/timeline/items';
import * as api from '../../api/timeline/items';

function* fetchItems(action) {
  try {
    let payload = yield call(api.getItemsList, action);
    payload = {
      records: payload,
      total: payload.length
    };
    yield put({ type: constants.ITEMS_REFRESH.SUCCESS, payload });
  } catch (e) {
    yield put({
      type: constants.ITEMS_REFRESH.FAILED,
      message: e.message || e
    });
  }
}

/**
 * Saga
 */
function* itemsRefresh() {
  yield takeLatest(constants.ITEMS_REFRESH.ACTION, fetchItems);
}

/**
 * Export the root saga by forking all available sagas
 */
export function* rootSaga() {
  // add more sagas here
  yield all([fork(itemsRefresh)]);
}
