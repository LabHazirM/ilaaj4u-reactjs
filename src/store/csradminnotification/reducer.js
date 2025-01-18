import {
  GET_ACTIVITY_LOG_SUCCESS,
  GET_ACTIVITY_LOG_FAIL,
  GET_CSR_ADMIN_NOTIFICATION_SUCCESS,
  GET_CSR_ADMIN_NOTIFICATION_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  activitylog: [],
  csrAdminNotification:[],
  error: {},
};

const csrAdminNotification = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ACTIVITY_LOG_SUCCESS:
      return {
        ...state,
        activitylog: action.payload.data,
      };

    case GET_ACTIVITY_LOG_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_CSR_ADMIN_NOTIFICATION_SUCCESS:
      return {
        ...state,
        csrAdminNotification: [action.payload.data], 
      };

    case GET_CSR_ADMIN_NOTIFICATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default csrAdminNotification;
