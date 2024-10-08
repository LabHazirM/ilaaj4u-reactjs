import {
  GET_ACTIVITY_LOG_AUDITOR_SUCCESS,
  GET_ACTIVITY_LOG_AUDITOR_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  activitylogauditor: [],
  error: {},
};

const activitylogauditor = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ACTIVITY_LOG_AUDITOR_SUCCESS:
      return {
        ...state,
        activitylogauditor: action.payload.data,
      };

    case GET_ACTIVITY_LOG_AUDITOR_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    
    default:
      return state;
  }
};

export default activitylogauditor;
