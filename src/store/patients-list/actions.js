import {
  GET_PATIENTS_LIST,
  GET_PATIENTS_LIST_SUCCESS,
  GET_PATIENTS_LIST_FAIL,
} from "./actionTypes";

export const getPatientsList = (phone) => ({
  type: GET_PATIENTS_LIST,
  payload: {phone},
});

export const getPatientsListSuccess =
  patients => ({
    type: GET_PATIENTS_LIST_SUCCESS,
    payload: patients,
  });

export const getPatientsListFail = error => ({
  type: GET_PATIENTS_LIST_FAIL,
  payload: error,
});
