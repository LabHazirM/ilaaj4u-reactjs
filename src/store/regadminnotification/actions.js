import {
  GET_ACTIVITY_LOG,
  GET_ACTIVITY_LOG_FAIL,
  GET_ACTIVITY_LOG_SUCCESS,
  GET_REG_ADMIN_NOTIFICATION,
  GET_REG_ADMIN_NOTIFICATION_FAIL,
  GET_REG_ADMIN_NOTIFICATION_SUCCESS,
} from "./actionTypes";

// ----------- Pathologist list APIs actions -----------------
export const getActivityLog = id => ({
  type: GET_ACTIVITY_LOG,
  payload: id,
});

export const getActivityLogSuccess = activitylog => ({
  type: GET_ACTIVITY_LOG_SUCCESS,
  payload: activitylog,
});

export const getActivityLogFail = error => ({
  type: GET_ACTIVITY_LOG_FAIL,
  payload: error,
});

export const getRegAdminNotification = (id,previousApiCallTime) => ({
  type: GET_REG_ADMIN_NOTIFICATION,
  payload: {id,previousApiCallTime},
});

export const getRegAdminNotificationSuccess = regAdminNotification => ({
  type: GET_REG_ADMIN_NOTIFICATION_SUCCESS,
  payload: regAdminNotification,
});

export const getRegAdminNotificationFail = error => ({
  type: GET_REG_ADMIN_NOTIFICATION_FAIL,
  payload: error,
});


