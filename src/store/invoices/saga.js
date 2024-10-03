import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_INVOICE_DETAIL,GET_TESTS_IN_APPOINTMENTS, UPDATE_PAYMENT_INFO ,DELETE_TESTS_IN_APPOINTMENTS} from "./actionTypes";
import {
  getInvoiceDetailSuccess,
  getInvoiceDetailFail,
  getTestsInAppointmentSuccess,
  getTestsInAppointmentFail,
  updatePaymentInfoSuccess,
  updatePaymentInfoFail,
  deleteTestsInAppointmentFail,
  deleteTestsInAppointmentSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import { getInvoiceDetail,getTestsInAppointment,deleteTestsInAppointment} from "helpers/django_api_helper";

function* fetchInvoiceDetail(object) {
  try {
    const response = yield call(getInvoiceDetail, object.payload);
    console.log("response", response)
    yield put(getInvoiceDetailSuccess(response));
  } catch (error) {
    yield put(getInvoiceDetailFail(error));
  }
}

function* fetchTestsInAppointments(object) {
  try {
    const response = yield call(getTestsInAppointment, object.payload);
    console.log("response", response)
    yield put(getTestsInAppointmentSuccess(response));
  } catch (error) {
    yield put(getTestsInAppointmentFail(error));
  }
}

function* onDeleteCedata({ payload: cemployee }) {
  try {
    const response = yield call(deleteTestsInAppointment, cemployee);
    yield put(deleteTestsInAppointmentSuccess(response));
  } catch (error) {
    yield put(deleteTestsInAppointmentFail(error));
  }
}

function* onUpdatePaymentInfo(object) {
  try {
    const response = yield call(updatePaymentInfo, object.payload);
    yield put(updatePaymentInfoSuccess(response));
  } catch (error) {
    yield put(updatePaymentInfoFail(error));
  }
}

function* invoiceSaga() {
  yield takeEvery(GET_INVOICE_DETAIL, fetchInvoiceDetail);
  yield takeEvery(GET_TESTS_IN_APPOINTMENTS, fetchTestsInAppointments);
  yield takeEvery(DELETE_TESTS_IN_APPOINTMENTS, onDeleteCedata);
  yield takeEvery(UPDATE_PAYMENT_INFO, onUpdatePaymentInfo);
}

export default invoiceSaga;
