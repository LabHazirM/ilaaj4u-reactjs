import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACTIVITY_LOG_AUDITOR,
} from "./actionTypes";

import {
  getActivityLogAuditorSuccess,
  getActivityLogAuditorFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getActivityLogAuditor,
} from "../../helpers/django_api_helper";

function* fetchActivityLogAuditor(object) {
  try {
    const response = yield call(getActivityLogAuditor, object.payload);
    yield put(getActivityLogAuditorSuccess(response));
  } catch (error) {
    yield put(getActivityLogAuditorFail(error));
  }
}

function* activitylogauditorSaga() {
  yield takeEvery(GET_ACTIVITY_LOG_AUDITOR, fetchActivityLogAuditor);
}

export default activitylogauditorSaga;
