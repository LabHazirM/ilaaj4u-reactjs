import {
  GET_ACTIVITY_LOG,
  GET_ACTIVITY_LOG_FAIL,
  GET_ACTIVITY_LOG_SUCCESS,
  GET_CSR_ADMIN_NOTIFICATION,
  GET_CSR_ADMIN_NOTIFICATION_FAIL,
  GET_CSR_ADMIN_NOTIFICATION_SUCCESS,
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

export const getCsrAdminNotification = (id,previousApiCallTime) => ({
  type: GET_CSR_ADMIN_NOTIFICATION,
  payload: {id,previousApiCallTime},
});

export const getCsrAdminNotificationSuccess = csrAdminNotification => ({
  type: GET_CSR_ADMIN_NOTIFICATION_SUCCESS,
  payload: csrAdminNotification,
});

export const getCsrAdminNotificationFail = error => ({
  type: GET_CSR_ADMIN_NOTIFICATION_FAIL,
  payload: error,
});


