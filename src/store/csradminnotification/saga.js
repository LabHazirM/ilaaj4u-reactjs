import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACTIVITY_LOG,
  GET_CSR_ADMIN_NOTIFICATION,
} from "./actionTypes";

import {
  getActivityLogSuccess,
  getActivityLogFail,
  getCsrAdminNotificationFail,
  getCsrAdminNotificationSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getActivityLog,
  getCsrAdminNotification,
} from "../../helpers/django_api_helper";

function* fetchActivityLog(object) {
  try {
    const response = yield call(getActivityLog, object.payload);
    yield put(getActivityLogSuccess(response));
  } catch (error) {
    yield put(getActivityLogFail(error));
  }
}
function* fetchCsrAdminNotification(object) {
  try {
    const response = yield call(getCsrAdminNotification,
       object.payload.id,
       object.payload.previousApiCallTime,
       object.payload,
       );
       console.log("object saga",object)
    yield put(getCsrAdminNotificationSuccess(response.data));
  } catch (error) {
    yield put(getCsrAdminNotificationFail(error));
  }
}

function* csrAdminNotificationSaga() {
  yield takeEvery(GET_ACTIVITY_LOG, fetchActivityLog);
  yield takeEvery(GET_CSR_ADMIN_NOTIFICATION, fetchCsrAdminNotification);
}

export default csrAdminNotificationSaga;
