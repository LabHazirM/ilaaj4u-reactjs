import {
  GET_PATIENT_TEST_APPOINTMENTS_LIST,
  GET_PATIENT_TEST_APPOINTMENTS_LIST_SUCCESS,
  GET_PATIENT_TEST_APPOINTMENTS_LIST_FAIL,
} from "./actionTypes";

export const getPatientTestAppointmentsList = id => ({
  type: GET_PATIENT_TEST_APPOINTMENTS_LIST,
  payload: id,
});

export const getPatientTestAppointmentsListSuccess =
  patientTestAppointments => ({
    type: GET_PATIENT_TEST_APPOINTMENTS_LIST_SUCCESS,
    payload: patientTestAppointments,
  });

export const getPatientTestAppointmentsListFail = error => ({
  type: GET_PATIENT_TEST_APPOINTMENTS_LIST_FAIL,
  payload: error,
});
