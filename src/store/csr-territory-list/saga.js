import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_CSR_CENTRAL_TERRITORY_LIST ,GET_CSR_SOUTH_TERRITORY_LIST ,GET_CSR_NORTH_TERRITORY_LIST } from "./actionTypes";

import {
  getCsrCentralListSuccess,
  getCsrCentralListFail,
  getCsrSouthListSuccess,
  getCsrSouthListFail,
  getCsrNorthListSuccess,
  getCsrNorthListFail,
  
} from "./actions";

//Include Both Helper File with needed methods
import { getCsrCentralList, getCsrSouthList, getCsrNorthList } from "../../helpers/django_api_helper";

function* fetchCsrCentralList(object) {
  try {
    const response = yield call(getCsrCentralList, object.payload);
    yield put(getCsrCentralListSuccess(response));
  } catch (error) {
    yield put(getCsrCentralListFail(error));
  }
}
// SOUTH
function* fetchCsrSouthList(object) {
  try {
    const response = yield call(getCsrSouthList, object.payload);
    yield put(getCsrSouthListSuccess(response));
  } catch (error) {
    yield put(getCsrSouthListFail(error));
  }
}

// NORTH
function* fetchCsrNorthList(object) {
  try {
    const response = yield call(getCsrNorthList, object.payload);
    yield put(getCsrNorthListSuccess(response));
  } catch (error) {
    yield put(getCsrNorthListFail(error));
  }
}

function* csrTerritoryListSaga() {
  yield takeEvery(
    GET_CSR_CENTRAL_TERRITORY_LIST,
    fetchCsrCentralList
  );
  yield takeEvery(
    GET_CSR_SOUTH_TERRITORY_LIST,
    fetchCsrSouthList
  );

yield takeEvery(
  GET_CSR_NORTH_TERRITORY_LIST,
  fetchCsrNorthList
);
}

export default csrTerritoryListSaga;
