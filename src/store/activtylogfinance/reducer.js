import {
  GET_ACTIVITY_LOG_FINANCE_SUCCESS,
  GET_ACTIVITY_LOG_FINANCE_FAIL,
  GET_CORPORATE_COMMIT_SUCCESS,
  GET_CORPORATE_COMMIT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  activitylogfinance: [],
  error: {},
};

const activitylogfinance = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ACTIVITY_LOG_FINANCE_SUCCESS:
      return {
        ...state,
        activitylogfinance: action.payload.data,
      };

    case GET_ACTIVITY_LOG_FINANCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_CORPORATE_COMMIT_SUCCESS:
      return {
        ...state,
        activitylogfinance: action.payload.data,
      };

    case GET_CORPORATE_COMMIT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default activitylogfinance;
