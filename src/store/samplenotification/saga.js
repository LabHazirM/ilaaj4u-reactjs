import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACTIVITY_LOG,
  GET_SAMPLE_NOTIFICATION,
} from "./actionTypes";

import {
  getActivityLogSuccess,
  getActivityLogFail,
  getSampleNotificationFail,
  getSampleNotificationSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getActivityLog,
  getSampleNotification,
} from "../../helpers/django_api_helper";

function* fetchActivityLog(object) {
  try {
    const response = yield call(getActivityLog, object.payload);
    yield put(getActivityLogSuccess(response));
  } catch (error) {
    yield put(getActivityLogFail(error));
  }
}
function* fetchSampleNotification(object) {
  try {
    const response = yield call(getSampleNotification,
       object.payload.id,
       object.payload.previousApiCallTime,
       object.payload,
       );
       console.log("object saga",object)
    yield put(getSampleNotificationSuccess(response.data));
  } catch (error) {
    yield put(getSampleNotificationFail(error));
  }
}

function* sampleNotificationSaga() {
  yield takeEvery(GET_ACTIVITY_LOG, fetchActivityLog);
  yield takeEvery(GET_SAMPLE_NOTIFICATION, fetchSampleNotification);
}

export default sampleNotificationSaga;
