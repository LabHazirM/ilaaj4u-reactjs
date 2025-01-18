import {
  GET_DONOR_ACCOUNT_STATEMENTS,
  GET_DONOR_ACCOUNT_STATEMENTS_SUCCESS,
  GET_DONOR_ACCOUNT_STATEMENTS_FAIL,
} from "./actionTypes";

export const getDonorAccountStatements = id => ({
  type: GET_DONOR_ACCOUNT_STATEMENTS,
  payload: id,
});

export const getDonorAccountStatementsSuccess = donoraccountStatements => ({
  type: GET_DONOR_ACCOUNT_STATEMENTS_SUCCESS,
  payload: donoraccountStatements,
});

export const getDonorAccountStatementsFail = error => ({
  type: GET_DONOR_ACCOUNT_STATEMENTS_FAIL,
  payload: error,
});
