import {
  GET_STAFF_PROFILE_SUCCESS,
  GET_STAFF_PROFILE_FAIL,
  UPDATE_STAFF_PROFILE_SUCCESS,
  UPDATE_STAFF_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  staffProfile: [],
  error: "",
  success: "",
};

const staffProfile = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_STAFF_PROFILE_SUCCESS:
      return {
        ...state,
        success: action.payload.data,
      };

    case GET_STAFF_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_STAFF_PROFILE_SUCCESS:
      return {
        ...state,
        staffProfile: state.staffProfile.map(staffProfile =>
          staffProfile.id.toString() === action.payload.id.toString()
            ? { staffProfile, ...action.payload }
            : staffProfile
        ),
      };

    case UPDATE_STAFF_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default staffProfile;
