import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_BANK_STATEMENTS } from "./actionTypes";

import {
  getBankStatementsFail,
  getBankStatementsSuccess,
} from "./actions";
//Include Both Helper File with needed methods
import { getBankStatements } from "../../helpers/django_api_helper";

function* fetchBankStatements(object) {
  try {
    const response = yield call(getBankStatements, object.payload);
    yield put(getBankStatementsSuccess(response));
  } catch (error) {
    yield put(getBankStatementsFail(error));
  }
}

function* BankStatementsSaga() {
  yield takeEvery(GET_BANK_STATEMENTS, fetchBankStatements);
}

export default BankStatementsSaga;
