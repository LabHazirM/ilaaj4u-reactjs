import {
  GET_DOCTOR_PROFILE,
  GET_DOCTOR_PROFILE_FAIL,
  GET_DOCTOR_PROFILE_SUCCESS,
  UPDATE_DOCTOR_PROFILE,
  UPDATE_DOCTOR_PROFILE_SUCCESS,
  UPDATE_DOCTOR_PROFILE_FAIL,
} from "./actionTypes";

// ----------- Lab profile APIs actions -----------------
export const getDoctorProfile = id => ({
  type: GET_DOCTOR_PROFILE,
  payload: id,
});

export const getDoctorProfileSuccess = doctorProfile => ({
  type: GET_DOCTOR_PROFILE_SUCCESS,
  payload: doctorProfile,
});

export const getDoctorProfileFail = error => ({
  type: GET_DOCTOR_PROFILE_FAIL,
  payload: error,
});

export const updateDoctorProfile = (doctorProfile, id) => ({
  type: UPDATE_DOCTOR_PROFILE,
  payload: { doctorProfile, id },
});

export const updateDoctorProfileSuccess = doctorProfile => ({
  type: UPDATE_DOCTOR_PROFILE_SUCCESS,
  payload: doctorProfile,
});

export const updateDoctorProfileFail = error => ({
  type: UPDATE_DOCTOR_PROFILE_FAIL,
  payload: error,
});
