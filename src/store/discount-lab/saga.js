import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_DISCOUNT_LAB,
  UPDATE_DISCOUNT_LAB,
  UPDATE_DISCOUNT_ALL_LAB,

} from "./actionTypes";

import {
  getDiscountLabSuccess,
  getDiscountLabFail,
  updateDiscountLabSuccess,
  updateDiscountLabFail,
  updateDiscountAllLabSuccess,
  updateDiscountAllLabFail,

} from "./actions";

//Include Both Helper File with needed methods
import { getDiscountLab, updateDiscountLab, updateDiscountAllLab,
} from "../../helpers/django_api_helper";

function* fetchDiscountLab(object) {
  try {
    const response = yield call(getDiscountLab, object.payload);
    yield put(getDiscountLabSuccess(response));
  } catch (error) {
    yield put(getDiscountLabFail(error));
  }
}
function* onUpdateDiscountLab({ payload: discountLabs }) {
  try {
    const response = yield call(updateDiscountLab, discountLabs);
    yield put(updateDiscountLabSuccess(response));
  } catch (error) {
    yield put(updateDiscountLabFail(error));
  }
}
function* onUpdateDiscountAllLab({ payload: discountAllLab }) {
  try {
    const response = yield call(updateDiscountAllLab, discountAllLab);
    yield put(updateDiscountAllLabSuccess(response));
  } catch (error) {
    yield put(updateDiscountAllLabFail(error));
  }
}
function* discountLabSaga() {
  yield takeEvery(
    GET_DISCOUNT_LAB,
    fetchDiscountLab
  );
  yield takeEvery(UPDATE_DISCOUNT_LAB, onUpdateDiscountLab);
  yield takeEvery(UPDATE_DISCOUNT_ALL_LAB, onUpdateDiscountAllLab);

}

export default discountLabSaga;
