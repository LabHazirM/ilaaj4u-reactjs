import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_AUDITOR_CENTRAL_TERRITORY_LIST ,GET_AUDITOR_SOUTH_TERRITORY_LIST ,GET_AUDITOR_NORTH_TERRITORY_LIST } from "./actionTypes";

import {
  getAuditorCentralListSuccess,
  getAuditorCentralListFail,
  getAuditorSouthListSuccess,
  getAuditorSouthListFail,
  getAuditorNorthListSuccess,
  getAuditorNorthListFail,
  
} from "./actions";

//Include Both Helper File with needed methods
import { getAuditorCentralList, getAuditorSouthList, getAuditorNorthList } from "../../helpers/django_api_helper";

function* fetchAuditorCentralList(object) {
  try {
    const response = yield call(getAuditorCentralList, object.payload);
    yield put(getAuditorCentralListSuccess(response));
  } catch (error) {
    yield put(getAuditorCentralListFail(error));
  }
}
// SOUTH
function* fetchAuditorSouthList(object) {
  try {
    const response = yield call(getAuditorSouthList, object.payload);
    yield put(getAuditorSouthListSuccess(response));
  } catch (error) {
    yield put(getAuditorSouthListFail(error));
  }
}

// NORTH
function* fetchAuditorNorthList(object) {
  try {
    const response = yield call(getAuditorNorthList, object.payload);
    yield put(getAuditorNorthListSuccess(response));
  } catch (error) {
    yield put(getAuditorNorthListFail(error));
  }
}

function* auditorTerritoryListSaga() {
  yield takeEvery(
    GET_AUDITOR_CENTRAL_TERRITORY_LIST,
    fetchAuditorCentralList
  );
  yield takeEvery(
    GET_AUDITOR_SOUTH_TERRITORY_LIST,
    fetchAuditorSouthList
  );

yield takeEvery(
  GET_AUDITOR_NORTH_TERRITORY_LIST,
  fetchAuditorNorthList
);
}

export default auditorTerritoryListSaga;
