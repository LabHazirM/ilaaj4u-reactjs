import {
  GET_DONORS_ACCOUNT_STATEMENTS,
  GET_DONORS_ACCOUNT_STATEMENTS_SUCCESS,
  GET_DONORS_ACCOUNT_STATEMENTS_FAIL,
} from "./actionTypes";

export const getDonorsAccountStatements = id => ({
  type: GET_DONORS_ACCOUNT_STATEMENTS,
  payload: id,
});

export const getDonorsAccountStatementsSuccess = donoraccountStatements => ({
  type: GET_DONORS_ACCOUNT_STATEMENTS_SUCCESS,
  payload: donoraccountStatements,
});

export const getDonorsAccountStatementsFail = error => ({
  type: GET_DONORS_ACCOUNT_STATEMENTS_FAIL,
  payload: error,
});
