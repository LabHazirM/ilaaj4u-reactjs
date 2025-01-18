import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_DONORS_ACCOUNT_STATEMENTS } from "./actionTypes";

import {
  getDonorsAccountStatementsFail,
  getDonorsAccountStatementsSuccess,
} from "./actions";
//Include Both Helper File with needed methods
import { getDonorsAccountStatements } from "../../helpers/django_api_helper";

function* fetchDonorsAccountStatements(object) {
  try {
    const response = yield call(getDonorsAccountStatements, object.payload);
    yield put(getDonorsAccountStatementsSuccess(response));
  } catch (error) {
    yield put(getDonorsAccountStatementsFail(error));
  }
}

function* DonorsAccountStatementsSaga() {
  yield takeEvery(GET_DONORS_ACCOUNT_STATEMENTS, fetchDonorsAccountStatements);
}

export default DonorsAccountStatementsSaga;
