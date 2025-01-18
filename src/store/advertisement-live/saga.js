import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_ADVERTISEMENT_LIVES } from "./actionTypes";

import {
  getAdvertisementLivesFail,
  getAdvertisementLivesSuccess,
} from "./actions";
//Include Both Helper File with needed methods
import { getAdvertisementLives } from "../../helpers/django_api_helper";

function* fetchAdvertisementLives(object) {
  try {
    const response = yield call(getAdvertisementLives, object.payload);
    yield put(getAdvertisementLivesSuccess(response));
  } catch (error) {
    yield put(getAdvertisementLivesFail(error));
  }
}

function* AdvertisementLivesSaga() {
  yield takeEvery(GET_ADVERTISEMENT_LIVES, fetchAdvertisementLives);
}

export default AdvertisementLivesSaga;
