import {
  GET_PAYMENT_STATUSS,
  GET_PAYMENT_STATUSS_FAIL,
  GET_PAYMENT_STATUSS_SUCCESS,
  GET_PAYMENTOUT_STATUSS,
  GET_PAYMENTOUT_STATUSS_FAIL,
  GET_PAYMENTOUT_STATUSS_SUCCESS,
  GET_DEPOSIT_STATUSS,
  GET_DEPOSIT_STATUSS_FAIL,
  GET_DEPOSIT_STATUSS_SUCCESS,
  GET_CREATEDOUT_STATUSS,
  GET_CREATEDOUT_STATUSS_FAIL,
  GET_CREATEDOUT_STATUSS_SUCCESS,
  GET_CCREATEDOUT_STATUSS,
  GET_CCREATEDOUT_STATUSS_FAIL,
  GET_CCREATEDOUT_STATUSS_SUCCESS,
  GET_CREATEDOUTDETAIL_STATUSS,
  GET_CREATEDOUTDETAIL_STATUSS_SUCCESS,
  GET_CREATEDOUTDETAIL_STATUSS_FAIL,
  // GET_CLEAROUT_STATUSS,
  // GET_CLEAROUT_STATUSS_FAIL,
  // GET_CLEAROUT_STATUSS_SUCCESS,
  GET_BOUNCEDIN_STATUSS,
  GET_BOUNCEDIN_STATUSS_FAIL,
  GET_BOUNCEDIN_STATUSS_SUCCESS,
  GET_BOUNCED_STATUSS,
  GET_BOUNCED_STATUSS_FAIL,
  GET_BOUNCED_STATUSS_SUCCESS,
  GET_CLEAR_STATUSS,
  GET_CLEAR_STATUSS_FAIL,
  GET_CLEAR_STATUSS_SUCCESS,
  GET_PAYMENTOUT_CLEAR_STATUSS,
  GET_PAYMENTOUT_CLEAR_STATUSS_FAIL,
  GET_PAYMENTOUT_CLEAR_STATUSS_SUCCESS,
  UPDATE_PAYMENT_STATUS,
  UPDATE_PAYMENT_STATUS_SUCCESS,
  UPDATE_PAYMENT_STATUS_FAIL,
  UPDATE_PAYMENTIN_STATUS,
  UPDATE_PAYMENTIN_STATUS_SUCCESS,
  UPDATE_PAYMENTIN_STATUS_FAIL,
  UPDATE_PAYMENTOUT_STATUS,
  UPDATE_PAYMENTOUT_STATUS_SUCCESS,
  UPDATE_PAYMENTOUT_STATUS_FAIL,
  UPDATE_PAYMENTOUTCREATED_STATUS,
  UPDATE_PAYMENTOUTCREATED_STATUS_SUCCESS,
  UPDATE_PAYMENTOUTCREATED_STATUS_FAIL,
  UPDATE_PAYMENTOUTCCREATED_STATUS,
  UPDATE_PAYMENTOUTCCREATED_STATUS_SUCCESS,
  UPDATE_PAYMENTOUTCCREATED_STATUS_FAIL,
  UPDATE_PAYMENTINBOUNCED_STATUS,
  UPDATE_PAYMENTINBOUNCED_STATUS_SUCCESS,
  UPDATE_PAYMENTINBOUNCED_STATUS_FAIL,
  // ADD_NEW_OUT_PAYMENT,
  // ADD_OUT_PAYMENT_SUCCESS,
  // ADD_OUT_PAYMENT_FAIL,
  GET_LABS,
  GET_LABS_SUCCESS,
  GET_LABS_FAIL,
  GET_DONORS,
  GET_DONORS_SUCCESS,
  GET_DONORS_FAIL,
  GET_BANKS,
  GET_BANKS_SUCCESS,
  GET_BANKS_FAIL,
  GET_BANK_ACCOUNTS,
  GET_BANK_ACCOUNTS_FAIL,
  GET_BANK_ACCOUNTS_SUCCESS,
  DELETE_PAYMENTOUT,
  DELETE_PAYMENTOUT_SUCCESS,
  DELETE_PAYMENTOUT_FAIL,
} from "./actionTypes";

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

export const getBankAccounts = () => ({
  type: GET_BANK_ACCOUNTS,
});

export const getBankAccountsSuccess = bankAccounts => ({
  type: GET_BANK_ACCOUNTS_SUCCESS,
  payload: bankAccounts,
});

export const getBankAccountsFail = error => ({
  type: GET_BANK_ACCOUNTS_FAIL,
  payload: error,
});
export const getBanks = () => ({
  type: GET_BANKS,
});

export const getBanksSuccess = banks => ({
  type: GET_BANKS_SUCCESS,
  payload: banks,
});

export const getBanksFail = error => ({
  type: GET_BANKS_FAIL,
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
export const getPaymentStatuss = id => ({
  type: GET_PAYMENT_STATUSS,
  payload: id,
});

export const getPaymentStatussSuccess = paymentStatuss => ({
  type: GET_PAYMENT_STATUSS_SUCCESS,
  payload: paymentStatuss,
});

export const getPaymentStatussFail = error => ({
  type: GET_PAYMENT_STATUSS_FAIL,
  payload: error,
});

export const getPaymentOutStatuss = id => ({
  type: GET_PAYMENTOUT_STATUSS,
  payload: id,
});

export const getPaymentOutStatussSuccess = paymentOutStatuss => ({
  type: GET_PAYMENTOUT_STATUSS_SUCCESS,
  payload: paymentOutStatuss,
});

export const getPaymentOutStatussFail = error => ({
  type: GET_PAYMENTOUT_STATUSS_FAIL,
  payload: error,
});

export const getDepositStatuss = id => ({
  type: GET_DEPOSIT_STATUSS,
  payload: id,
});
export const getBouncedInStatuss = id => ({
  type: GET_BOUNCEDIN_STATUSS,
  payload: id,
});

export const getBouncedInStatussSuccess = paymentBouncedInStatuss => ({
  type: GET_BOUNCEDIN_STATUSS_SUCCESS,
  payload: paymentBouncedInStatuss,
});

export const getBouncedInStatussFail = error => ({
  type: GET_BOUNCEDIN_STATUSS_FAIL,
  payload: error,
});

// corporate payment out

export const getCCreatedOutStatussSuccess = paymentStatuss => ({
  type: GET_CCREATEDOUT_STATUSS_SUCCESS,
  payload: paymentStatuss,
});

export const getCCreatedOutStatussFail = error => ({
  type: GET_CCREATEDOUT_STATUSS_FAIL,
  payload: error,
});
export const getCCreatedOutStatuss = id => {
  console.log('ID passed to action:', id); // Log the ID passed to the action
  return {
    type: GET_CCREATEDOUT_STATUSS,
    payload: id,
  };
};
export const getCreatedOutStatussSuccess = paymentCreatedStatuss => ({
  type: GET_CREATEDOUT_STATUSS_SUCCESS,
  payload: paymentCreatedStatuss,
});

export const getCreatedOutStatussFail = error => ({
  type: GET_CREATEDOUT_STATUSS_FAIL,
  payload: error,
});

export const getCreatedOutDetailStatuss = id => {
  console.log('ID passed to action:', id); // Log the ID passed to the action
  return {
    type: GET_CREATEDOUTDETAIL_STATUSS,
    payload: id,
  };
};
export const getCreatedOutDetailStatussSuccess = paymentCreatedStatuss => (
  console.log('ID passed to action:', paymentCreatedStatuss),
  {
  type: GET_CREATEDOUTDETAIL_STATUSS_SUCCESS,
  payload: paymentCreatedStatuss,
});

export const getCreatedOutDetailStatussFail = error => ({
  type: GET_CREATEDOUTDETAIL_STATUSS_FAIL,
  payload: error,
});

export const getCreatedOutStatuss = id => ({
  type: GET_CREATEDOUT_STATUSS,
  payload: id,
});
export const getPaymentOutClearStatuss = id => ({
  type: GET_PAYMENTOUT_CLEAR_STATUSS,
  payload: id,
});

export const getPaymentOutClearStatussSuccess = paymentStatuss => ({
  type: GET_PAYMENTOUT_CLEAR_STATUSS_SUCCESS,
  payload: paymentStatuss,
});

export const getPaymentOutClearStatussFail = error => ({
  type: GET_PAYMENTOUT_CLEAR_STATUSS_FAIL,
  payload: error,
});
export const getDepositStatussSuccess = paymentStatuss => ({
  type: GET_DEPOSIT_STATUSS_SUCCESS,
  payload: paymentStatuss,
});

export const getDepositStatussFail = error => ({
  type: GET_DEPOSIT_STATUSS_FAIL,
  payload: error,
});
export const getClearStatuss = id => ({
  type: GET_CLEAR_STATUSS,
  payload: id,
});

export const getClearStatussSuccess = paymentStatuss => ({
  type: GET_CLEAR_STATUSS_SUCCESS,
  payload: paymentStatuss,
});

export const getClearStatussFail = error => ({
  type: GET_CLEAR_STATUSS_FAIL,
  payload: error,
});
export const getBouncedStatuss = id => ({
  type: GET_BOUNCED_STATUSS,
  payload: id,
});

export const getBouncedStatussSuccess = paymentBouncedStatuss => ({
  type: GET_BOUNCED_STATUSS_SUCCESS,
  payload: paymentBouncedStatuss,
});

export const getBouncedStatussFail = error => ({
  type: GET_BOUNCED_STATUSS_FAIL,
  payload: error,
});

export const updatePaymentStatus = paymentStatus => ({
  type: UPDATE_PAYMENT_STATUS,
  payload: paymentStatus,
});

export const updatePaymentStatusSuccess = paymentStatus => ({
  type: UPDATE_PAYMENT_STATUS_SUCCESS,
  payload: paymentStatus,
});

export const updatePaymentStatusFail = error => ({
  type: UPDATE_PAYMENT_STATUS_FAIL,
  payload: error,
});
export const updatePaymentOutStatus = paymentOutStatus => ({
  type: UPDATE_PAYMENTOUT_STATUS,
  payload: paymentOutStatus,
});

export const updatePaymentOutStatusSuccess = paymentOutStatus => ({
  type: UPDATE_PAYMENTOUT_STATUS_SUCCESS,
  payload: paymentOutStatus,
});

export const updatePaymentOutStatusFail = error => ({
  type: UPDATE_PAYMENTOUT_STATUS_FAIL,
  payload: error,
});

export const updatePaymentInStatus = paymentInStatus => ({
  type: UPDATE_PAYMENTIN_STATUS,
  payload: paymentInStatus,
});

export const updatePaymentInStatusSuccess = paymentInStatus => ({
  type: UPDATE_PAYMENTIN_STATUS_SUCCESS,
  payload: paymentInStatus,
});

export const updatePaymentInStatusFail = error => ({
  type: UPDATE_PAYMENTIN_STATUS_FAIL,
  payload: error,
});

export const updatePaymentOutCreatedStatuss = paymentOutCreatedStatuss => ({
  type: UPDATE_PAYMENTOUTCREATED_STATUS,
  payload: paymentOutCreatedStatuss,
});

export const updatePaymentOutCreatedStatusSuccess = paymentOutCreatedStatuss => ({
  type: UPDATE_PAYMENTOUTCREATED_STATUS_SUCCESS,
  payload: paymentOutCreatedStatuss,
});

export const updatePaymentOutCreatedStatusFail = error => ({
  type: UPDATE_PAYMENTOUTCREATED_STATUS_FAIL,
  payload: error,
});
export const updatePaymentOutCCreatedStatuss = paymentOutCreatedStatuss => ({
  type: UPDATE_PAYMENTOUTCCREATED_STATUS,
  payload: paymentOutCreatedStatuss,
});

export const updatePaymentOutCCreatedStatusSuccess = paymentOutCreatedStatuss => ({
  type: UPDATE_PAYMENTOUTCCREATED_STATUS_SUCCESS,
  payload: paymentOutCreatedStatuss,
});

export const updatePaymentOutCCreatedStatusFail = error => ({
  type: UPDATE_PAYMENTOUTCCREATED_STATUS_FAIL,
  payload: error,
});
export const updatePaymentInBouncedStatus = paymentInBouncedStatus => ({
  type: UPDATE_PAYMENTINBOUNCED_STATUS,
  payload: paymentInBouncedStatus,
});

export const updatePaymentInBouncedStatusSuccess = paymentInBouncedStatus => ({
  type: UPDATE_PAYMENTINBOUNCED_STATUS_SUCCESS,
  payload: paymentInBouncedStatus,
});

export const updatePaymentInBouncedStatusFail = error => ({
  type: UPDATE_PAYMENTINBOUNCED_STATUS_FAIL,
  payload: error,
});
// export const addNewOutPayment = (outPayment, id) => ({
//   type: ADD_NEW_OUT_PAYMENT,
//   payload: { outPayment, id },
// });

// export const addOutPaymentSuccess = outPayment => ({
//   type: ADD_OUT_PAYMENT_SUCCESS,
//   payload: outPayment,
// });

// export const addOutPaymentFail = error => ({
//   type: ADD_OUT_PAYMENT_FAIL,
//   payload: error,
// });
export const deletePaymentout = paymentout => ({
  type: DELETE_PAYMENTOUT,
  payload: paymentout,
});

export const deletePaymentoutSuccess = paymentout => ({
  type: DELETE_PAYMENTOUT_SUCCESS,
  payload: paymentout,
});

export const deletePaymentoutFail = error => ({
  type: DELETE_PAYMENTOUT_FAIL,
  payload: error,
});
