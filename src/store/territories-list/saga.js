import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_TERRITORIES_LIST } from "./actionTypes";

import {
  getTerritoriesListSuccess,
  getTerritoriesListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getTerritoriesList } from "../../helpers/django_api_helper";

function* fetchTerritoriesList(object) {
  try {
    const response = yield call(getTerritoriesList, object.payload);
    yield put(getTerritoriesListSuccess(response));
  } catch (error) {
    yield put(getTerritoriesListFail(error));
  }
}

function* TerritoriesListSaga() {
  yield takeEvery(
    GET_TERRITORIES_LIST,
    fetchTerritoriesList
  );
}

export default TerritoriesListSaga;