import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_LABS_LIST,GET_LABS_AUDIT_LIST,  GET_DONORS_LIST, GET_DONORSA,GET_LC_LIST,GET_LABS_ALL_AUDIT_LIST, GET_CORPORATE_LIST } from "./actionTypes";

import {
  getLabsListSuccess,
  getLabsListFail,
  getLabsAuditListSuccess,
  getLabsAuditListFail,
  getDonorsListSuccess,
  getDonorsListFail,
  getDonorsASuccess,
  getDonorsAFail,
  getLcListSuccess,
  getLcListFail,
  getCorporateListSuccess,
  getCorporateListFail,
  getLabsAllAuditListSuccess,
  getLabsAllAuditListFail
} from "./actions";

//Include Both Helper File with needed methods
import { getLabsList ,getDonorsList, getDonorsA,getLcList ,getCorporateList, getLabsAuditList, getLabsAllAuditList} from "../../helpers/django_api_helper";

function* fetchLabsList(object) {
  try {
    const response = yield call(getLabsList, object.payload);
    yield put(getLabsListSuccess(response));
  } catch (error) {
    yield put(getLabsListFail(error));
  }
}

function* fetchLabsAuditList(object) {
  try {
    const response = yield call(getLabsAuditList, object.payload);
    yield put(getLabsAuditListSuccess(response));
  } catch (error) {
    yield put(getLabsAuditListFail(error));
  }
}

function* fetchLabAllAudits(object) {
  try {
    const response = yield call(getLabsAllAuditList, object.payload);
    yield put(getLabsAllAuditListSuccess(response));
  } catch (error) {
    yield put(getLabsAllAuditListFail(error));
  }
}

function* fetchDonorsList(object) {
  try {
    const response = yield call(getDonorsList, object.payload);
    yield put(getDonorsListSuccess(response));
  } catch (error) {
    yield put(getDonorsListFail(error));
  }
}
function* fetchCorporateList(object) {
  try {
    const response = yield call(getCorporateList, object.payload);
    yield put(getCorporateListSuccess(response));
  } catch (error) {
    yield put(getCorporateListFail(error));
  }
}
function* fetchLcList(object) {
  try {
    const response = yield call(getLcList, object.payload);
    yield put(getLcListSuccess(response));
  } catch (error) {
    yield put(getLcListFail(error));
  }
}
function* fetchDonorsA(object) {
  try {
    const response = yield call(getDonorsA, object.payload);
    yield put(getDonorsASuccess(response));
  } catch (error) {
    yield put(getDonorsAFail(error));
  }
}

function* LabsSaga() {
  yield takeEvery(
    GET_LABS_ALL_AUDIT_LIST,
    fetchLabAllAudits
  );
  yield takeEvery(
    GET_LABS_LIST,
    fetchLabsList
  );
  yield takeEvery(
    GET_LABS_AUDIT_LIST,
    fetchLabsAuditList
  );
  yield takeEvery(
    GET_DONORS_LIST,
    fetchDonorsList
  );
  yield takeEvery(
    GET_CORPORATE_LIST,
    fetchCorporateList
  );
  yield takeEvery(
    GET_LC_LIST,
    fetchLcList
  );
yield takeEvery(GET_DONORSA, fetchDonorsA);

}

export default LabsSaga;
