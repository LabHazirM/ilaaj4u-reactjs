import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ADVERTISEMENTS,
  ADD_NEW_ADVERTISEMENT,
  DELETE_ADVERTISEMENT,
  UPDATE_ADVERTISEMENT,
} from "./actionTypes";

import {
  getAdvertisementsSuccess,
  getAdvertisementsFail,
  addAdvertisementFail,
  addAdvertisementSuccess,
  updateAdvertisementSuccess,
  updateAdvertisementFail,
  deleteAdvertisementSuccess,
  deleteAdvertisementFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getAdvertisements,
  addNewAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
} from "../../helpers/django_api_helper";

function* fetchAdvertisements() {
  try {
    const response = yield call(getAdvertisements);
    console.log ("advertisement saga: ", response);
    yield put(getAdvertisementsSuccess(response));
  } catch (error) {
    yield put(getAdvertisementsFail(error));
  }
}

function* onAddNewAdvertisement(object) {
  try {
    const response = yield call(
      addNewAdvertisement,
      object.payload.advertisement,
      object.payload.id
    );
    yield put(addAdvertisementSuccess(response));
  } catch (error) {
    yield put(addAdvertisementFail(error));
  }
}

function* onUpdateAdvertisement({ payload: advertisement }) {
  try {
    const response = yield call(updateAdvertisement, advertisement);
    yield put(updateAdvertisementSuccess(response));
  } catch (error) {
    yield put(updateAdvertisementFail(error));
  }
}

function* onDeleteAdvertisement({ payload: advertisement }) {
  try {
    const response = yield call(deleteAdvertisement, advertisement);
    yield put(deleteAdvertisementSuccess(response));
  } catch (error) {
    yield put(deleteAdvertisementFail(error));
  }
}

function* advertisementsSaga() {
  yield takeEvery(GET_ADVERTISEMENTS, fetchAdvertisements);
  yield takeEvery(ADD_NEW_ADVERTISEMENT, onAddNewAdvertisement);
  yield takeEvery(UPDATE_ADVERTISEMENT, onUpdateAdvertisement);
  yield takeEvery(DELETE_ADVERTISEMENT, onDeleteAdvertisement);
}

export default advertisementsSaga;
