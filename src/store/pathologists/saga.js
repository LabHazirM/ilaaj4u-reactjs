import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_PATHOLOGISTS,
  ADD_NEW_PATHOLOGIST,
  DELETE_PATHOLOGIST,
  UPDATE_PATHOLOGIST,
} from "./actionTypes";

import {
  getPathologistsSuccess,
  getPathologistsFail,
  addPathologistFail,
  addPathologistSuccess,
  updatePathologistSuccess,
  updatePathologistFail,
  deletePathologistSuccess,
  deletePathologistFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getPathologists,
  addNewPathologist,
  updatePathologist,
  deletePathologist,
} from "../../helpers/django_api_helper";

function* fetchPathologists(object) {
  try {
    const response = yield call(getPathologists, object.payload);
    yield put(getPathologistsSuccess(response));
  } catch (error) {
    yield put(getPathologistsFail(error));
  }
}

function* onAddNewPathologist(object) {
  try {
    const response = yield call(
      addNewPathologist,
      object.payload.pathologist,
      object.payload.id
    );
    yield put(addPathologistSuccess(response));
  } catch (error) {
    yield put(addPathologistFail(error));
  }
}

function* onUpdatePathologist({ payload: pathologist }) {
  try {
    const response = yield call(updatePathologist, pathologist);
    yield put(updatePathologistSuccess(response));
  } catch (error) {
    yield put(updatePathologistFail(error));
  }
}

function* onDeletePathologist({ payload: pathologist }) {
  try {
    const response = yield call(deletePathologist, pathologist);
    yield put(deletePathologistSuccess(response));
  } catch (error) {
    yield put(deletePathologistFail(error));
  }
}

function* pathologistsSaga() {
  yield takeEvery(GET_PATHOLOGISTS, fetchPathologists);
  yield takeEvery(ADD_NEW_PATHOLOGIST, onAddNewPathologist);
  yield takeEvery(UPDATE_PATHOLOGIST, onUpdatePathologist);
  yield takeEvery(DELETE_PATHOLOGIST, onDeletePathologist);
}

export default pathologistsSaga;
