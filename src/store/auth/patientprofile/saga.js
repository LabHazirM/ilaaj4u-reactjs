import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_PATIENT_PROFILE, UPDATE_PATIENT_PROFILE } from "./actionTypes";

import {
  getPatientProfileSuccess,
  getPatientProfileFail,
  updatePatientProfileSuccess,
  updatePatientProfileFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getPatientProfile,
  updatePatientProfile,
} from "../../../helpers/django_api_helper";

function* fetchPatientProfile(object) {
  try {
    const response = yield call(getPatientProfile, object.payload);
    yield put(getPatientProfileSuccess(response));
  } catch (error) {
    yield put(getPatientProfileFail(error));
  }
}

function* onUpdatePatientProfile({ payload: { patientProfile, id } }) {
  try {
    const response = yield call(updatePatientProfile, patientProfile, id);
    yield put(updatePatientProfileSuccess(response));
  } catch (error) {
    yield put(updatePatientProfileFail(error));
  }
}

function* patientProfileSaga() {
  yield takeEvery(GET_PATIENT_PROFILE, fetchPatientProfile);
  yield takeEvery(UPDATE_PATIENT_PROFILE, onUpdatePatientProfile);
}

export default patientProfileSaga;
