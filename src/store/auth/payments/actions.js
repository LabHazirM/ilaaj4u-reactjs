import {
  GET_LAB_PAYMENTS,
  GET_LAB_PAYMENTS_FAIL,
  GET_LAB_PAYMENTS_SUCCESS,
  UPDATE_LAB_PAYMENTS,
  UPDATE_LAB_PAYMENTS_SUCCESS,
  UPDATE_LAB_PAYMENTS_FAIL,
} from "./actionTypes";

// ----------- Lab settings APIs actions -----------------
export const getLabPayments = id => ({
  type: GET_LAB_PAYMENTS,
  payload: id,
});

export const getLabPaymentsSuccess = labPayments => ({
  type: GET_LAB_PAYMENTS_SUCCESS,
  payload: labPayments,
});

export const getLabPaymentsFail = error => ({
  type: GET_LAB_PAYMENTS_FAIL,
  payload: error,
});

export const updateLabPayments = (labPayments, id) => ({
  type: UPDATE_LAB_PAYMENTS,
  payload: { labPayments, id },
});

export const updateLabPaymentsSuccess = labPayments => ({
  type: UPDATE_LAB_PAYMENTS_SUCCESS,
  payload: labPayments,
});

export const updateLabPaymentsFail = error => ({
  type: UPDATE_LAB_PAYMENTS_FAIL,
  payload: error,
});
