import {
  GET_BANK_ACCOUNTS,
  GET_BANK_ACCOUNTS_FAIL,
  GET_BANK_ACCOUNTS_SUCCESS,
  GET_BANKS,
  GET_BANKS_SUCCESS,
  GET_BANKS_FAIL,
  ADD_NEW_BANK_ACCOUNT,
  ADD_BANK_ACCOUNT_SUCCESS,
  ADD_BANK_ACCOUNT_FAIL,
} from "./actionTypes";

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
export const getBankAccounts = id => ({
  type: GET_BANK_ACCOUNTS,
  payload: id,
});

export const getBankAccountsSuccess = bankAccounts => ({
  type: GET_BANK_ACCOUNTS_SUCCESS,
  payload: bankAccounts,
});

export const getBankAccountsFail = error => ({
  type: GET_BANK_ACCOUNTS_FAIL,
  payload: error,
});

export const addNewBankAccount = (bankAccount, id) => ({
  type: ADD_NEW_BANK_ACCOUNT,
  payload: { bankAccount, id },
});

export const addBankAccountSuccess = bankAccount => ({
  type: ADD_BANK_ACCOUNT_SUCCESS,
  payload: bankAccount,
});

export const addBankAccountFail = error => ({
  type: ADD_BANK_ACCOUNT_FAIL,
  payload: error,
});
