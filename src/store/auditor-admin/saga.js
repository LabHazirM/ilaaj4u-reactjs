import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_PENDING_AUDITS,
  GET_INPROCESS_AUDITS,
  GET_PASSED_AUDITS,
  GET_FAILED_AUDITS,
  ASSIGN_AUDIT,
  ADD_LABS_AUDIT
} from "./actionTypes";

import {
  getPendingAuditsSuccess,
  getPendingAuditsFail,
  getInProcessAuditsSuccess,
  getInProcessAuditsFail,
  getPassedAuditsSuccess,
  getPassedAuditsFail,
  getFailedAuditsSuccess,
  getFailedAuditsFail,
  assignAuditSuccess,
  assignAuditFail,
  AddAllLabsAuditSuccess,
  AddAllLabsAuditFail
} from "./actions";

//Include Both Helper File with needed methods
import {
  getPendingAudits,
  getInProcessAudits,
  getPassedAudits,
  getFailedAudits,
  assignAudit,
  AddAllLabsAudit
} from "../../helpers/django_api_helper";

function* fetchPendingAudits() {
  try {
    const response = yield call(getPendingAudits);
    yield put(getPendingAuditsSuccess(response));
  } catch (error) {
    yield put(getPendingAuditsFail(error));
  }
}

function* fetchInProcessAudits(object) {
  try {
    const response = yield call(getInProcessAudits, object.payload.id);
    yield put(getInProcessAuditsSuccess(response));
  } catch (error) {
    yield put(getInProcessAuditsFail(error));
  }
}

function* fetchPassedAudits(object) {
  try {
    const response = yield call(getPassedAudits, object.payload.id);
    yield put(getPassedAuditsSuccess(response));
  } catch (error) {
    yield put(getPassedAuditsFail(error));
  }
}
function* fetchFailedAudits(object) {
  try {
    const response = yield call(getFailedAudits, object.payload.id);
    yield put(getFailedAuditsSuccess(response));
  } catch (error) {
    yield put(getFailedAuditsFail(error));
  }
}

function* onAssignAudit(object) {
  try {
    const response = yield call(assignAudit, object.payload.data);
    yield put(assignAuditSuccess(response));
  } catch (error) {
    yield put(assignAuditFail(error));
  }
}

function* onAddLabAudit(object) {
  try {
    const response = yield call(AddAllLabsAudit, object.payload.data);
    yield put(AddAllLabsAuditSuccess(response));
  } catch (error) {
    yield put(AddAllLabsAuditFail(error));
  }
}

function* auditorAdminSaga() {
  yield takeEvery(ADD_LABS_AUDIT, onAddLabAudit);
  yield takeEvery(GET_PENDING_AUDITS, fetchPendingAudits);
  yield takeEvery(GET_INPROCESS_AUDITS, fetchInProcessAudits);
  yield takeEvery(GET_PASSED_AUDITS, fetchPassedAudits);
  yield takeEvery(GET_FAILED_AUDITS, fetchFailedAudits);
  yield takeEvery(ASSIGN_AUDIT, onAssignAudit);
}

export default auditorAdminSaga;
