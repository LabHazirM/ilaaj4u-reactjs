import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ASSIGNED_AUDITS,
  GET_LAB_AUDITS,
  ADD_NEW_AUDIT,
  UPDATE_ASSIGNED_AUDITS,
  GET_AUDITORS_COMPLETED_AUDITS,
  UPDATE_AUDITS_STATUS
} from "./actionTypes";

import {
  getAssignedAuditsSuccess,
  getAssignedAuditsFail,
  addAuditFail,
  addAuditSuccess,
  getLabAuditsSuccess,
  getLabAuditsFail,
  getAuditorsCompletedAuditsSuccess,
  getAuditorsCompletedAuditsFail,
  updateAssignedAuditsSuccess,
  updateAssignedAuditsFail,
  UpdateAuditStatusSuccess,
  UpdateAuditStatusFail
} from "./actions";

//Include Both Helper File with needed methods
import {
  getAssignedAudits,
  addNewAudit,
  getLabAudits,
  getAuditorsCompletedAudits,
  updateAssignedAudits,
  UpdateAuditStatus,
 
} from "../../helpers/django_api_helper";

function* fetchAssignedAudits(object) {
  try {
    const response = yield call(getAssignedAudits, object.payload);
    yield put(getAssignedAuditsSuccess(response.data));
  } catch (error) {
    yield put(getAssignedAuditsFail(error));
  }
}
function* onUpdateAuditStatus({ payload: audit }) {
  try {
    const response = yield call(UpdateAuditStatus, audit);
    yield put(UpdateAuditStatusSuccess(response));
  } catch (error) {
    yield put(UpdateAuditStatusFail(error));
  }
}

function* onAddNewAudit(object) {
  console.log("data in saga is", object.payload.audit,object.payload.id )
  try {
    const response = yield call(
      addNewAudit,
      object.payload.audit,
      object.payload.id
    );
    yield put(addAuditSuccess(response));
  } catch (error) {
    yield put(addAuditFail(error));
  
  }
}
function* fetchLabAudits(object) {
  try {
    const response = yield call(getLabAudits, object.payload);
    yield put(getLabAuditsSuccess(response.data));
  } catch (error) {
    yield put(getLabAuditsFail(error));
  }
}

function* onUpdateAssignedAudits(object) {
  try {
    console.log(" object.payload: ", object.payload.assignedAudits);
    const response = yield call(
      updateAssignedAudits,
      object.payload.assignedAudits
    );
    yield put(updateAssignedAuditsSuccess(response));
  } catch (error) {
    yield put(updateAssignedAuditsFail(error));
  }
}

function* fetchAuditorsCompletedAudits(object) {
  try {
    const response = yield call(getAuditorsCompletedAudits, object.payload);
    yield put(getAuditorsCompletedAuditsSuccess(response.data));
  } catch (error) {
    yield put(getAuditorsCompletedAuditsFail(error));
  }
}
function* auditsSaga() {
  yield takeEvery(UPDATE_AUDITS_STATUS, onUpdateAuditStatus);
  yield takeEvery(GET_ASSIGNED_AUDITS, fetchAssignedAudits);
  yield takeEvery(ADD_NEW_AUDIT, onAddNewAudit);
  yield takeEvery(GET_LAB_AUDITS, fetchLabAudits);
  yield takeEvery(GET_AUDITORS_COMPLETED_AUDITS, fetchAuditorsCompletedAudits);
  yield takeEvery(UPDATE_ASSIGNED_AUDITS, onUpdateAssignedAudits);
}

export default auditsSaga;
