import {
  GET_B2B_REFERRED_PATIENTS_LIST,
  GET_B2B_REFERRED_PATIENTS_LIST_SUCCESS,
  GET_B2B_REFERRED_PATIENTS_LIST_FAIL,
} from "./actionTypes";

export const getB2bReferredPatientsList = id => ({
  type: GET_B2B_REFERRED_PATIENTS_LIST,
  payload: id,
});

export const getB2bReferredPatientsListSuccess =
  b2bReferredPatients => ({
    type: GET_B2B_REFERRED_PATIENTS_LIST_SUCCESS,
    payload: b2bReferredPatients,
  });

export const getB2bReferredPatientsListFail = error => ({
  type: GET_B2B_REFERRED_PATIENTS_LIST_FAIL,
  payload: error,
});
