import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_ACCOUNT_STATEMENTS, GET_BANK_STATEMENTS } from "./actionTypes";

import {
  getAccountStatementsFail,
  getAccountStatementsSuccess,
  getBankStatementsFail,
  getBankStatementsSuccess,
} from "./actions";
//Include Both Helper File with needed methods
import { getAccountStatements, getBankStatements } from "../../helpers/django_api_helper";

function* fetchAccountStatements(object) {
  try {
    const response = yield call(getAccountStatements, object.payload);
    yield put(getAccountStatementsSuccess(response));
  } catch (error) {
    yield put(getAccountStatementsFail(error));
  }
}
function* fetchBankStatements(object) {
  try {
    const response = yield call(getBankStatements, object.payload);
    yield put(getBankStatementsSuccess(response));
  } catch (error) {
    yield put(getBankStatementsFail(error));
  }
}

function* AccountStatementsSaga() {
  yield takeEvery(GET_ACCOUNT_STATEMENTS, fetchAccountStatements);
  yield takeEvery(GET_BANK_STATEMENTS, fetchBankStatements);
}

export default AccountStatementsSaga;
