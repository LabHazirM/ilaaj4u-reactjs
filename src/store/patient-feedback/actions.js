import {
  ADD_NEW_PATIENT_FEEDBACK,
  ADD_PATIENT_FEEDBACK_SUCCESS,
  ADD_PATIENT_FEEDBACK_FAIL,
} from "./actionTypes";

// ----------- patient Feedback list APIs actions -----------------

export const addNewPatientFeedback = patientFeedback => ({
  type: ADD_NEW_PATIENT_FEEDBACK,
  payload: { patientFeedback },
});

export const addPatientFeedbackSuccess = patientFeedback => ({
  type: ADD_PATIENT_FEEDBACK_SUCCESS,
  payload: patientFeedback,
});

export const addPatientFeedbackFail = error => ({
  type: ADD_PATIENT_FEEDBACK_FAIL,
  payload: error,
});
