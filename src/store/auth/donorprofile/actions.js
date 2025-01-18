import {
  GET_DONOR_PROFILE,
  GET_DONOR_PROFILE_FAIL,
  GET_DONOR_PROFILE_SUCCESS,
  UPDATE_DONOR_PROFILE,
  UPDATE_DONOR_PROFILE_SUCCESS,
  UPDATE_DONOR_PROFILE_FAIL,
} from "./actionTypes";

// ----------- Lab profile APIs actions -----------------
export const getDonorProfile = id => ({
  type: GET_DONOR_PROFILE,
  payload: id,
});

export const getDonorProfileSuccess = donorProfile => ({
  type: GET_DONOR_PROFILE_SUCCESS,
  payload: donorProfile,
});

export const getDonorProfileFail = error => ({
  type: GET_DONOR_PROFILE_FAIL,
  payload: error,
});

export const updateDonorProfile = (donorProfile, id) => ({
  type: UPDATE_DONOR_PROFILE,
  payload: { donorProfile, id },
});

export const updateDonorProfileSuccess = donorProfile => ({
  type: UPDATE_DONOR_PROFILE_SUCCESS,
  payload: donorProfile,
});

export const updateDonorProfileFail = error => ({
  type: UPDATE_DONOR_PROFILE_FAIL,
  payload: error,
});
