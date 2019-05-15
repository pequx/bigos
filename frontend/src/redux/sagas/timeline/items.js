import { all, fork, call, put, takeLatest } from 'redux-saga/effects';

import { constants } from '../../modules/timeline/items';
import * as api from '../../api/timeline/items';
import { schema } from '../../../constants';

const _ = require('lodash');
const moment = require('moment');

function* fetchItems(action) {
  try {
    let payload = yield call(api.getItemsList, action);
    payload = {
      records: payload,
      total: payload.length,
      config: refreshConfig(payload)
    };
    yield put({ type: constants.ITEMS_REFRESH.SUCCESS, payload });
  } catch (e) {
    yield put({
      type: constants.ITEMS_REFRESH.FAILED,
      message: e.message || e
    });
  }
}

function refreshConfig(payload) {
  const { column } = schema.timeline.item;
  const values = {
    min: moment(_.first(payload)[column.start]).add(-12, 'month'),
    max: moment(_.last(payload)[column.start]).add(12, 'month')
  };

  return payload
    ? {
        timeline: {
          width: '100%',
          height: '300px',
          min: values.min,
          max: values.max,
          start: values.min,
          end: values.max,
          zoomMin: Number('7.884e+9'),
          zoomMax: 315360000000000,
          autoResize: true,
          zoomable: true
        }
      }
    : false;
}

/**
 * Saga
 */
function* itemsRefresh() {
  yield takeLatest(constants.ITEMS_REFRESH.ACTION, fetchItems);
}

// function* configRefresh() {
//   yield takeLatest(constants.CONFIG_REFRESH.ACTION, refreshConfig);
// }

/**
 * Export the root saga by forking all available sagas
 */
export function* rootSaga() {
  yield all([fork(itemsRefresh)]);
}
