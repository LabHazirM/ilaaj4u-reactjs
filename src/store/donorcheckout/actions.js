import {
  // GET_DONOR_PAYMENTS,
  // GET_DONOR_PAYMENTS_FAIL,
  // GET_DONOR_PAYMENTS_SUCCESS,
  ADD_NEW_DONOR_PAYMENT,
  ADD_DONOR_PAYMENT_SUCCESS,
  ADD_DONOR_PAYMENT_FAIL,
} from "./actionTypes";

// export const getDonorPayments = id => ({
//   type: GET_DONOR_PAYMENTS,
//   payload: id,
// });

// export const getDonorPaymentsSuccess = donorPayments => ({
//   type: GET_DONOR_PAYMENTS_SUCCESS,
//   payload: donorPayments,
// });

// export const getDonorPaymentsFail = error => ({
//   type: GET_DONOR_PAYMENTS_FAIL,
//   payload: error,
// });

export const addNewDonorPayment = (donorPayment, id) => ({
  type: ADD_NEW_DONOR_PAYMENT,
  payload: { donorPayment, id },
});

export const addDonorPaymentSuccess = donorPayment => ({
  type: ADD_DONOR_PAYMENT_SUCCESS,
  payload: donorPayment,
});

export const addDonorPaymentFail = error => ({
  type: ADD_DONOR_PAYMENT_FAIL,
  payload: error,
});
