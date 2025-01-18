import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACTIVITY_LOG_FINANCE,
  GET_CORPORATE_COMMIT,
} from "./actionTypes";

import {
  getActivityLogFinanceSuccess,
  getActivityLogFinanceFail,
  getCorporateCommitSuccess,
  getCorporateCommitFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getActivityLogFinance,
  getCorporateCommit,
} from "../../helpers/django_api_helper";

function* fetchActivityLogFinance(object) {
  try {
    const response = yield call(getActivityLogFinance, object.payload);
    yield put(getActivityLogFinanceSuccess(response));
  } catch (error) {
    yield put(getActivityLogFinanceFail(error));
  }
}

function* fetchCorporateCommit(object) {
  try {
    const response = yield call(getCorporateCommit, object.payload);
    yield put(getCorporateCommitSuccess(response));
  } catch (error) {
    yield put(getCorporateCommitFail(error));
  }
}

function* activitylogfinanceSaga() {
  yield takeEvery(GET_ACTIVITY_LOG_FINANCE, fetchActivityLogFinance);
  yield takeEvery(GET_CORPORATE_COMMIT, fetchCorporateCommit);
}

export default activitylogfinanceSaga;
