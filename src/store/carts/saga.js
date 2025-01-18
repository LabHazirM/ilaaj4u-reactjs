import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_CARTS, DELETE_CART, EMPTY_CART } from "./actionTypes";

import {
  getCartsSuccess,
  getCartsFail,
  deleteCartSuccess,
  deleteCartFail,
  emptyCartSuccess,
  emptyCartFail,
  addToCartSuccess,
  addToCartFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getCarts,
  deleteCart,
  emptyCart,
  addToCart,
} from "../../helpers/django_api_helper";
import { ADD_TO_CART } from "helpers/url_helper";

function* fetchCarts(object) {
  try {
    const response = yield call(getCarts, object.payload);
    yield put(getCartsSuccess(response));
  } catch (error) {
    yield put(getCartsFail(error));
  }
}

function* onEmptyCart({ payload: cart }) {
  try {
    const response = yield call(emptyCart, cart);
    yield put(emptyCartSuccess, response);
  } catch (error) {
    yield put(emptyCartFail(error));
  }
}

function* onDeleteCart({ payload: cart }) {
  try {
    const response = yield call(deleteCart, cart);
    yield put(deleteCartSuccess(response));
  } catch (error) {
    yield put(deleteCartFail(error));
  }
}

function* onAddToCart(object) {
  console.log("sagaaa", object);
  try {
    const response = yield call(
      addToCart,
      object.payload.cart,
      object.payload.id,
      // object.payload.guest_id
    );

    // Throw error if status is not 200
    if (response.data.status == 200) {
      yield put(addToCartSuccess(response.data.message));
      yield put(addToCartFail(""));
    } else {
      yield put(addToCartFail(response.data.message));
      yield put(addToCartSuccess(""));
    }
  } catch (error) {
    yield put(addToCartFail(error));
  }
}

function* cartsSaga() {
  yield takeEvery(GET_CARTS, fetchCarts);
  yield takeEvery(EMPTY_CART, onEmptyCart);
  yield takeEvery(DELETE_CART, onDeleteCart);
  yield takeEvery(ADD_TO_CART, onAddToCart);
}

export default cartsSaga;
