import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_LABS_LIST_PENDING_FEE, GET_LABS_LIST_APPROVED_FEE } from "./actionTypes";

import {
  getLabsListApprovedFeeSuccess,
  getLabsListApprovedFeeFail,
  getLabsListPendingFeeSuccess,
  getLabsListPendingFeeFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getLabsListPendingFee, getLabsListApprovedFee } from "../../helpers/django_api_helper";

function* fetchLabsListPendingFee(object) {
  try {
    const response = yield call(getLabsListPendingFee, object.payload);
    yield put(getLabsListPendingFeeSuccess(response));
  } catch (error) {
    yield put(getLabsListPendingFeeFail(error));
  }
}

function* fetchLabsListApprovedFee(object) {
  try {
    const response = yield call(getLabsListApprovedFee, object.payload);
    yield put(getLabsListApprovedFeeSuccess(response));
  } catch (error) {
    yield put(getLabsListApprovedFeeFail(error));
  }
}

function* LabsListPendingFeeSaga() {
  yield takeEvery(
    GET_LABS_LIST_PENDING_FEE,
    fetchLabsListPendingFee
  );
  yield takeEvery(
    GET_LABS_LIST_APPROVED_FEE,
    fetchLabsListApprovedFee
  );
}

export default LabsListPendingFeeSaga;
