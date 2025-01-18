import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACTIVITY_LOG,
  GET_NOTIFICATION,
} from "./actionTypes";

import {
  getActivityLogSuccess,
  getActivityLogFail,
  getNotificationFail,
  getNotificationSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getActivityLog,
  getNotification,
} from "../../helpers/django_api_helper";

function* fetchActivityLog(object) {
  try {
    const response = yield call(getActivityLog, object.payload);
    yield put(getActivityLogSuccess(response));
  } catch (error) {
    yield put(getActivityLogFail(error));
  }
}
function* fetchNotification(object) {
  try {
    const response = yield call(getNotification,
       object.payload.id,
       object.payload.previousApiCallTime,
       object.payload,
       );
       console.log("object saga",object)
    yield put(getNotificationSuccess(response.data));
  } catch (error) {
    yield put(getNotificationFail(error));
  }
}

function* activitylogSaga() {
  yield takeEvery(GET_ACTIVITY_LOG, fetchActivityLog);
  yield takeEvery(GET_NOTIFICATION, fetchNotification);
}

export default activitylogSaga;
