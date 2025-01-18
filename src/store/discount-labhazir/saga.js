import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_DISCOUNT_LABHAZIRS,
  UPDATE_DISCOUNT_LABHAZIR,
  UPDATE_DISCOUNT_ALL_LABHAZIR,
} from "./actionTypes";

import {
  getDiscountLabHazirsSuccess,
  getDiscountLabHazirsFail,
  updateDiscountLabHazirSuccess,
  updateDiscountLabHazirFail,
  updateDiscountAllLabHazirSuccess,
  updateDiscountAllLabHazirFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getDiscountLabHazirs,
  updateDiscountLabHazir,
  updateDiscountAllLabHazir,
} from "../../helpers/django_api_helper";

function* fetchDiscountLabHazirs() {
  try {
    const response = yield call(getDiscountLabHazirs);
    console.log("discountLabHazir saga: ", response);
    yield put(getDiscountLabHazirsSuccess(response));
  } catch (error) {
    yield put(getDiscountLabHazirsFail(error));
  }
}

function* onUpdateDiscountLabHazir({ payload: discountLabHazir }) {
  try {
    const response = yield call(updateDiscountLabHazir, discountLabHazir);
    yield put(updateDiscountLabHazirSuccess(response));
  } catch (error) {
    yield put(updateDiscountLabHazirFail(error));
  }
}

function* onUpdateDiscountAllLabHazir({ payload: discountAllLabHazir }) {
  try {
    const response = yield call(updateDiscountAllLabHazir, discountAllLabHazir);
    yield put(updateDiscountAllLabHazirSuccess(response));
  } catch (error) {
    yield put(updateDiscountAllLabHazirFail(error));
  }
}

function* discountLabHazirsSaga() {
  yield takeEvery(GET_DISCOUNT_LABHAZIRS, fetchDiscountLabHazirs);
  yield takeEvery(UPDATE_DISCOUNT_LABHAZIR, onUpdateDiscountLabHazir);
  yield takeEvery(UPDATE_DISCOUNT_ALL_LABHAZIR, onUpdateDiscountAllLabHazir);
}

export default discountLabHazirsSaga;
