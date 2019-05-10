import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import history from '../../../history';
import { constants } from '../../modules/timeline/navigation';
import { routes } from '../../../constants';

function* changeNavigation(action) {
  try {
    yield put({ type: constants.TIMELINE_NAVIGATION_CHANGE.SUCCESS, value: action.value });
    yield call(
      history.push,
      `${routes.timeline.home}/${action.value !== 'all' ? action.value : ''}`
    );
  } catch (e) {
    yield put({
      type: constants.TIMELINE_NAVIGATION_CHANGE.FAILED,
      message: e.message || e
    });
  }
}

function* watchChangeNavigation() {
  yield takeLatest(constants.TIMELINE_NAVIGATION_CHANGE.ACTION, changeNavigation);
}

export function* rootSaga() {
  yield all([fork(watchChangeNavigation)]);
}
