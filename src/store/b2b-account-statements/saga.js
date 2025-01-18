import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_B2B_ACCOUNT_STATEMENTS, GET_CLAB_ACCOUNT_STATEMENTS } from "./actionTypes";

import {
  getB2bAccountStatementsFail,
  getB2bAccountStatementsSuccess,
  getCLabAccountStatementsFail,
  getCLabAccountStatementsSuccess,
} from "./actions";
//Include Both Helper File with needed methods
import { getB2bAccountStatements, getCLabAccountStatements } from "../../helpers/django_api_helper";

function* fetchB2bAccountStatements(object) {
  try {
    const response = yield call(getB2bAccountStatements, object.payload);
    yield put(getB2bAccountStatementsSuccess(response));
  } catch (error) {
    yield put(getB2bAccountStatementsFail(error));
  }
}
function* fetchCLabAccountStatements(object) {
  try {
    const response = yield call(getCLabAccountStatements, object.payload);
    yield put(getCLabAccountStatementsSuccess(response));
  } catch (error) {
    yield put(getCLabAccountStatementsFail(error));
  }
}

function* B2bAccountStatementsSaga() {
  yield takeEvery(GET_B2B_ACCOUNT_STATEMENTS, fetchB2bAccountStatements);
  yield takeEvery(GET_CLAB_ACCOUNT_STATEMENTS, fetchCLabAccountStatements);
}

export default B2bAccountStatementsSaga;
