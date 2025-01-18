import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACTIVITY_LOG,
  GET_CSR_OFFICER_NOTIFICATION,
} from "./actionTypes";

import {
  getActivityLogSuccess,
  getActivityLogFail,
  getCsrOfficerNotificationFail,
  getCsrOfficerNotificationSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getActivityLog,
  getCsrOfficerNotification,
} from "../../helpers/django_api_helper";

function* fetchActivityLog(object) {
  try {
    const response = yield call(getActivityLog, object.payload);
    yield put(getActivityLogSuccess(response));
  } catch (error) {
    yield put(getActivityLogFail(error));
  }
}
function* fetchCsrOfficerNotification(object) {
  try {
    const response = yield call(getCsrOfficerNotification,
       object.payload.id,
       object.payload.previousApiCallTime,
       object.payload,
       );
       console.log("object saga",object)
    yield put(getCsrOfficerNotificationSuccess(response.data));
  } catch (error) {
    yield put(getCsrOfficerNotificationFail(error));
  }
}

function* csrOfficerNotificationSaga() {
  yield takeEvery(GET_ACTIVITY_LOG, fetchActivityLog);
  yield takeEvery(GET_CSR_OFFICER_NOTIFICATION, fetchCsrOfficerNotification);
}

export default csrOfficerNotificationSaga;
