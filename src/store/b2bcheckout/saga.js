import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  // GET_B2B_PAYMENTS,
  ADD_NEW_B2B_PAYMENT,
} from "./actionTypes";

import {
  // getB2bPaymentsSuccess,
  // getB2bPaymentsFail,
  addB2bPaymentFail,
  addB2bPaymentSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import {
  // getB2bPayments,
  addNewB2bPayment,
} from "../../helpers/django_api_helper";

// function* fetchB2bPayments(object) {
//   try {
//     const response = yield call(getB2bPayments, object.payload);
//     yield put(getB2bPaymentsSuccess(response));
//   } catch (error) {
//     yield put(getB2bPaymentsFail(error));
//   }
// }

function* onAddNewB2bPayment(object) {
  try {
    const response = yield call(
      addNewB2bPayment,
      object.payload.b2bPayment,
      object.payload.id
    );
    yield put(addB2bPaymentSuccess(response));
  } catch (error) {
    yield put(addB2bPaymentFail(error));
  }
}

function* b2bPaymentSaga() {
  // yield takeEvery(GET_B2B_PAYMENTS, fetchB2bPayments);
  yield takeEvery(ADD_NEW_B2B_PAYMENT, onAddNewB2bPayment);
}

export default b2bPaymentSaga;
