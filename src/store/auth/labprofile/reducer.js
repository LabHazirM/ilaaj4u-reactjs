import {
  GET_LAB_PROFILE_SUCCESS,
  GET_LAB_PROFILE_FAIL,
  UPDATE_LAB_PROFILE_SUCCESS,
  UPDATE_LAB_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  labProfile: [],
  error: "",
  success: "",
};

const labProfile = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LAB_PROFILE_SUCCESS:
      return {
        ...state,
        success: action.payload.data,
      };

    case GET_LAB_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_LAB_PROFILE_SUCCESS:
      return {
        ...state,
        labProfile: state.labProfile.map(labProfile =>
          labProfile.id.toString() === action.payload.id.toString()
            ? { labProfile, ...action.payload }
            : labProfile
        ),
      };

    case UPDATE_LAB_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default labProfile;
