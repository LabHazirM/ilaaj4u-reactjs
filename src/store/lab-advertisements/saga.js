import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  // GET_ADVERTISEMENT_PRICE_LISTS,
  GET_LAB_ADVERTISEMENTS,
  ADD_NEW_LAB_ADVERTISEMENT,
  DELETE_LAB_ADVERTISEMENT,
  UPDATE_LAB_ADVERTISEMENT,
} from "./actionTypes";

import {
  // getAdvertisementPriceListsSuccess,
  // getAdvertisementPriceListsFail,
  getLabAdvertisementsSuccess,
  getLabAdvertisementsFail,
  addLabAdvertisementFail,
  addLabAdvertisementSuccess,
  updateLabAdvertisementSuccess,
  updateLabAdvertisementFail,
  deleteLabAdvertisementSuccess,
  deleteLabAdvertisementFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  // getAdvertisementPriceLists,
  getLabAdvertisements,
  addNewLabAdvertisement,
  updateLabAdvertisement,
  deleteLabAdvertisement,
} from "../../helpers/django_api_helper";

// function* fetchAdvertisementPriceLists() {
//   try {
//     const response = yield call(getAdvertisementPriceLists);
//     console.log ("advertisementPriceList saga: ", response);
//     yield put(getAdvertisementPriceListsSuccess(response));
//   } catch (error) {
//     yield put(getAdvertisementPriceListsFail(error));
//   }
// }

function* fetchLabAdvertisements(object) {
  try {
    const response = yield call(getLabAdvertisements, object.payload);
    console.log ("labAdvertisement saga: ", response);
    
    yield put(getLabAdvertisementsSuccess(response));
  } catch (error) {
    yield put(getLabAdvertisementsFail(error));
  }
}

function* onAddNewLabAdvertisement(object) {
  try {
    const response = yield call(
      addNewLabAdvertisement,
      object.payload.labAdvertisement,
      object.payload.id
    );
    yield put(addLabAdvertisementSuccess(response));
  } catch (error) {
    yield put(addLabAdvertisementFail(error));
  }
}

function* onUpdateLabAdvertisement({ payload: labAdvertisement }) {
  try {
    const response = yield call(updateLabAdvertisement, labAdvertisement);
    yield put(updateLabAdvertisementSuccess(response));
  } catch (error) {
    yield put(updateLabAdvertisementFail(error));
  }
}

function* onDeleteLabAdvertisement({ payload: labAdvertisement }) {
  try {
    const response = yield call(deleteLabAdvertisement, labAdvertisement);
    yield put(deleteLabAdvertisementSuccess(response));
  } catch (error) {
    yield put(deleteLabAdvertisementFail(error));
  }
}

function* labAdvertisementsSaga() {
  // yield takeEvery(GET_ADVERTISEMENT_PRICE_LISTS, fetchAdvertisementPriceLists);
  yield takeEvery(GET_LAB_ADVERTISEMENTS, fetchLabAdvertisements);
  yield takeEvery(ADD_NEW_LAB_ADVERTISEMENT, onAddNewLabAdvertisement);
  yield takeEvery(UPDATE_LAB_ADVERTISEMENT, onUpdateLabAdvertisement);
  yield takeEvery(DELETE_LAB_ADVERTISEMENT, onDeleteLabAdvertisement);
}

export default labAdvertisementsSaga;
