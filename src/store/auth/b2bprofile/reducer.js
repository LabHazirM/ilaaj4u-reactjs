import {
  GET_B2B_PROFILE_SUCCESS,
  GET_B2B_PROFILE_FAIL,
  UPDATE_B2B_PROFILE_SUCCESS,
  UPDATE_B2B_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  b2bProfile: [],
  error: "",
  success: [],
};

const b2bProfile = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_B2B_PROFILE_SUCCESS:
      return {
        ...state,
        success: action.payload.data,
      };

    case GET_B2B_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_B2B_PROFILE_SUCCESS:
      return {
        ...state,
        b2bProfile: state.b2bProfile.map(b2bProfile =>
          b2bProfile.id.toString() === action.payload.id.toString()
            ? { b2bProfile, ...action.payload }
            : b2bProfile
        ),
      };

    case UPDATE_B2B_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default b2bProfile;
