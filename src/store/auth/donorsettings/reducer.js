import {
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  GET_DONOR_SETTINGS_SUCCESS,
  GET_DONOR_SETTINGS_FAIL,
  UPDATE_DONOR_SETTINGS_SUCCESS,
  UPDATE_DONOR_SETTINGS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  territoriesList: [],
  donorSettings: [],
  error: "",
  success: "",
};

const donorSettings = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_TERRITORIES_LIST_SUCCESS:
      return {
        ...state,
        territoriesList: action.payload.data,
      };

    case GET_TERRITORIES_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      
    case GET_DONOR_SETTINGS_SUCCESS:
      return {
        ...state,
        success: action.payload.data,
      };

    case GET_DONOR_SETTINGS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DONOR_SETTINGS_SUCCESS:
      return {
        ...state,
        donorSettings: state.donorSettings.map(donorSettings =>
          donorSettings.id.toString() === action.payload.id.toString()
            ? { donorSettings, ...action.payload }
            : donorSettings
        ),
      };

    case UPDATE_DONOR_SETTINGS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default donorSettings;
