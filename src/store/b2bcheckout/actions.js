import {
  // GET_DONOR_PAYMENTS,
  // GET_DONOR_PAYMENTS_FAIL,
  // GET_DONOR_PAYMENTS_SUCCESS,
  ADD_NEW_B2B_PAYMENT,
  ADD_B2B_PAYMENT_SUCCESS,
  ADD_B2B_PAYMENT_FAIL,
} from "./actionTypes";

// export const getB2bPayments = id => ({
//   type: GET_DONOR_PAYMENTS,
//   payload: id,
// });

// export const getB2bPaymentsSuccess = b2bPayments => ({
//   type: GET_DONOR_PAYMENTS_SUCCESS,
//   payload: b2bPayments,
// });

// export const getB2bPaymentsFail = error => ({
//   type: GET_DONOR_PAYMENTS_FAIL,
//   payload: error,
// });

export const addNewB2bPayment = (b2bPayment, id) => ({
  type: ADD_NEW_B2B_PAYMENT,
  payload: { b2bPayment, id },
});

export const addB2bPaymentSuccess = b2bPayment => ({
  type: ADD_B2B_PAYMENT_SUCCESS,
  payload: b2bPayment,
});

export const addB2bPaymentFail = error => ({
  type: ADD_B2B_PAYMENT_FAIL,
  payload: error,
});
