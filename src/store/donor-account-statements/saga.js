import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_DONOR_ACCOUNT_STATEMENTS } from "./actionTypes";

import {
  getDonorAccountStatementsFail,
  getDonorAccountStatementsSuccess,
} from "./actions";
//Include Both Helper File with needed methods
import { getDonorAccountStatements } from "../../helpers/django_api_helper";

function* fetchDonorAccountStatements(object) {
  try {
    const response = yield call(getDonorAccountStatements, object.payload);
    yield put(getDonorAccountStatementsSuccess(response));
  } catch (error) {
    yield put(getDonorAccountStatementsFail(error));
  }
}

function* DonorAccountStatementsSaga() {
  yield takeEvery(GET_DONOR_ACCOUNT_STATEMENTS, fetchDonorAccountStatements);
}

export default DonorAccountStatementsSaga;
