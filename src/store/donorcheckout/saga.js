import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  // GET_DONOR_PAYMENTS,
  ADD_NEW_DONOR_PAYMENT,
} from "./actionTypes";

import {
  // getDonorPaymentsSuccess,
  // getDonorPaymentsFail,
  addDonorPaymentFail,
  addDonorPaymentSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import {
  // getDonorPayments,
  addNewDonorPayment,
} from "../../helpers/django_api_helper";

// function* fetchDonorPayments(object) {
//   try {
//     const response = yield call(getDonorPayments, object.payload);
//     yield put(getDonorPaymentsSuccess(response));
//   } catch (error) {
//     yield put(getDonorPaymentsFail(error));
//   }
// }

function* onAddNewDonorPayment(object) {
  try {
    const response = yield call(
      addNewDonorPayment,
      object.payload.donorPayment,
      object.payload.id
    );
    yield put(addDonorPaymentSuccess(response));
  } catch (error) {
    yield put(addDonorPaymentFail(error));
  }
}

function* donorPaymentSaga() {
  // yield takeEvery(GET_DONOR_PAYMENTS, fetchDonorPayments);
  yield takeEvery(ADD_NEW_DONOR_PAYMENT, onAddNewDonorPayment);
}

export default donorPaymentSaga;
