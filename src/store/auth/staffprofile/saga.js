import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_STAFF_PROFILE, UPDATE_STAFF_PROFILE } from "./actionTypes";

import {
  getStaffProfileSuccess,
  getStaffProfileFail,
  updateStaffProfileSuccess,
  updateStaffProfileFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getStaffProfile,
  updateStaffProfile,
} from "../../../helpers/django_api_helper";

function* fetchStaffProfile(object) {
  try {
    const response = yield call(getStaffProfile, object.payload);
    yield put(getStaffProfileSuccess(response));
  } catch (error) {
    yield put(getStaffProfileFail(error));
  }
}

function* onUpdateStaffProfile({ payload: { staffProfile, id } }) {
  try {
    const response = yield call(updateStaffProfile, staffProfile, id);
    yield put(updateStaffProfileSuccess(response));
  } catch (error) {
    yield put(updateStaffProfileFail(error));
  }
}

function* staffProfileSaga() {
  yield takeEvery(GET_STAFF_PROFILE, fetchStaffProfile);
  yield takeEvery(UPDATE_STAFF_PROFILE, onUpdateStaffProfile);
}

export default staffProfileSaga;
