import {
  GET_LAB_SETTINGS_SUCCESS,
  GET_LAB_SETTINGS_FAIL,
  UPDATE_LAB_SETTINGS_SUCCESS,
  UPDATE_LAB_SETTINGS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  labSettings: [],
  error: "",
  success: "",
};

const labSettings = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LAB_SETTINGS_SUCCESS:
      return {
        ...state,
        success: action.payload.data,
      };

    case GET_LAB_SETTINGS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_LAB_SETTINGS_SUCCESS:
      return {
        ...state,
        labSettings: state.labSettings.map(labSettings =>
          labSettings.id.toString() === action.payload.id.toString()
            ? { labSettings, ...action.payload }
            : labSettings
        ),
      };

    case UPDATE_LAB_SETTINGS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default labSettings;
