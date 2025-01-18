import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_LABS_LIST, GET_DONORS_LIST, GET_DONORSA } from "./actionTypes";

import {
  getLabsListSuccess,
  getLabsListFail,
  getDonorsListSuccess,
  getDonorsListFail,
  getDonorsASuccess,
  getDonorsAFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getLabsList ,getDonorsList, getDonorsA } from "../../helpers/django_api_helper";

function* fetchLabsList(object) {
  try {
    const response = yield call(getLabsList, object.payload);
    yield put(getLabsListSuccess(response));
  } catch (error) {
    yield put(getLabsListFail(error));
  }
}
function* fetchDonorsList(object) {
  try {
    const response = yield call(getDonorsList, object.payload);
    yield put(getDonorsListSuccess(response));
  } catch (error) {
    yield put(getDonorsListFail(error));
  }
}
function* fetchDonorsA(object) {
  try {
    const response = yield call(getDonorsA, object.payload);
    yield put(getDonorsASuccess(response));
  } catch (error) {
    yield put(getDonorsAFail(error));
  }
}

function* LabsSaga() {
  yield takeEvery(
    GET_LABS_LIST,
    fetchLabsList
  );
  yield takeEvery(
    GET_DONORS_LIST,
    fetchDonorsList
  );
yield takeEvery(GET_DONORSA, fetchDonorsA);

}

export default LabsSaga;
