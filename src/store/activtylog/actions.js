import {
  GET_ACTIVITY_LOG,
  GET_ACTIVITY_LOG_FAIL,
  GET_ACTIVITY_LOG_SUCCESS,
  GET_NOTIFICATION,
  GET_NOTIFICATION_FAIL,
  GET_NOTIFICATION_SUCCESS,
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

export const getNotification = (id,previousApiCallTime) => ({
  type: GET_NOTIFICATION,
  payload: {id,previousApiCallTime},
});

export const getNotificationSuccess = notification => ({
  type: GET_NOTIFICATION_SUCCESS,
  payload: notification,
});

export const getNotificationFail = error => ({
  type: GET_NOTIFICATION_FAIL,
  payload: error,
});


