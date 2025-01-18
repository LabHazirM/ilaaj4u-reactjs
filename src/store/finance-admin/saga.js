import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  // GET_CLEARED_LABS,
  // GET_APPROVED_LABS,
  // GET_UNAPPROVED_LABS,
  // APPROVE_UNAPPROVE_LAB,
  GET_CLEARED_IN_PAYMENTS,
  GET_APPROVED_IN_PAYMENTS,
  GET_UNAPPROVED_IN_PAYMENTS,
  UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT,
  GET_ALL_LABS_LIST,
  GET_ALL_DONATION_APPOINTMENTS
  // GET_CLEARED_DONORS,
  // GET_APPROVED_DONORS,
  // GET_UNAPPROVED_DONORS,
  // APPROVE_UNAPPROVE_DONOR,
} from "./actionTypes";

import {
  // getClearedLabsSuccess,
  // getClearedLabsFail,
  // getApprovedLabsSuccess,
  // getApprovedLabsFail,
  // getUnapprovedLabsSuccess,
  // getUnapprovedLabsFail,
  // approveUnapproveLabSuccess,
  // approveUnapproveLabFail,
  getAllDonationAppointmentsSuccess,
  getAllDonationAppointmentsFail,
  getAllLabsListSuccess,
  getAllLabsListFail,
  getClearedInPaymentsSuccess,
  getClearedInPaymentsFail,
  getApprovedInPaymentsSuccess,
  getApprovedInPaymentsFail,
  getUnapprovedInPaymentsSuccess,
  getUnapprovedInPaymentsFail,
  updateApproveUnapproveInPaymentSuccess,
  updateApproveUnapproveInPaymentFail,
  // getClearedDonorsSuccess,
  // getClearedDonorsFail,
  // getApprovedDonorsSuccess,
  // getApprovedDonorsFail,
  // getUnapprovedDonorsSuccess,
  // getUnapprovedDonorsFail,
  // approveUnapproveDonorSuccess,
  // approveUnapproveDonorFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  // getClearedLabs,
  // approveUnapproveLab,
  // getApprovedLabs,
  // getUnapprovedLabs,
  getAllDonationAppointments,
  getClearedInPayments,
  updateApproveUnapproveInPayment,
  getApprovedInPayments,
  getUnapprovedInPayments,
  getAllLabsList,
  // getClearedDonors,
  // approveUnapproveDonor,
  // getApprovedDonors,
  // getUnapprovedDonors,
} from "../../helpers/django_api_helper";

// function* fetchClearedLabs() {
//   try {
//     const response = yield call(getClearedLabs);
//     yield put(getClearedLabsSuccess(response));
//   } catch (error) {
//     yield put(getClearedLabsFail(error));
//   }
// }

// function* fetchApprovedLabs(object) {
//   try {
//     const response = yield call(getApprovedLabs, object.payload.id);
//     yield put(getApprovedLabsSuccess(response));
//   } catch (error) {
//     yield put(getApprovedLabsFail(error));
//   }
// }

// function* fetchUnapprovedLabs(object) {
//   try {
//     const response = yield call(getUnapprovedLabs, object.payload.id);
//     yield put(getUnapprovedLabsSuccess(response));
//   } catch (error) {
//     yield put(getUnapprovedLabsFail(error));
//   }
// }

// function* onApproveUnapproveLab(object) {
//   try {
//     const response = yield call(approveUnapproveLab, object.payload.data);
//     yield put(approveUnapproveLabSuccess(response));
//   } catch (error) {
//     yield put(approveUnapproveLabFail(error));
//   }
// }

function* fetchAllDonationAppointments(object) {
  try {
    const response = yield call(getAllDonationAppointments, object.payload);
    yield put(getAllDonationAppointmentsSuccess(response));
  } catch (error) {
    yield put(getAllDonationAppointmentsFail(error));
  }
}

function* fetchAllLabsList() {
  try {
    const response = yield call(getAllLabsList);
    yield put(getAllLabsListSuccess(response));
  } catch (error) {
    yield put(getAllLabsListFail(error));
  }
}

function* fetchClearedInPayments(object) {
  try {
    const response = yield call(getClearedInPayments, object.payload);
    yield put(getClearedInPaymentsSuccess(response));
  } catch (error) {
    yield put(getClearedInPaymentsFail(error));
  }
}

function* fetchApprovedInPayments(object) {
  try {
    const response = yield call(getApprovedInPayments, object.payload);
    yield put(getApprovedInPaymentsSuccess(response));
  } catch (error) {
    yield put(getApprovedInPaymentsFail(error));
  }
}

function* fetchUnapprovedInPayments(object) {
  try {
    const response = yield call(getUnapprovedInPayments, object.payload);
    yield put(getUnapprovedInPaymentsSuccess(response));
  } catch (error) {
    yield put(getUnapprovedInPaymentsFail(error));
  }
}

// function* onApproveUnapproveInPayment(object) {
//   try {
//     const response = yield call(approveUnapproveInPayment, object.payload.data);
//     yield put(approveUnapproveInPaymentSuccess(response));
//   } catch (error) {
//     yield put(approveUnapproveInPaymentFail(error));
//   }
// }
function* onUpdateApproveUnapproveInPayment({ payload: data }) {
  try {
    const response = yield call(updateApproveUnapproveInPayment, data);
    yield put(updateApproveUnapproveInPaymentSuccess(response));
  } catch (error) {
    yield put(updateApproveUnapproveInPaymentFail(error));
  }
}


// function* fetchClearedDonors() {
//   try {
//     const response = yield call(getClearedDonors);
//     yield put(getClearedDonorsSuccess(response));
//   } catch (error) {
//     yield put(getClearedDonorsFail(error));
//   }
// }

// function* fetchApprovedDonors(object) {
//   try {
//     const response = yield call(getApprovedDonors, object.payload.id);
//     yield put(getApprovedDonorsSuccess(response));
//   } catch (error) {
//     yield put(getApprovedDonorsFail(error));
//   }
// }

// function* fetchUnapprovedDonors(object) {
//   try {
//     const response = yield call(getUnapprovedDonors, object.payload.id);
//     yield put(getUnapprovedDonorsSuccess(response));
//   } catch (error) {
//     yield put(getUnapprovedDonorsFail(error));
//   }
// }

// function* onApproveUnapproveDonor(object) {
//   try {
//     const response = yield call(approveUnapproveDonor, object.payload.data);
//     yield put(approveUnapproveDonorSuccess(response));
//   } catch (error) {
//     yield put(approveUnapproveDonorFail(error));
//   }
// }

function* financeAdminSaga() {
  // yield takeEvery(GET_CLEARED_LABS, fetchClearedLabs);
  // yield takeEvery(GET_APPROVED_LABS, fetchApprovedLabs);
  // yield takeEvery(GET_UNAPPROVED_LABS, fetchUnapprovedLabs);
  // yield takeEvery(APPROVE_UNAPPROVE_LAB, onApproveUnapproveLab);
  yield takeEvery(GET_ALL_DONATION_APPOINTMENTS, fetchAllDonationAppointments);
  yield takeEvery(GET_ALL_LABS_LIST, fetchAllLabsList);
  yield takeEvery(GET_CLEARED_IN_PAYMENTS, fetchClearedInPayments);
  yield takeEvery(GET_APPROVED_IN_PAYMENTS, fetchApprovedInPayments);
  yield takeEvery(GET_UNAPPROVED_IN_PAYMENTS, fetchUnapprovedInPayments);
  yield takeEvery(UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT, onUpdateApproveUnapproveInPayment);
  // yield takeEvery(GET_CLEARED_DONORS, fetchClearedDonors);
  // yield takeEvery(GET_APPROVED_DONORS, fetchApprovedDonors);
  // yield takeEvery(GET_UNAPPROVED_DONORS, fetchUnapprovedDonors);
  // yield takeEvery(APPROVE_UNAPPROVE_DONOR, onApproveUnapproveDonor);
}

export default financeAdminSaga;
