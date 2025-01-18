import {
  GET_TERRITORIES_LIST,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  GET_DONOR_SETTINGS,
  GET_DONOR_SETTINGS_FAIL,
  GET_DONOR_SETTINGS_SUCCESS,
  UPDATE_DONOR_SETTINGS,
  UPDATE_DONOR_SETTINGS_SUCCESS,
  UPDATE_DONOR_SETTINGS_FAIL,
} from "./actionTypes";

// Territories
export const getTerritoriesList = () => ({
  type: GET_TERRITORIES_LIST,
  payload: {},
});

export const getTerritoriesListSuccess =
  territories => ({
    type: GET_TERRITORIES_LIST_SUCCESS,
    payload: territories,
  });

export const getTerritoriesListFail = error => ({
  type: GET_TERRITORIES_LIST_FAIL,
  payload: error,
});
// ----------- Donor settings APIs actions -----------------
export const getDonorSettings = id => ({
  type: GET_DONOR_SETTINGS,
  payload: id,
});


export const getDonorSettingsSuccess = donorSettings => ({
  type: GET_DONOR_SETTINGS_SUCCESS,
  payload: donorSettings,
});

export const getDonorSettingsFail = error => ({
  type: GET_DONOR_SETTINGS_FAIL,
  payload: error,
});

export const updateDonorSettings = (donorSettings, id) => ({
  type: UPDATE_DONOR_SETTINGS,
  payload: { donorSettings, id },
});

export const updateDonorSettingsSuccess = donorSettings => ({
  type: UPDATE_DONOR_SETTINGS_SUCCESS,
  payload: donorSettings,
});

export const updateDonorSettingsFail = error => ({
  type: UPDATE_DONOR_SETTINGS_FAIL,
  payload: error,
});
