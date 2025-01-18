import {
  GET_BANKACCOUNTS,
  GET_BANKACCOUNTS_FAIL,
  GET_BANKACCOUNTS_SUCCESS,
  UPDATE_BANKACCOUNT,
  UPDATE_BANKACCOUNT_SUCCESS,
  UPDATE_BANKACCOUNT_FAIL,
  // DELETE_BANKACCOUNT,
  // DELETE_BANKACCOUNT_SUCCESS,
  // DELETE_BANKACCOUNT_FAIL,
} from "./actionTypes";

// ----------- Bankaccount list APIs actions -----------------
export const getBankaccounts = id => ({
  type: GET_BANKACCOUNTS,
  payload: id,
});

export const getBankaccountsSuccess = bankaccounts => ({
  type: GET_BANKACCOUNTS_SUCCESS,
  payload: bankaccounts,
});

export const getBankaccountsFail = error => ({
  type: GET_BANKACCOUNTS_FAIL,
  payload: error,
});

export const updateBankaccount = bankaccount => ({
  type: UPDATE_BANKACCOUNT,
  payload: bankaccount,
});

export const updateBankaccountSuccess = bankaccount => ({
  type: UPDATE_BANKACCOUNT_SUCCESS,
  payload: bankaccount,
});

export const updateBankaccountFail = error => ({
  type: UPDATE_BANKACCOUNT_FAIL,
  payload: error,
});

// export const deleteBankaccount = bankaccount => ({
//   type: DELETE_BANKACCOUNT,
//   payload: bankaccount,
// });

// export const deleteBankaccountSuccess = bankaccount => ({
//   type: DELETE_BANKACCOUNT_SUCCESS,
//   payload: bankaccount,
// });

// export const deleteBankaccountFail = error => ({
//   type: DELETE_BANKACCOUNT_FAIL,
//   payload: error,
// });
