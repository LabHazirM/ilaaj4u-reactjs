import {
  GET_BANK_TRANSFER,
  GET_BANK_TRANSFER_SUCCESS,
  GET_BANK_TRANSFER_FAIL,
  GET_BANKS,
  GET_BANKS_SUCCESS,
  GET_BANKS_FAIL,
  GET_BANK_ACCOUNTS,
  GET_BANK_ACCOUNTS_FAIL,
  GET_BANK_ACCOUNTS_SUCCESS,
  ADD_NEW_BANK_TRANSFER,
  ADD_BANK_TRANSFER_SUCCESS,
  ADD_BANK_TRANSFER_FAIL,
  UPDATE_BANK_TRANSFER,
  UPDATE_BANK_TRANSFER_SUCCESS,
  UPDATE_BANK_TRANSFER_FAIL,
} from "./actionTypes";

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
export const getBankTransfer = id => ({
  type: GET_BANK_TRANSFER,
  payload: id,
});

export const getBankTransferSuccess = bankTransfers => ({
  type: GET_BANK_TRANSFER_SUCCESS,
  payload: bankTransfers,
});

export const getBankTransferFail = error => ({
  type: GET_BANK_TRANSFER_FAIL,
  payload: error,
});

export const addNewBankTransfer = (bankTransfer, id) => ({
  type: ADD_NEW_BANK_TRANSFER,
  payload: { bankTransfer, id },
});

export const addBankTransferSuccess = bankTransfer => ({
  type: ADD_BANK_TRANSFER_SUCCESS,
  payload: bankTransfer,
});

export const addBankTransferFail = error => ({
  type: ADD_BANK_TRANSFER_FAIL,
  payload: error,
});

export const updateBankTransfer = bankTransfer => ({
  type: UPDATE_BANK_TRANSFER,
  payload: bankTransfer,
});

export const updateBankTransferSuccess = bankTransfer => ({
  type: UPDATE_BANK_TRANSFER_SUCCESS,
  payload: bankTransfer,
});

export const updateBankTransferFail = error => ({
  type: UPDATE_BANK_TRANSFER_FAIL,
  payload: error,
});