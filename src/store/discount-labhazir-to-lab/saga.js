import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_DISCOUNT_LABHAZIRTOLABS,
  UPDATE_DISCOUNT_LABHAZIRTOLAB,
  UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB,
} from "./actionTypes";

import {
  getDiscountLabHazirToLabsSuccess,
  getDiscountLabHazirToLabsFail,
  updateDiscountLabHazirToLabSuccess,
  updateDiscountLabHazirToLabFail,
  updateDiscountAllLabHazirToLabSuccess,
  updateDiscountAllLabHazirToLabFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getDiscountLabHazirToLabs,
  updateDiscountLabHazirToLab,
  updateDiscountAllLabHazirToLab,
} from "../../helpers/django_api_helper";

function* fetchDiscountLabHazirToLabs(object) {
  try {
    const response = yield call(getDiscountLabHazirToLabs, object.payload);
    console.log("discountLabHazirToLab saga: ", response);
    yield put(getDiscountLabHazirToLabsSuccess(response));
  } catch (error) {
    yield put(getDiscountLabHazirToLabsFail(error));
  }
}

function* onUpdateDiscountLabHazirToLab({ payload: discountLabHazirToLab }) {
  try {
    const response = yield call(updateDiscountLabHazirToLab, discountLabHazirToLab);
    yield put(updateDiscountLabHazirToLabSuccess(response));
  } catch (error) {
    yield put(updateDiscountLabHazirToLabFail(error));
  }
}

function* onUpdateDiscountAllLabHazirToLab({ payload: discountAllLabHazir }) {
  try {
    const response = yield call(updateDiscountAllLabHazirToLab, discountAllLabHazir);
    yield put(updateDiscountAllLabHazirToLabSuccess(response));
  } catch (error) {
    yield put(updateDiscountAllLabHazirToLabFail(error));
  }
}

function* discountLabHazirToLabsSaga() {
  yield takeEvery(GET_DISCOUNT_LABHAZIRTOLABS, fetchDiscountLabHazirToLabs);
  yield takeEvery(UPDATE_DISCOUNT_LABHAZIRTOLAB, onUpdateDiscountLabHazirToLab);
  yield takeEvery(UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB, onUpdateDiscountAllLabHazirToLab);
}

export default discountLabHazirToLabsSaga;
