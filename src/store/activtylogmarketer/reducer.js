import {
  GET_ACTIVITY_LOG_MARKETER_SUCCESS,
  GET_ACTIVITY_LOG_MARKETER_FAIL,
  GET_LAB_ACTIVITY_LOG_MARKETER_SUCCESS,
  GET_LAB_ACTIVITY_LOG_MARKETER_FAIL
} from "./actionTypes";

const INIT_STATE = {
  activitylogmarketer: [],
  error: {},
};

const activitylogmarketer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ACTIVITY_LOG_MARKETER_SUCCESS:
      return {
        ...state,
        activitylogmarketer: action.payload.data,
      };

    case GET_ACTIVITY_LOG_MARKETER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_LAB_ACTIVITY_LOG_MARKETER_SUCCESS:
      return {
        ...state,
        activitylogmarketer: action.payload.data,
      };

    case GET_LAB_ACTIVITY_LOG_MARKETER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default activitylogmarketer;
