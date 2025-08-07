import {
  GET_DOCTOR_PROFILE_SUCCESS,
  GET_DOCTOR_PROFILE_FAIL,
  UPDATE_DOCTOR_PROFILE_SUCCESS,
  UPDATE_DOCTOR_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  doctorProfile: [],
  error: "",
  success: [],
};

const doctorProfile = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DOCTOR_PROFILE_SUCCESS:
      console.log("Data: ", action.payload.data);
      return {
        ...state,
        success: action.payload.data,
      };

    case GET_DOCTOR_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DOCTOR_PROFILE_SUCCESS:
      return {
        ...state,
        doctorProfile: state.doctorProfile.map(doctorProfile =>
          doctorProfile.id.toString() === action.payload.id.toString()
            ? { doctorProfile, ...action.payload }
            : doctorProfile
        ),
      };

    case UPDATE_DOCTOR_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default doctorProfile;
