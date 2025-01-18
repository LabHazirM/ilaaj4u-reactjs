import {
  GET_FEEDBACKS_SUCCESS,
  GET_FEEDBACKS_FAIL,
  GET_LAB_PROFILE_SUCCESS,
  GET_LAB_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  feedbacks: [],
  labProfile: [],
  error: {},
};

const feedbacks = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_FEEDBACKS_SUCCESS:
      return {
        ...state,
        feedbacks: action.payload,
      };

    case GET_FEEDBACKS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_LAB_PROFILE_SUCCESS:
        return {
          ...state,
          labProfile: action.payload.data,
        };
  
      case GET_LAB_PROFILE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    default:
      return state;
  }
};

export default feedbacks;
