import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { ADD_NEW_PATIENT_FEEDBACK } from "./actionTypes";

import { addPatientFeedbackFail, addPatientFeedbackSuccess } from "./actions";

//Include Both Helper File with needed methods
import { addNewPatientFeedback } from "../../helpers/django_api_helper";

function* onAddNewPatientFeedback(object) {
  try {
    const response = yield call(
      addNewPatientFeedback,
      object.payload.patientFeedback
    );
    yield put(addPatientFeedbackSuccess(response));
  } catch (error) {
    yield put(addPatientFeedbackFail(error));
  }
}

function* patientFeedbackSaga() {
  yield takeEvery(ADD_NEW_PATIENT_FEEDBACK, onAddNewPatientFeedback);
}

export default patientFeedbackSaga;
