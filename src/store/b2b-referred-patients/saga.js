import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_B2B_REFERRED_PATIENTS_LIST } from "./actionTypes";

import {
  getB2bReferredPatientsListSuccess,
  getB2bReferredPatientsListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getB2bReferredPatientsList } from "../../helpers/django_api_helper";

function* fetchB2bReferredPatientsList(object) {
  try {
    const response = yield call(getB2bReferredPatientsList, object.payload);
    yield put(getB2bReferredPatientsListSuccess(response));
  } catch (error) {
    yield put(getB2bReferredPatientsListFail(error));
  }
}

function* B2bReferredPatientsSaga() {
  yield takeEvery(
    GET_B2B_REFERRED_PATIENTS_LIST,
    fetchB2bReferredPatientsList
  );
}

export default B2bReferredPatientsSaga;
