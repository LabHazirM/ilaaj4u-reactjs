import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACTIVITY_LOG,
  GET_MARKETER_NOTIFICATION,
} from "./actionTypes";

import {
  getActivityLogSuccess,
  getActivityLogFail,
  getMarketerNotificationFail,
  getMarketerNotificationSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getActivityLog,
  getMarketerNotification,
} from "../../helpers/django_api_helper";

function* fetchActivityLog(object) {
  try {
    const response = yield call(getActivityLog, object.payload);
    yield put(getActivityLogSuccess(response));
  } catch (error) {
    yield put(getActivityLogFail(error));
  }
}
function* fetchMarketerNotification(object) {
  try {
    const response = yield call(getMarketerNotification,
       object.payload.id,
       object.payload.previousApiCallTime,
       object.payload,
       );
       console.log("object saga",object)
    yield put(getMarketerNotificationSuccess(response.data));
  } catch (error) {
    yield put(getMarketerNotificationFail(error));
  }
}

function* marketerNotificationSaga() {
  yield takeEvery(GET_ACTIVITY_LOG, fetchActivityLog);
  yield takeEvery(GET_MARKETER_NOTIFICATION, fetchMarketerNotification);
}

export default marketerNotificationSaga;
