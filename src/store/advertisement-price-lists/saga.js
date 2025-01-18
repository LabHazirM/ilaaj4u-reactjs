import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ADVERTISEMENT_PRICE_LISTS,
  ADD_NEW_ADVERTISEMENT_PRICE_LIST,
  DELETE_ADVERTISEMENT_PRICE_LIST,
  UPDATE_ADVERTISEMENT_PRICE_LIST,
} from "./actionTypes";

import {
  getAdvertisementPriceListsSuccess,
  getAdvertisementPriceListsFail,
  addAdvertisementPriceListFail,
  addAdvertisementPriceListSuccess,
  updateAdvertisementPriceListSuccess,
  updateAdvertisementPriceListFail,
  deleteAdvertisementPriceListSuccess,
  deleteAdvertisementPriceListFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getAdvertisementPriceLists,
  addNewAdvertisementPriceList,
  updateAdvertisementPriceList,
  deleteAdvertisementPriceList,
} from "../../helpers/django_api_helper";

function* fetchAdvertisementPriceLists() {
  try {
    const response = yield call(getAdvertisementPriceLists);
    console.log ("advertisementPriceList saga: ", response);
    yield put(getAdvertisementPriceListsSuccess(response));
  } catch (error) {
    yield put(getAdvertisementPriceListsFail(error));
  }
}

function* onAddNewAdvertisementPriceList(object) {
  try {
    const response = yield call(
      addNewAdvertisementPriceList,
      object.payload.advertisementPriceList,
      object.payload.id
    );
    yield put(addAdvertisementPriceListSuccess(response));
  } catch (error) {
    yield put(addAdvertisementPriceListFail(error));
  }
}

function* onUpdateAdvertisementPriceList({ payload: advertisementPriceList }) {
  try {
    const response = yield call(updateAdvertisementPriceList, advertisementPriceList);
    yield put(updateAdvertisementPriceListSuccess(response));
  } catch (error) {
    yield put(updateAdvertisementPriceListFail(error));
  }
}

function* onDeleteAdvertisementPriceList({ payload: advertisementPriceList }) {
  try {
    const response = yield call(deleteAdvertisementPriceList, advertisementPriceList);
    yield put(deleteAdvertisementPriceListSuccess(response));
  } catch (error) {
    yield put(deleteAdvertisementPriceListFail(error));
  }
}

function* advertisementPriceListsSaga() {
  yield takeEvery(GET_ADVERTISEMENT_PRICE_LISTS, fetchAdvertisementPriceLists);
  yield takeEvery(ADD_NEW_ADVERTISEMENT_PRICE_LIST, onAddNewAdvertisementPriceList);
  yield takeEvery(UPDATE_ADVERTISEMENT_PRICE_LIST, onUpdateAdvertisementPriceList);
  yield takeEvery(DELETE_ADVERTISEMENT_PRICE_LIST, onDeleteAdvertisementPriceList);
}

export default advertisementPriceListsSaga;
