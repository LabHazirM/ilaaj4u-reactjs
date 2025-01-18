import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ADV_INVOICE,
} from "./actionTypes";

import {
  getAdvInvoiceSuccess,
  getAdvInvoiceFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getAdvInvoice,
} from "../../helpers/django_api_helper";

function* fetchAdvInvoice(object) {
  try {
    const response = yield call(getAdvInvoice, object.payload);
    yield put(getAdvInvoiceSuccess(response));
  } catch (error) {
    yield put(getAdvInvoiceFail(error));
  }
}

function* advinvoiceSaga() {
  yield takeEvery(GET_ADV_INVOICE, fetchAdvInvoice);
}

export default advinvoiceSaga;
