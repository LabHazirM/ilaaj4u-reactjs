import {
  GET_DONOR_PROFILE_SUCCESS,
  GET_DONOR_PROFILE_FAIL,
  UPDATE_DONOR_PROFILE_SUCCESS,
  UPDATE_DONOR_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  donorProfile: [],
  error: "",
  success: [],
};

const donorProfile = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DONOR_PROFILE_SUCCESS:
      console.log("Data: ", action.payload.data);
      return {
        ...state,
        success: action.payload.data,
      };

    case GET_DONOR_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DONOR_PROFILE_SUCCESS:
      return {
        ...state,
        donorProfile: state.donorProfile.map(donorProfile =>
          donorProfile.id.toString() === action.payload.id.toString()
            ? { donorProfile, ...action.payload }
            : donorProfile
        ),
      };

    case UPDATE_DONOR_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default donorProfile;
