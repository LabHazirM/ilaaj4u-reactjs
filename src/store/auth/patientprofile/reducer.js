import {
  GET_PATIENT_PROFILE_SUCCESS,
  GET_PATIENT_PROFILE_FAIL,
  UPDATE_PATIENT_PROFILE_SUCCESS,
  UPDATE_PATIENT_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  patientProfile: [],
  error: "",
  success: "",
};

const patientProfile = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PATIENT_PROFILE_SUCCESS:
      return {
        ...state,
        success: action.payload.data,
      };

    case GET_PATIENT_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PATIENT_PROFILE_SUCCESS:
      return {
        ...state,
        patientProfile: state.patientProfile.map(patientProfile =>
          patientProfile.id.toString() === action.payload.id.toString()
            ? { patientProfile, ...action.payload }
            : patientProfile
        ),
      };

    case UPDATE_PATIENT_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default patientProfile;
