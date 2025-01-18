import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACTIVITY_LOG_MARKETER,
  GET_LAB_ACTIVITY_LOG_MARKETER,
} from "./actionTypes";

import {
  getActivityLogMarketerSuccess,
  getActivityLogMarketerFail,
  getLabActivityLogMarketerSuccess,
  getLabActivityLogMarketerFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getActivityLogMarketer,
  getLabActivityLogMarketer,
} from "../../helpers/django_api_helper";

function* fetchActivityLogMarketer(object) {
  try {
    const response = yield call(getActivityLogMarketer, object.payload);
    yield put(getActivityLogMarketerSuccess(response));
  } catch (error) {
    yield put(getActivityLogMarketerFail(error));
  }
}
function* fetchLabActivityLogMarketer(object) {
  try {
    const response = yield call(getLabActivityLogMarketer, object.payload);
    yield put(getLabActivityLogMarketerSuccess(response));
  } catch (error) {
    yield put(getLabActivityLogMarketerFail(error));
  }
}

function* activitylogmarketerSaga() {
  yield takeEvery(GET_ACTIVITY_LOG_MARKETER, fetchActivityLogMarketer);
  yield takeEvery(GET_LAB_ACTIVITY_LOG_MARKETER, fetchLabActivityLogMarketer);
}

export default activitylogmarketerSaga;
