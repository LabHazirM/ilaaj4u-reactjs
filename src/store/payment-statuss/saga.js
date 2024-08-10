import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_PAYMENT_STATUSS,
  GET_PAYMENTOUT_STATUSS,
  GET_DEPOSIT_STATUSS,
  GET_CREATEDOUT_STATUSS,
  GET_CREATEDOUTDETAIL_STATUSS,
  GET_CCREATEDOUT_STATUSS,
  GET_CLEAR_STATUSS,
  GET_PAYMENTOUT_CLEAR_STATUSS,
  GET_BOUNCED_STATUSS,
  GET_BOUNCEDIN_STATUSS,
  GET_LABS,
  GET_DONORS,
  GET_BANKS,
  GET_BANK_ACCOUNTS,
  UPDATE_PAYMENT_STATUS,
  UPDATE_PAYMENTOUT_STATUS,
  UPDATE_PAYMENTIN_STATUS,
  UPDATE_PAYMENTOUTCREATED_STATUS,
  UPDATE_PAYMENTOUTCCREATED_STATUS,
  UPDATE_PAYMENTINBOUNCED_STATUS,
  // ADD_NEW_OUT_PAYMENT,
  DELETE_PAYMENTOUT,

} from "./actionTypes";

import {
  getLabsSuccess,
  getLabsFail,
  getBankAccountsSuccess,
  getBankAccountsFail,
  getBanksSuccess,
  getBanksFail,
  getDonorsSuccess,
  getDonorsFail,
  getPaymentStatussSuccess,
  getPaymentStatussFail,
  getPaymentOutStatussSuccess,
  getPaymentOutStatussFail,
  getDepositStatussSuccess,
  getDepositStatussFail,
  getCreatedOutDetailStatussSuccess,
  getCreatedOutDetailStatussFail,
  getCreatedOutStatussSuccess,
  getCreatedOutStatussFail,
  getCCreatedOutStatussSuccess,
  getCCreatedOutStatussFail,
  getClearStatussSuccess,
  getClearStatussFail,
  getPaymentOutClearStatussSuccess,
  getPaymentOutClearStatussFail,
  getBouncedStatussSuccess,
  getBouncedInStatussSuccess,
  getBouncedStatussFail,
  updatePaymentStatusSuccess,
  updatePaymentStatusFail,
  updatePaymentOutStatusSuccess,
  updatePaymentOutStatusFail,
  updatePaymentInStatusSuccess,
  updatePaymentInStatusFail,
  updatePaymentOutCreatedStatusFail,
  updatePaymentOutCreatedStatusSuccess,
  updatePaymentOutCCreatedStatusFail,
  updatePaymentOutCCreatedStatusSuccess,
  updatePaymentInBouncedStatusSuccess,
  updatePaymentInBouncedStatusFail,
  // addOutPaymentFail,
  // addOutPaymentSuccess,
  deletePaymentoutSuccess,
  deletePaymentoutFail,

} from "./actions";

//Include Both Helper File with needed methods
import {
  getPaymentStatuss,
  getPaymentOutStatuss,
  getDepositStatuss,
  getCreatedOutStatuss,
  getCreatedOutDetailStatuss,
  getCCreatedOutStatuss,
  getClearStatuss,
  getPaymentOutClearStatuss,
  getBouncedStatuss,
  getBouncedInStatuss,
  updatePaymentStatus,
  updatePaymentOutStatus,
  updatePaymentInStatus,
  updatePaymentOutCreatedStatuss,
  updatePaymentOutCCreatedStatuss,
  updatePaymentInBouncedStatus,
  // addNewOutPayment,
  getLabs,   getBanks,   getBankAccounts, deletePaymentout, getDonors,

} from "../../helpers/django_api_helper";

function* fetchBankAccounts() {
  try {
    const response = yield call(getBankAccounts);
    yield put(getBankAccountsSuccess(response));
  } catch (error) {
    yield put(getBankAccountsFail(error));
  }
}
function* fetchBanks() {
  try {
    const response = yield call(getBanks);
    yield put(getBanksSuccess(response));
  } catch (error) {
    yield put(getBanksFail(error));
  }
}
function* fetchLabs() {
  try {
    const response = yield call(getLabs);
    yield put(getLabsSuccess(response));
  } catch (error) {
    yield put(getLabsFail(error));
  }
}
function* fetchDonors() {
  try {
    const response = yield call(getDonors);
    yield put(getDonorsSuccess(response));
  } catch (error) {
    yield put(getDonorsFail(error));
  }
}
function* fetchPaymentStatuss(object) {
  try {
    const response = yield call(getPaymentStatuss, object.payload);
    yield put(getPaymentStatussSuccess(response));
  } catch (error) {
    yield put(getPaymentStatussFail(error));
  }
}
function* fetchPaymentOutStatuss(object) {
  try {
    const response = yield call(getPaymentOutStatuss, object.payload);
    yield put(getPaymentOutStatussSuccess(response));
  } catch (error) {
    yield put(getPaymentOutStatussFail(error));
  }
}
function* fetchDepositStatuss(object) {
  try {
    const response = yield call(getDepositStatuss, object.payload);
    yield put(getDepositStatussSuccess(response));
  } catch (error) {
    yield put(getDepositStatussFail(error));
  }
}
function* fetchCreatedOutStatuss(object) {
  try {
    const response = yield call(getCreatedOutStatuss, object.payload);
    yield put(getCreatedOutStatussSuccess(response));
  } catch (error) {
    yield put(getCreatedOutStatussFail(error));
  }
}
function* fetchCreatedOutDetailStatuss(object) {
  try {
    const response = yield call(getCreatedOutDetailStatuss, object.payload);
    yield put(getCreatedOutDetailStatussSuccess(response));
  } catch (error) {
    yield put(getCreatedOutDetailStatussFail(error));
  }
}
// function* fetchCCreatedOutStatuss(object) {
//   try {
//     const response = yield call(getCCreatedOutStatuss, object.payload);
//     yield put(getCCreatedOutStatussSuccess(response));
//   } catch (error) {
//     yield put(getCCreatedOutStatussFail(error));
//   }
// }
function* fetchCCreatedOutStatuss(object) {
  try {
    console.log('Payload passed to fetchCCreatedOutStatuss:', object.payload); // Log the payload passed to the saga
    const response = yield call(getCCreatedOutStatuss, object.payload);
    console.log('Response from API:', response); // Log the response from the API
    yield put(getCCreatedOutStatussSuccess(response));
  } catch (error) {
    yield put(getCCreatedOutStatussFail(error));
  }
}
function* fetchPaymentOutClearStatuss(object) {
  try {
    const response = yield call(getPaymentOutClearStatuss, object.payload);
    yield put(getPaymentOutClearStatussSuccess(response));
  } catch (error) {
    yield put(getPaymentOutClearStatussFail(error));
  }
}
function* fetchClearStatuss(object) {
  try {
    const response = yield call(getClearStatuss, object.payload);
    yield put(getClearStatussSuccess(response));
  } catch (error) {
    yield put(getClearStatussFail(error));
  }
}
function* fetchBouncedInStatuss(object) {
  try {
    const response = yield call(getBouncedInStatuss, object.payload);
    yield put(getBouncedInStatussSuccess(response));
  } catch (error) {
    yield put(getBouncedInStatussFail(error));
  }
}
function* fetchBouncedStatuss(object) {
  try {
    const response = yield call(getBouncedStatuss, object.payload);
    yield put(getBouncedStatussSuccess(response));
  } catch (error) {
    yield put(getBouncedStatussFail(error));
  }
}

function* onUpdatePaymentStatus({ payload: paymentStatus }) {
  try {
    const response = yield call(updatePaymentStatus, paymentStatus);
    yield put(updatePaymentStatusSuccess(response));
  } catch (error) {
    yield put(updatePaymentStatusFail(error));
  }
}

function* onUpdatePaymentOutStatus({ payload: paymentOutStatus }) {
  try {
    const response = yield call(updatePaymentOutStatus, paymentOutStatus);
    yield put(updatePaymentOutStatusSuccess(response));
  } catch (error) {
    yield put(updatePaymentOutStatusFail(error));
  }
}
function* onUpdatePaymentInStatus({ payload: paymentInStatus }) {
  try {
    const response = yield call(updatePaymentInStatus, paymentInStatus);
    yield put(updatePaymentInStatusSuccess(response));
  } catch (error) {
    yield put(updatePaymentInStatusFail(error));
  }
}
function* onUpdatePaymentOutCreatedStatuss({ payload: paymentOutCreatedStatuss }) {
  try {
    const response = yield call(updatePaymentOutCreatedStatuss, paymentOutCreatedStatuss);
    yield put(updatePaymentOutCreatedStatusSuccess(response));
  } catch (error) {
    yield put(updatePaymentOutCreatedStatusFail(error));
  }
}
function* onUpdatePaymentOutCCreatedStatuss({ payload: paymentOutCreatedStatuss }) {
  try {
    const response = yield call(updatePaymentOutCCreatedStatuss, paymentOutCreatedStatuss);
    yield put(updatePaymentOutCCreatedStatusSuccess(response));
  } catch (error) {
    yield put(updatePaymentOutCCreatedStatusFail(error));
  }
}
// function* onUpdatePaymentInBouncedStatuss({ payload: paymentBouncedInStatus }) {
//   try {
//     const response = yield call(updatePaymentInBouncedStatuss, paymentBouncedInStatus);
//     yield put(updatePaymentInBouncedStatusSuccess(response));
//   } catch (error) {
//     yield put(updatePaymentInBouncedStatusFail(error));
//   }
// }
function* onUpdatePaymentInBouncedStatus({ payload: paymentInBouncedStatus }) {
  try {
    const response = yield call(updatePaymentInBouncedStatus, paymentInBouncedStatus);
    yield put(updatePaymentInBouncedStatusSuccess(response));
  } catch (error) {
    yield put(updatePaymentInBouncedStatusFail(error));
  }
}
// function* onAddNewOutPayment(object) {
//   try {
//     const response = yield call(
//       addNewOutPayment,
//       object.payload.outPayment,
//       object.payload.id
//     );
//     yield put(addOutPaymentSuccess(response));
//   } catch (error) {
//     yield put(addOutPaymentFail(error));
//   }
// }
function* onDeletePaymentout({ payload: paymentout }) {
  try {
    const response = yield call(deletePaymentout, paymentout);
    yield put(deletePaymentoutSuccess(response));
  } catch (error) {
    yield put(deletePaymentoutFail(error));
  }
}



function* paymentStatussSaga() {
  yield takeEvery(GET_DEPOSIT_STATUSS, fetchDepositStatuss);
  yield takeEvery(GET_CREATEDOUT_STATUSS, fetchCreatedOutStatuss);
  yield takeEvery(GET_CREATEDOUTDETAIL_STATUSS, fetchCreatedOutDetailStatuss);
  yield takeEvery(GET_CCREATEDOUT_STATUSS, fetchCCreatedOutStatuss);
  yield takeEvery(GET_PAYMENTOUT_CLEAR_STATUSS, fetchPaymentOutClearStatuss);
  yield takeEvery(GET_CLEAR_STATUSS, fetchClearStatuss);
  yield takeEvery(GET_BOUNCED_STATUSS, fetchBouncedStatuss);
  yield takeEvery(GET_BOUNCEDIN_STATUSS, fetchBouncedInStatuss);
  yield takeEvery(GET_PAYMENT_STATUSS, fetchPaymentStatuss);
  yield takeEvery(GET_PAYMENTOUT_STATUSS, fetchPaymentOutStatuss);
  yield takeEvery(UPDATE_PAYMENT_STATUS, onUpdatePaymentStatus);
  yield takeEvery(UPDATE_PAYMENTOUT_STATUS, onUpdatePaymentOutStatus);
  yield takeEvery(UPDATE_PAYMENTIN_STATUS, onUpdatePaymentInStatus);
  yield takeEvery(UPDATE_PAYMENTOUTCREATED_STATUS, onUpdatePaymentOutCreatedStatuss);
  yield takeEvery(UPDATE_PAYMENTOUTCCREATED_STATUS, onUpdatePaymentOutCCreatedStatuss);
  yield takeEvery(UPDATE_PAYMENTINBOUNCED_STATUS, onUpdatePaymentInBouncedStatus);
  // yield takeEvery(ADD_NEW_OUT_PAYMENT, onAddNewOutPayment);
  yield takeEvery(GET_BANKS, fetchBanks);
  yield takeEvery(GET_BANK_ACCOUNTS, fetchBankAccounts);
  yield takeEvery(GET_LABS, fetchLabs);
  yield takeEvery(GET_DONORS, fetchDonors);
  yield takeEvery(DELETE_PAYMENTOUT, onDeletePaymentout);
}

export default paymentStatussSaga;
