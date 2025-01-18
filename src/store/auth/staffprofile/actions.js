import {
  GET_STAFF_PROFILE,
  GET_STAFF_PROFILE_FAIL,
  GET_STAFF_PROFILE_SUCCESS,
  UPDATE_STAFF_PROFILE,
  UPDATE_STAFF_PROFILE_SUCCESS,
  UPDATE_STAFF_PROFILE_FAIL,
} from "./actionTypes";

// ----------- Staff profile APIs actions -----------------
export const getStaffProfile = id => ({
  type: GET_STAFF_PROFILE,
  payload: id,
});

export const getStaffProfileSuccess = staffProfile => ({
  type: GET_STAFF_PROFILE_SUCCESS,
  payload: staffProfile,
});

export const getStaffProfileFail = error => ({
  type: GET_STAFF_PROFILE_FAIL,
  payload: error,
});

export const updateStaffProfile = (staffProfile, id) => ({
  type: UPDATE_STAFF_PROFILE,
  payload: { staffProfile, id },
});

export const updateStaffProfileSuccess = staffProfile => ({
  type: UPDATE_STAFF_PROFILE_SUCCESS,
  payload: staffProfile,
});

export const updateStaffProfileFail = error => ({
  type: UPDATE_STAFF_PROFILE_FAIL,
  payload: error,
});
