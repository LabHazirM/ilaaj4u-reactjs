import {
  GET_LAB_PROFILE,
  GET_LAB_PROFILE_FAIL,
  GET_LAB_PROFILE_SUCCESS,
  UPDATE_LAB_PROFILE,
  UPDATE_LAB_PROFILE_SUCCESS,
  UPDATE_LAB_PROFILE_FAIL,
} from "./actionTypes";

// ----------- Lab profile APIs actions -----------------
export const getLabProfile = id => ({
  type: GET_LAB_PROFILE,
  payload: id,
});

export const getLabProfileSuccess = labProfile => ({
  type: GET_LAB_PROFILE_SUCCESS,
  payload: labProfile,
});

export const getLabProfileFail = error => ({
  type: GET_LAB_PROFILE_FAIL,
  payload: error,
});

export const updateLabProfile = (labProfile, id) => {
  console.log('Dispatching CorporateProfile action:', labProfile);
  return{
  type: UPDATE_LAB_PROFILE,
  payload: { labProfile, id },
}};

export const updateLabProfileSuccess = (labProfile) => {
  console.log('Dispatching suceesssupdateCorporateProfile action:', labProfile);
  return{
  type: UPDATE_LAB_PROFILE_SUCCESS,
  payload: labProfile,
}};

export const updateLabProfileFail = error => ({
  type: UPDATE_LAB_PROFILE_FAIL,
  payload: error,
});
