import {
  GET_DONOR_REFERRED_APPOINTMENTS_LIST,
  GET_DONOR_REFERRED_APPOINTMENTS_LIST_SUCCESS,
  GET_DONOR_REFERRED_APPOINTMENTS_LIST_FAIL,
} from "./actionTypes";

export const getDonorReferredAppointmentsList = id => ({
  type: GET_DONOR_REFERRED_APPOINTMENTS_LIST,
  payload: id,
});

export const getDonorReferredAppointmentsListSuccess =
  donorReferredAppointments => ({
    type: GET_DONOR_REFERRED_APPOINTMENTS_LIST_SUCCESS,
    payload: donorReferredAppointments,
  });

export const getDonorReferredAppointmentsListFail = error => ({
  type: GET_DONOR_REFERRED_APPOINTMENTS_LIST_FAIL,
  payload: error,
});
