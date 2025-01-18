import {
  GET_B2B_ACCOUNT_STATEMENTS,
  GET_B2B_ACCOUNT_STATEMENTS_SUCCESS,
  GET_B2B_ACCOUNT_STATEMENTS_FAIL,
  GET_CLAB_ACCOUNT_STATEMENTS,
  GET_CLAB_ACCOUNT_STATEMENTS_SUCCESS,
  GET_CLAB_ACCOUNT_STATEMENTS_FAIL,
} from "./actionTypes";

export const getB2bAccountStatements = id => ({
  type: GET_B2B_ACCOUNT_STATEMENTS,
  payload: id,
});

export const getB2bAccountStatementsSuccess = b2baccountStatements => ({
  type: GET_B2B_ACCOUNT_STATEMENTS_SUCCESS,
  payload: b2baccountStatements,
});

export const getB2bAccountStatementsFail = error => ({
  type: GET_B2B_ACCOUNT_STATEMENTS_FAIL,
  payload: error,
});
export const getCLabAccountStatements = id => ({
  type: GET_CLAB_ACCOUNT_STATEMENTS,
  payload: id,
});

export const getCLabAccountStatementsSuccess = b2baccountStatements => ({
  type: GET_CLAB_ACCOUNT_STATEMENTS_SUCCESS,
  payload: b2baccountStatements,
});

export const getCLabAccountStatementsFail = error => ({
  type: GET_CLAB_ACCOUNT_STATEMENTS_FAIL,
  payload: error,
});
