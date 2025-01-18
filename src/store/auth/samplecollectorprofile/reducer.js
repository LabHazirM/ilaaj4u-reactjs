import {
  GET_SAMPLE_COLLECTOR_PROFILE_SUCCESS,
  GET_SAMPLE_COLLECTOR_PROFILE_FAIL,
  UPDATE_SAMPLE_COLLECTOR_PROFILE_SUCCESS,
  UPDATE_SAMPLE_COLLECTOR_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  sampleCollectorProfile: [],
  error: "",
  success: "",
};

const sampleCollectorProfile = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SAMPLE_COLLECTOR_PROFILE_SUCCESS:
      return {
        ...state,
        success: action.payload.data,
      };

    case GET_SAMPLE_COLLECTOR_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };


    case UPDATE_SAMPLE_COLLECTOR_PROFILE_SUCCESS:
      return {
        ...state,
        sampleCollectorProfile: state.sampleCollectorProfile.map(sampleCollectorProfile =>
          sampleCollectorProfile.id.toString() === action.payload.id.toString()
            ? { sampleCollectorProfile, ...action.payload }
            : sampleCollectorProfile
        ),
      };

    case UPDATE_SAMPLE_COLLECTOR_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default sampleCollectorProfile;
