import {
  GET_INVOICE_DETAIL,
  GET_INVOICE_DETAIL_FAIL,
  GET_INVOICE_DETAIL_SUCCESS,
  ////
  GET_TESTS_IN_APPOINTMENTS,
  GET_TESTS_IN_APPOINTMENTS_SUCCESS,
  GET_TESTS_IN_APPOINTMENTS_FAIL,

  DELETE_TESTS_IN_APPOINTMENTS,
  DELETE_TESTS_IN_APPOINTMENTS_SUCCESS,
  DELETE_TESTS_IN_APPOINTMENTS_FAIL,
  ////////
  GET_ADVINVOICE_DETAIL,
  GET_ADVINVOICE_DETAIL_FAIL,
  GET_ADVINVOICE_DETAIL_SUCCESS,
  UPDATE_PAYMENT_INFO,
  UPDATE_PAYMENT_INFO_SUCCESS,
  UPDATE_PAYMENT_INFO_FAIL,
} from "./actionTypes";

export const getAdvInvoiceDetail = id => ({
  type: GET_ADVINVOICE_DETAIL,
  payload: id,
});

export const getAdvInvoiceDetailSuccess = advinvoices => ({
  type: GET_ADVINVOICE_DETAIL_SUCCESS,
  payload: advinvoices,
});

export const getAdvInvoiceDetailFail = error => ({
  type: GET_ADVINVOICE_DETAIL_FAIL,
  payload: error,
});

export const getInvoiceDetail = id => ({
  type: GET_INVOICE_DETAIL,
  payload: id,
});

export const getInvoiceDetailSuccess = invoices => ({
  type: GET_INVOICE_DETAIL_SUCCESS,
  payload: invoices,
});

export const getInvoiceDetailFail = error => ({
  type: GET_INVOICE_DETAIL_FAIL,
  payload: error,
});

///////////////////
export const getTestsInAppointment = id => ({
  type: GET_TESTS_IN_APPOINTMENTS,
  payload: id,
});

export const getTestsInAppointmentSuccess = invoices => ({
  type: GET_TESTS_IN_APPOINTMENTS_SUCCESS,
  payload: invoices,
});

export const getTestsInAppointmentFail = error => ({
  type: GET_TESTS_IN_APPOINTMENTS_FAIL,
  payload: error,
});
export const deleteTestsInAppointment = cemployee => ({
  type: DELETE_TESTS_IN_APPOINTMENTS,
  payload: cemployee,
});

export const deleteTestsInAppointmentSuccess = cemployee => ({
  type: DELETE_TESTS_IN_APPOINTMENTS_SUCCESS,
  payload: cemployee,
});

export const deleteTestsInAppointmentFail = error => ({
  type: DELETE_TESTS_IN_APPOINTMENTS_FAIL,
  payload: error,
});

////////////


export const updatePaymentInfo = id => ({
  type: UPDATE_PAYMENT_INFO,
  payload: id,
});

export const updatePaymentInfoSuccess = paymentDetails => ({
  type: UPDATE_PAYMENT_INFO_SUCCESS,
  payload: paymentDetails,
});

export const updatePaymentInfoFail = error => ({
  type: UPDATE_PAYMENT_INFO_FAIL,
  payload: error,
});
