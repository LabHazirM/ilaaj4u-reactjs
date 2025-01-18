import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_SHARED_PERCENTAGE_PENDING_FEE,
  GET_SHARED_PERCENTAGE_APPROVED_FEE,
  UPDATE_SHARED_PERCENTAGE_PENDING_FEE,
  UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE,
} from "./actionTypes";

import {
  getSharedPercentagePendingFeeTestsSuccess,
  getSharedPercentagePendingFeeTestsFail,
  getSharedPercentageApprovedFeeTestsSuccess,
  getSharedPercentageApprovedFeeTestsFail,
  updateSharedPercentagePendingFeeTestSuccess,
  updateSharedPercentagePendingFeeTestFail,
  updateSharedPercentageAllPendingFeeTestSuccess,
  updateSharedPercentageAllPendingFeeTestFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getSharedPercentagePendingFeeTests,
  getSharedPercentageApprovedFeeTests,
  updateSharedPercentagePendingFeeTest,
  updateSharedPercentageAllPendingFeeTest,
} from "../../helpers/django_api_helper";

function* fetchSharedPercentagePendingFeeTests(object) {
  try {
    const response = yield call(getSharedPercentagePendingFeeTests, object.payload);
    console.log("sharedPercentagePendingFeeTest saga: ", response);
    yield put(getSharedPercentagePendingFeeTestsSuccess(response));
  } catch (error) {
    yield put(getSharedPercentagePendingFeeTestsFail(error));
  }
}

function* fetchSharedPercentageApprovedFeeTests(object) {
  try {
    const response = yield call(getSharedPercentageApprovedFeeTests, object.payload);
    console.log("sharedPercentageApprovedFeeTest saga: ", response);
    yield put(getSharedPercentageApprovedFeeTestsSuccess(response));
  } catch (error) {
    yield put(getSharedPercentageApprovedFeeTestsFail(error));
  }
}

function* onUpdateSharedPercentagePendingFeeTest({ payload: sharedPercentagePendingFeeTest }) {
  try {
    const response = yield call(updateSharedPercentagePendingFeeTest, sharedPercentagePendingFeeTest);
    yield put(updateSharedPercentagePendingFeeTestSuccess(response));
  } catch (error) {
    yield put(updateSharedPercentagePendingFeeTestFail(error));
  }
}

function* onUpdateSharedPercentageAllPendingFeeTest({ payload: sharedPercentageAllPendingFeeTest }) {
  try {
    const response = yield call(updateSharedPercentageAllPendingFeeTest, sharedPercentageAllPendingFeeTest);
    yield put(updateSharedPercentageAllPendingFeeTestSuccess(response));
  } catch (error) {
    yield put(updateSharedPercentageAllPendingFeeTestFail(error));
  }
}

function* sharedPercentagePendingFeeTestsSaga() {
  yield takeEvery(GET_SHARED_PERCENTAGE_PENDING_FEE, fetchSharedPercentagePendingFeeTests);
  yield takeEvery(GET_SHARED_PERCENTAGE_APPROVED_FEE, fetchSharedPercentageApprovedFeeTests);
  yield takeEvery(UPDATE_SHARED_PERCENTAGE_PENDING_FEE, onUpdateSharedPercentagePendingFeeTest);
  yield takeEvery(UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE, onUpdateSharedPercentageAllPendingFeeTest);
}

export default sharedPercentagePendingFeeTestsSaga;
