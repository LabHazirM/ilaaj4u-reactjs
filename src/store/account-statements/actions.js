import {
  GET_ACCOUNT_STATEMENTS,
  GET_ACCOUNT_STATEMENTS_SUCCESS,
  GET_ACCOUNT_STATEMENTS_FAIL,
  GET_BANK_STATEMENTS,
  GET_BANK_STATEMENTS_SUCCESS,
  GET_BANK_STATEMENTS_FAIL,
} from "./actionTypes";


export const getBankStatements = id => ({
  type: GET_BANK_STATEMENTS,
  payload: id,
});

export const getBankStatementsSuccess = bankStatements => ({
  type: GET_BANK_STATEMENTS_SUCCESS,
  payload: bankStatements,
});

export const getBankStatementsFail = error => ({
  type: GET_BANK_STATEMENTS_FAIL,
  payload: error,
});


export const getAccountStatements = id => ({
  type: GET_ACCOUNT_STATEMENTS,
  payload: id,
});

export const getAccountStatementsSuccess = accountStatements => ({
  type: GET_ACCOUNT_STATEMENTS_SUCCESS,
  payload: accountStatements,
});

export const getAccountStatementsFail = error => ({
  type: GET_ACCOUNT_STATEMENTS_FAIL,
  payload: error,
});
