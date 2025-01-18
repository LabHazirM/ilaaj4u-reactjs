import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACTIVITY_LOG,
  GET_REG_ADMIN_NOTIFICATION,
} from "./actionTypes";

import {
  getActivityLogSuccess,
  getActivityLogFail,
  getRegAdminNotificationFail,
  getRegAdminNotificationSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getActivityLog,
  getRegAdminNotification,
} from "../../helpers/django_api_helper";

function* fetchActivityLog(object) {
  try {
    const response = yield call(getActivityLog, object.payload);
    yield put(getActivityLogSuccess(response));
  } catch (error) {
    yield put(getActivityLogFail(error));
  }
}
function* fetchRegAdminNotification(object) {
  try {
    const response = yield call(getRegAdminNotification,
       object.payload.id,
       object.payload.previousApiCallTime,
       object.payload,
       );
       console.log("object saga",object)
    yield put(getRegAdminNotificationSuccess(response.data));
  } catch (error) {
    yield put(getRegAdminNotificationFail(error));
  }
}

function* regAdminNotificationSaga() {
  yield takeEvery(GET_ACTIVITY_LOG, fetchActivityLog);
  yield takeEvery(GET_REG_ADMIN_NOTIFICATION, fetchRegAdminNotification);
}

export default regAdminNotificationSaga;
