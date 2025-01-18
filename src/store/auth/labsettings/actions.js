import {
  GET_LAB_SETTINGS,
  GET_LAB_SETTINGS_FAIL,
  GET_LAB_SETTINGS_SUCCESS,
  UPDATE_LAB_SETTINGS,
  UPDATE_LAB_SETTINGS_SUCCESS,
  UPDATE_LAB_SETTINGS_FAIL,
} from "./actionTypes";

// ----------- Lab settings APIs actions -----------------
export const getLabSettings = id => ({
  type: GET_LAB_SETTINGS,
  payload: id,
});

export const getLabSettingsSuccess = labSettings => ({
  type: GET_LAB_SETTINGS_SUCCESS,
  payload: labSettings,
});

export const getLabSettingsFail = error => ({
  type: GET_LAB_SETTINGS_FAIL,
  payload: error,
});

export const updateLabSettings = (labSettings, id) => ({
  type: UPDATE_LAB_SETTINGS,
  payload: { labSettings, id },
});

export const updateLabSettingsSuccess = labSettings => ({
  type: UPDATE_LAB_SETTINGS_SUCCESS,
  payload: labSettings,
});

export const updateLabSettingsFail = error => ({
  type: UPDATE_LAB_SETTINGS_FAIL,
  payload: error,
});
