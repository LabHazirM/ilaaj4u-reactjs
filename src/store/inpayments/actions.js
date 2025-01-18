import {
  GET_ACCEPTED_LAB_ADVERTISEMENTS,
  GET_ACCEPTED_LAB_ADVERTISEMENTS_FAIL,
  GET_ACCEPTED_LAB_ADVERTISEMENTS_SUCCESS,
  GET_LABS,
  GET_LABS_SUCCESS,
  GET_LABS_FAIL,
  GET_DONORS,
  GET_DONORS_SUCCESS,
  GET_DONORS_FAIL,
  GET_IN_PAYMENT,
  GET_IN_PAYMENT_SUCCESS,
  GET_IN_PAYMENT_FAIL,
  ADD_NEW_IN_PAYMENT,
  ADD_IN_PAYMENT_SUCCESS,
  ADD_IN_PAYMENT_FAIL,
  GET_STAFF_PROFILE,
  GET_STAFF_PROFILE_FAIL,
  GET_STAFF_PROFILE_SUCCESS,
} from "./actionTypes";

export const getStaffProfile = id => ({
  type: GET_STAFF_PROFILE,
  payload: id,
});

export const getStaffProfileSuccess = staffProfiles => (
  console.log("actions staff profile",staffProfiles),
  {
  type: GET_STAFF_PROFILE_SUCCESS,
  payload: staffProfiles,
});

export const getStaffProfileFail = error => ({
  type: GET_STAFF_PROFILE_FAIL,
  payload: error,
});

export const getAcceptedLabAdvertisements = () => ({
  type: GET_ACCEPTED_LAB_ADVERTISEMENTS,
  payload: {},
});

export const getAcceptedLabAdvertisementsSuccess = advertisements => ({
  type: GET_ACCEPTED_LAB_ADVERTISEMENTS_SUCCESS,
  payload: advertisements,
});

export const getAcceptedLabAdvertisementsFail = error => ({
  type: GET_ACCEPTED_LAB_ADVERTISEMENTS_FAIL,
  payload: error,
});
export const getLabs = () => ({
  type: GET_LABS,
});

export const getLabsSuccess = labs => ({
  type: GET_LABS_SUCCESS,
  payload: labs,
});

export const getLabsFail = error => ({
  type: GET_LABS_FAIL,
  payload: error,
});
export const getDonors = () => ({
  type: GET_DONORS,
});

export const getDonorsSuccess = donors => ({
  type: GET_DONORS_SUCCESS,
  payload: donors,
});

export const getDonorsFail = error => ({
  type: GET_DONORS_FAIL,
  payload: error,
});
export const getInPayment = id => ({
  type: GET_IN_PAYMENT,
  payload: id,
});

export const getInPaymentSuccess = inPayments => ({
  type: GET_IN_PAYMENT_SUCCESS,
  payload: inPayments,
});

export const getInPaymentFail = error => ({
  type: GET_IN_PAYMENT_FAIL,
  payload: error,
});
// export const getInPayment = id => ({
//   type: GET_IN_PAYMENT,
//   payload: id,
// });

// export const getInPaymentSuccess = inPayments => ({
//   type: GET_IN_PAYMENT_SUCCESS,
//   payload: inPayments,
// });

// export const getInPaymentFail = error => ({
//   type: GET_IN_PAYMENT_FAIL,
//   payload: error,
// });

export const addNewInPayment = (inPayment, id) => ({
  type: ADD_NEW_IN_PAYMENT,
  payload: { inPayment, id },
});

export const addInPaymentSuccess = inPayment => ({
  type: ADD_IN_PAYMENT_SUCCESS,
  payload: inPayment,
});

export const addInPaymentFail = error => ({
  type: ADD_IN_PAYMENT_FAIL,
  payload: error,
});
