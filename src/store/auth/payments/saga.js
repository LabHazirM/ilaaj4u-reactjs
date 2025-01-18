import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_LAB_PAYMENTS, UPDATE_LAB_PAYMENTS } from "./actionTypes";

import {
  getLabPaymentsSuccess,
  getLabPaymentsFail,
  updateLabPaymentsSuccess,
  updateLabPaymentsFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getLabPayments,
  updateLabPayments,
} from "../../../helpers/django_api_helper";

function* fetchLabPayments(object) {
  try {
    const response = yield call(getLabPayments, object.payload);
    yield put(getLabPaymentsSuccess(response));
  } catch (error) {
    yield put(getLabPaymentsFail(error));
  }
}

function* onUpdateLabPayments({ payload: { labPayments, id } }) {
  try {
    const response = yield call(updateLabPayments, labPayments, id);
    yield put(updateLabPaymentsSuccess(response));
  } catch (error) {
    yield put(updateLabPaymentsFail(error));
  }
}

function* labPaymentsSaga() {
  yield takeEvery(GET_LAB_PAYMENTS, fetchLabPayments);
  yield takeEvery(UPDATE_LAB_PAYMENTS, onUpdateLabPayments);
}

export default labPaymentsSaga;
