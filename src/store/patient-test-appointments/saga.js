import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_PATIENT_TEST_APPOINTMENTS_LIST } from "./actionTypes";

import {
  getPatientTestAppointmentsListSuccess,
  getPatientTestAppointmentsListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getPatientTestAppointmentsList } from "../../helpers/django_api_helper";

function* fetchPatientTestAppointmentsList(object) {
  try {
    const response = yield call(getPatientTestAppointmentsList, object.payload);
    yield put(getPatientTestAppointmentsListSuccess(response));
  } catch (error) {
    yield put(getPatientTestAppointmentsListFail(error));
  }
}

function* PatientTestAppointmentsSaga() {
  yield takeEvery(
    GET_PATIENT_TEST_APPOINTMENTS_LIST,
    fetchPatientTestAppointmentsList
  );
}

export default PatientTestAppointmentsSaga;
