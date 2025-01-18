import {
  GET_CORPORATE_PROFILE,
  GET_CORPORATE_PROFILE_FAIL,
  GET_CORPORATE_PROFILE_SUCCESS,
  UPDATE_CORPORATE_PROFILE,
  UPDATE_CORPORATE_PROFILE_SUCCESS,
  UPDATE_CORPORATE_PROFILE_FAIL,
} from "./actionTypes";

// ----------- Corporate profile APIs actions -----------------
export const getCorporateProfile = id => ({
  type: GET_CORPORATE_PROFILE,
  payload: id,
});

export const getCorporateProfileSuccess = CorporateProfile => ({
  type: GET_CORPORATE_PROFILE_SUCCESS,
  payload: CorporateProfile,
});

export const getCorporateProfileFail = error => ({
  type: GET_CORPORATE_PROFILE_FAIL,
  payload: error,
});

export const updateCorporateProfile = (CorporateProfile, id) => {
  console.log('Dispatching updateCorporateProfile action:', CorporateProfile, id);
  return {
    type: UPDATE_CORPORATE_PROFILE,
    payload: { CorporateProfile, id },
  };
};

export const updateCorporateProfileSuccess = (CorporateProfile) => {
  console.log('Dispatching suceesssupdateCorporateProfile action:', CorporateProfile);
  return{
  type: UPDATE_CORPORATE_PROFILE_SUCCESS,
  payload: CorporateProfile,
}
};


export const updateCorporateProfileFail = error => ({
  type: UPDATE_CORPORATE_PROFILE_FAIL,
  payload: error,
});
