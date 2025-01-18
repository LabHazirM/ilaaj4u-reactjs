import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_PENDING_CORPORATE,
  GET_APPROVED_CORPORATE,
  GET_UNAPPROVED_CORPORATE,
  APPROVE_UNAPPROVE_CORPORATE,

  GET_PENDING_LABS,
  GET_APPROVED_LABS,
  GET_UNAPPROVED_LABS,
  APPROVE_UNAPPROVE_LAB,
  GET_PENDING_B2B_CLIENTS,
  GET_APPROVED_B2B_CLIENTS,
  GET_UNAPPROVED_B2B_CLIENTS,
  APPROVE_UNAPPROVE_B2B_CLIENT,
  GET_PENDING_DONORS,
  GET_APPROVED_DONORS,
  GET_UNAPPROVED_DONORS,
  APPROVE_UNAPPROVE_DONOR,
} from "./actionTypes";

import {
  getPendingCorporateSuccess,
  getPendingCorporateFail,
  getApprovedCorporateSuccess,
  getApprovedCorporateFail,
  getUnapprovedCorporateSuccess,
  getUnapprovedCorporateFail,
  approveUnapproveCorporateSuccess,
  approveUnapproveCorporateFail,
  getPendingLabsSuccess,
  getPendingLabsFail,
  getApprovedLabsSuccess,
  getApprovedLabsFail,
  getUnapprovedLabsSuccess,
  getUnapprovedLabsFail,
  approveUnapproveLabSuccess,
  approveUnapproveLabFail,
  getPendingB2BClientsSuccess,
  getPendingB2BClientsFail,
  getApprovedB2BClientsSuccess,
  getApprovedB2BClientsFail,
  getUnapprovedB2BClientsSuccess,
  getUnapprovedB2BClientsFail,
  approveUnapproveB2BClientSuccess,
  approveUnapproveB2BClientFail,
  getPendingDonorsSuccess,
  getPendingDonorsFail,
  getApprovedDonorsSuccess,
  getApprovedDonorsFail,
  getUnapprovedDonorsSuccess,
  getUnapprovedDonorsFail,
  approveUnapproveDonorSuccess,
  approveUnapproveDonorFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getPendingCorporate,
  getApprovedCorporate,
  getUnapprovedCorporate,
  approveUnapproveCorporate,

  getPendingLabs,
  approveUnapproveLab,
  getApprovedLabs,
  getUnapprovedLabs,
  getPendingB2BClients,
  approveUnapproveB2BClient,
  getApprovedB2BClients,
  getUnapprovedB2BClients,
  getPendingDonors,
  approveUnapproveDonor,
  getApprovedDonors,
  getUnapprovedDonors,
} from "../../helpers/django_api_helper";

function* fetchPendingCorporate() {
  try {
    const response = yield call(getPendingCorporate);
    yield put(getPendingCorporateSuccess(response));
  } catch (error) {
    yield put(getPendingCorporateFail(error));
  }
}
function* fetchApprovedCorporate() {
  try {
    const response = yield call(getApprovedCorporate);
    yield put(getApprovedCorporateSuccess(response));
  } catch (error) {
    yield put(getApprovedCorporateFail(error));
  }
}
function* fetchUnapprovedCorporate() {
  try {
    const response = yield call(getUnapprovedCorporate);
    yield put(getUnapprovedCorporateSuccess(response));
  } catch (error) {
    yield put(getUnapprovedCorporateFail(error));
  }
}

function* onApproveUnapproveCorporate(object) {
  try {
    const response = yield call(approveUnapproveCorporate, object.payload.data);
    yield put(approveUnapproveCorporateSuccess(response));
  } catch (error) {
    yield put(approveUnapproveCorporateFail(error));
  }
}

function* fetchPendingLabs() {
  try {
    const response = yield call(getPendingLabs);
    yield put(getPendingLabsSuccess(response));
  } catch (error) {
    yield put(getPendingLabsFail(error));
  }
}

function* fetchApprovedLabs(object) {
  try {
    const response = yield call(getApprovedLabs, object.payload.id);
    yield put(getApprovedLabsSuccess(response));
  } catch (error) {
    yield put(getApprovedLabsFail(error));
  }
}

function* fetchUnapprovedLabs(object) {
  try {
    const response = yield call(getUnapprovedLabs, object.payload.id);
    yield put(getUnapprovedLabsSuccess(response));
  } catch (error) {
    yield put(getUnapprovedLabsFail(error));
  }
}

function* onApproveUnapproveLab(object) {
  try {
    const response = yield call(approveUnapproveLab, object.payload.data);
    yield put(approveUnapproveLabSuccess(response));
  } catch (error) {
    yield put(approveUnapproveLabFail(error));
  }
}

function* fetchPendingB2BClients() {
  try {
    const response = yield call(getPendingB2BClients);
    yield put(getPendingB2BClientsSuccess(response));
  } catch (error) {
    yield put(getPendingB2BClientsFail(error));
  }
}

function* fetchApprovedB2BClients(object) {
  try {
    const response = yield call(getApprovedB2BClients, object.payload.id);
    yield put(getApprovedB2BClientsSuccess(response));
  } catch (error) {
    yield put(getApprovedB2BClientsFail(error));
  }
}

function* fetchUnapprovedB2BClients(object) {
  try {
    const response = yield call(getUnapprovedB2BClients, object.payload.id);
    yield put(getUnapprovedB2BClientsSuccess(response));
  } catch (error) {
    yield put(getUnapprovedB2BClientsFail(error));
  }
}

function* onApproveUnapproveB2BClient(object) {
  try {
    const response = yield call(approveUnapproveB2BClient, object.payload.data);
    yield put(approveUnapproveB2BClientSuccess(response));
  } catch (error) {
    yield put(approveUnapproveB2BClientFail(error));
  }
}

function* fetchPendingDonors() {
  try {
    const response = yield call(getPendingDonors);
    yield put(getPendingDonorsSuccess(response));
  } catch (error) {
    yield put(getPendingDonorsFail(error));
  }
}

function* fetchApprovedDonors(object) {
  try {
    const response = yield call(getApprovedDonors, object.payload.id);
    yield put(getApprovedDonorsSuccess(response));
  } catch (error) {
    yield put(getApprovedDonorsFail(error));
  }
}

function* fetchUnapprovedDonors(object) {
  try {
    const response = yield call(getUnapprovedDonors, object.payload.id);
    yield put(getUnapprovedDonorsSuccess(response));
  } catch (error) {
    yield put(getUnapprovedDonorsFail(error));
  }
}

function* onApproveUnapproveDonor(object) {
  try {
    const response = yield call(approveUnapproveDonor, object.payload.data);
    yield put(approveUnapproveDonorSuccess(response));
  } catch (error) {
    yield put(approveUnapproveDonorFail(error));
  }
}

function* registrationAdminSaga() {
  yield takeEvery(GET_PENDING_CORPORATE, fetchPendingCorporate);
  yield takeEvery(GET_APPROVED_CORPORATE, fetchApprovedCorporate);
  yield takeEvery(GET_UNAPPROVED_CORPORATE, fetchUnapprovedCorporate);
  yield takeEvery(APPROVE_UNAPPROVE_CORPORATE, onApproveUnapproveCorporate);

  yield takeEvery(GET_PENDING_LABS, fetchPendingLabs);
  yield takeEvery(GET_APPROVED_LABS, fetchApprovedLabs);
  yield takeEvery(GET_UNAPPROVED_LABS, fetchUnapprovedLabs);
  yield takeEvery(APPROVE_UNAPPROVE_LAB, onApproveUnapproveLab);
  yield takeEvery(GET_PENDING_B2B_CLIENTS, fetchPendingB2BClients);
  yield takeEvery(GET_APPROVED_B2B_CLIENTS, fetchApprovedB2BClients);
  yield takeEvery(GET_UNAPPROVED_B2B_CLIENTS, fetchUnapprovedB2BClients);
  yield takeEvery(APPROVE_UNAPPROVE_B2B_CLIENT, onApproveUnapproveB2BClient);
  yield takeEvery(GET_PENDING_DONORS, fetchPendingDonors);
  yield takeEvery(GET_APPROVED_DONORS, fetchApprovedDonors);
  yield takeEvery(GET_UNAPPROVED_DONORS, fetchUnapprovedDonors);
  yield takeEvery(APPROVE_UNAPPROVE_DONOR, onApproveUnapproveDonor);
}

export default registrationAdminSaga;
