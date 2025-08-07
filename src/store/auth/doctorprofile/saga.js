import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_DOCTOR_PROFILE, UPDATE_DOCTOR_PROFILE } from "./actionTypes";

import {
  getDoctorProfileSuccess,
  getDoctorProfileFail,
  updateDoctorProfileSuccess,
  updateDoctorProfileFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getDoctorProfile,
  updateDoctorProfile,
} from "../../../helpers/django_api_helper";

function* fetchDoctorProfile(object) {
  try {
    const response = yield call(getDoctorProfile, object.payload);
    console.log("response: ", response);
    yield put(getDoctorProfileSuccess(response));
  } catch (error) {
    yield put(getDoctorProfileFail(error));
  }
}

function* onUpdateDoctorProfile({ payload: { doctorProfile, id } }) {
  try {
    const response = yield call(updateDoctorProfile, doctorProfile, id);
    yield put(updateDoctorProfileSuccess(response));
  } catch (error) {
    yield put(updateDoctorProfileFail(error));
  }
}

function* doctorProfileSaga() {
  yield takeEvery(GET_DOCTOR_PROFILE, fetchDoctorProfile);
  yield takeEvery(UPDATE_DOCTOR_PROFILE, onUpdateDoctorProfile);
}

export default doctorProfileSaga;
