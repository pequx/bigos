import { all, fork } from 'redux-saga/effects';

import { rootSaga as products } from './products';
import { rootSaga as account } from './account';
import { rootSaga as timelineCategories } from './timeline/categories';
import { rootSaga as timelineItems } from './timeline/items';

function* rootSaga() {
  yield all([fork(products), fork(account), fork(timelineCategories), fork(timelineItems)]);
}

export default rootSaga;
