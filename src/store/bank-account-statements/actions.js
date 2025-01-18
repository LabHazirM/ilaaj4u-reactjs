import {
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
