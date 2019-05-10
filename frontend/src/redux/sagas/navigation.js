import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import history from '../../history';
import { constants } from '../modules/navigation';
import { routes } from '../../constants';

function* changeNavigation(action) {
  try {
    yield put({ type: constants.NAVIGATION_CHANGE.SUCCESS, value: action.value });

    if (action.value === 0) {
      yield call(history.push, routes.home);
    }
    if (action.value === 1) {
      yield call(history.push, routes.timeline.home);
    }
  } catch (e) {
    yield put({
      type: constants.NAVIGATION_CHANGE.FAILED,
      message: e.message || e
    });
  }
}

function* watchChangeNavigation() {
  yield takeLatest(constants.NAVIGATION_CHANGE.ACTION, changeNavigation);
}

export function* rootSaga() {
  yield all([fork(watchChangeNavigation)]);
}
