import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_PENDING_COMPLAINTS,
  GET_PENDING_COMPLAINTS_LABHAZIR,
  GET_INPROCESS_COMPLAINTS,
  GET_INPROCESS_COMPLAINTS_LABHAZIR,
  GET_RESOLVED_COMPLAINTS,
  GET_RESOLVED_COMPLAINTS_LABHAZIR,
  ASSIGN_COMPLAINT,
} from "./actionTypes";

import {
  getPendingComplaintsSuccess,
  getPendingComplaintsFail,
  getPendingComplaintsLabhazirSuccess,
  getPendingComplaintsLabhazirFail,
  getInProcessComplaintsSuccess,
  getInProcessComplaintsFail,
  getInProcessComplaintsLabhazirSuccess,
  getInProcessComplaintsLabhazirFail,
  getResolvedComplaintsSuccess,
  getResolvedComplaintsFail,
  getResolvedComplaintsLabhazirSuccess,
  getResolvedComplaintsLabhazirFail,
  assignComplaintSuccess,
  assignComplaintFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getPendingComplaints,
  getPendingComplaintsLabhazir,
  getInProcessComplaints,
  getInProcessComplaintsLabhazir,
  getResolvedComplaints,
  getResolvedComplaintsLabhazir,
  assignComplaint,
} from "../../helpers/django_api_helper";

function* fetchPendingComplaints() {
  try {
    const response = yield call(getPendingComplaints);
    yield put(getPendingComplaintsSuccess(response));
  } catch (error) {
    yield put(getPendingComplaintsFail(error));
  }
}
function* fetchPendingComplaintsLabhazir() {
  try {
    const response = yield call(getPendingComplaintsLabhazir);
    yield put(getPendingComplaintsLabhazirSuccess(response));
  } catch (error) {
    yield put(getPendingComplaintsLabhazirFail(error));
  }
}
function* fetchInProcessComplaints(object) {
  try {
    const response = yield call(getInProcessComplaints, object.payload.id);
    yield put(getInProcessComplaintsSuccess(response));
  } catch (error) {
    yield put(getInProcessComplaintsFail(error));
  }
}
function* fetchInProcessComplaintsLabhazir(object) {
  try {
    const response = yield call(getInProcessComplaintsLabhazir, object.payload.id);
    yield put(getInProcessComplaintsLabhazirSuccess(response));
  } catch (error) {
    yield put(getInProcessComplaintsLabhazirFail(error));
  }
}

function* fetchResolvedComplaints(object) {
  try {
    const response = yield call(getResolvedComplaints, object.payload.id);
    yield put(getResolvedComplaintsSuccess(response));
  } catch (error) {
    yield put(getResolvedComplaintsFail(error));
  }
}
function* fetchResolvedComplaintsLabhazir(object) {
  try {
    const response = yield call(getResolvedComplaintsLabhazir, object.payload.id);
    yield put(getResolvedComplaintsLabhazirSuccess(response));
  } catch (error) {
    yield put(getResolvedComplaintsLabhazirFail(error));
  }
}

function* onAssignComplaint(object) {
  try {
    const response = yield call(assignComplaint, object.payload.data);
    yield put(assignComplaintSuccess(response));
  } catch (error) {
    yield put(assignComplaintFail(error));
  }
}

function* csrAdminSaga() {
  yield takeEvery(GET_PENDING_COMPLAINTS, fetchPendingComplaints);
  yield takeEvery(GET_PENDING_COMPLAINTS_LABHAZIR, fetchPendingComplaintsLabhazir);
  yield takeEvery(GET_INPROCESS_COMPLAINTS, fetchInProcessComplaints);
  yield takeEvery(GET_INPROCESS_COMPLAINTS_LABHAZIR, fetchInProcessComplaintsLabhazir);
  yield takeEvery(GET_RESOLVED_COMPLAINTS, fetchResolvedComplaints);
  yield takeEvery(GET_RESOLVED_COMPLAINTS_LABHAZIR, fetchResolvedComplaintsLabhazir);
  yield takeEvery(ASSIGN_COMPLAINT, onAssignComplaint);
}

export default csrAdminSaga;
