import {
  GET_PATIENT_PROFILE,
  GET_PATIENT_PROFILE_FAIL,
  GET_PATIENT_PROFILE_SUCCESS,
  UPDATE_PATIENT_PROFILE,
  UPDATE_PATIENT_PROFILE_SUCCESS,
  UPDATE_PATIENT_PROFILE_FAIL,
} from "./actionTypes";

// ----------- Patient profile APIs actions -----------------
export const getPatientProfile = id => ({
  type: GET_PATIENT_PROFILE,
  payload: id,
});

export const getPatientProfileSuccess = patientProfile => ({
  type: GET_PATIENT_PROFILE_SUCCESS,
  payload: patientProfile,
});

export const getPatientProfileFail = error => ({
  type: GET_PATIENT_PROFILE_FAIL,
  payload: error,
});

export const updatePatientProfile = (patientProfile, id) => ({
  type: UPDATE_PATIENT_PROFILE,
  payload: { patientProfile, id },
});

export const updatePatientProfileSuccess = patientProfile => ({
  type: UPDATE_PATIENT_PROFILE_SUCCESS,
  payload: patientProfile,
});

export const updatePatientProfileFail = error => ({
  type: UPDATE_PATIENT_PROFILE_FAIL,
  payload: error,
});
