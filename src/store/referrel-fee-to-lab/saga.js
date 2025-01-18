import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_REFERREL_FEES,
  GET_PUT_REFERREL_FEES,
  UPDATE_REFERREL_FEE,
  UPDATE_REFERREL_ALL_FEE,
} from "./actionTypes";

import {
  getReferrelFeeLabsSuccess,
  getReferrelFeeLabsFail,
  getPutReferrelFeeLabsSuccess,
  getPutReferrelFeeLabsFail,
  updateReferrelFeeLabSuccess,
  updateReferrelFeeLabFail,
  updateReferrelAllFeeLabSuccess,
  updateReferrelAllFeeLabFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getReferrelFeeLabs,
  getPutReferrelFeeLabs,
  updateReferrelFeeLab,
  updateReferrelAllFeeLab,
} from "../../helpers/django_api_helper";

function* fetchReferrelFeeLabs(object) {
  try {
    const response = yield call(getReferrelFeeLabs, object.payload);
    console.log("ReferrelFeeLab saga: ", response);
    yield put(getReferrelFeeLabsSuccess(response));
  } catch (error) {
    yield put(getReferrelFeeLabsFail(error));
  }
}
function* fetchPutReferrelFeeLabs(object) {
  try {
    const response = yield call(getPutReferrelFeeLabs, 
      object.payload.test_name,
      );
    yield put(getPutReferrelFeeLabsSuccess(response.data));
  } catch (error) {
    yield put(getPutReferrelFeeLabsFail(error));
  }
}

function* onUpdateReferrelFeeLab({ payload: ReferrelFeeLab }) {
  try {
    const response = yield call(updateReferrelFeeLab, ReferrelFeeLab);
    yield put(updateReferrelFeeLabSuccess(response));
  } catch (error) {
    yield put(updateReferrelFeeLabFail(error));
  }
}

function* onUpdateReferrelAllFeeLab({payload: ReferrelFeeLab}) {
  try {
    const response = yield call(updateReferrelAllFeeLab, ReferrelFeeLab);
    yield put(updateReferrelAllFeeLabSuccess(response));
  } catch (error) {
    yield put(updateReferrelAllFeeLabFail(error));
  }
}

function* ReferrelFeeLabsSaga() {
  yield takeEvery(GET_REFERREL_FEES, fetchReferrelFeeLabs);
  yield takeEvery(GET_PUT_REFERREL_FEES, fetchPutReferrelFeeLabs);
  yield takeEvery(UPDATE_REFERREL_FEE, onUpdateReferrelFeeLab);
  yield takeEvery(UPDATE_REFERREL_ALL_FEE, onUpdateReferrelAllFeeLab);
}

export default ReferrelFeeLabsSaga;
