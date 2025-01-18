import {
  GET_CSR_APPOINTMENTS,
  GET_CSR_APPOINTMENTS_FAIL,
  GET_CSR_APPOINTMENTS_SUCCESS,
  UPDATE_CSR_APPOINTMENTS,
  UPDATE_CSR_APPOINTMENTS_SUCCESS,
  UPDATE_CSR_APPOINTMENTS_FAIL,
} from "./actionTypes";


// ----------- Handled Complaints APIs actions -----------------
export const getCsrAppointments = id => ({
  type: GET_CSR_APPOINTMENTS,
  payload: id,
});

export const getCsrAppointmentsSuccess = csrAppointments => ({
  type: GET_CSR_APPOINTMENTS_SUCCESS,
  payload: csrAppointments,
});

export const getCsrAppointmentsFail = error => ({
  type: GET_CSR_APPOINTMENTS_FAIL,
  payload: error,
})
export const updateCsrAppointments = csrAppointments => ({
  type: UPDATE_CSR_APPOINTMENTS,
  payload: csrAppointments,
});

export const updateCsrAppointmentsSuccess = csrAppointments => ({
  type: UPDATE_CSR_APPOINTMENTS_SUCCESS,
  payload: csrAppointments,
});

export const updateCsrAppointmentsFail = error => ({
  type: UPDATE_CSR_APPOINTMENTS_FAIL,
  payload: error,
});
