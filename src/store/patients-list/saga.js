import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_PATIENTS_LIST } from "./actionTypes";

import {
  getPatientsListSuccess,
  getPatientsListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getPatientsList } from "../../helpers/django_api_helper";

function* fetchPatientsList(object) {
  try {
    const response = yield call(getPatientsList,
       object.payload.phone,
       );
    yield put(getPatientsListSuccess(response.data));
  } catch (error) {
    yield put(getPatientsListFail(error));
  }
}

function* PatientsSaga() {
  yield takeEvery(
    GET_PATIENTS_LIST,
    fetchPatientsList
  );
}

export default PatientsSaga;
