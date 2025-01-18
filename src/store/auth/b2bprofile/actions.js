import {
  GET_B2B_PROFILE,
  GET_B2B_PROFILE_FAIL,
  GET_B2B_PROFILE_SUCCESS,
  UPDATE_B2B_PROFILE,
  UPDATE_B2B_PROFILE_SUCCESS,
  UPDATE_B2B_PROFILE_FAIL,
} from "./actionTypes";

// ----------- Lab profile APIs actions -----------------
export const getB2bProfile = id => ({
  type: GET_B2B_PROFILE,
  payload: id,
});

export const getB2bProfileSuccess = b2bProfile => ({
  type: GET_B2B_PROFILE_SUCCESS,
  payload: b2bProfile,
});

export const getB2bProfileFail = error => ({
  type: GET_B2B_PROFILE_FAIL,
  payload: error,
});

export const updateB2bProfile = (b2bProfile, id) => ({
  type: UPDATE_B2B_PROFILE,
  payload: { b2bProfile, id },
});

export const updateB2bProfileSuccess = b2bProfile => ({
  type: UPDATE_B2B_PROFILE_SUCCESS,
  payload: b2bProfile,
});

export const updateB2bProfileFail = error => ({
  type: UPDATE_B2B_PROFILE_FAIL,
  payload: error,
});
