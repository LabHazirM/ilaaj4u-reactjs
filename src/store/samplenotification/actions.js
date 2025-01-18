import {
  GET_ACTIVITY_LOG,
  GET_ACTIVITY_LOG_FAIL,
  GET_ACTIVITY_LOG_SUCCESS,
  GET_SAMPLE_NOTIFICATION,
  GET_SAMPLE_NOTIFICATION_FAIL,
  GET_SAMPLE_NOTIFICATION_SUCCESS,
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

export const getSampleNotification = (id,previousApiCallTime) => ({
  type: GET_SAMPLE_NOTIFICATION,
  payload: {id,previousApiCallTime},
});

export const getSampleNotificationSuccess = sampleSampleNotification => ({
  type: GET_SAMPLE_NOTIFICATION_SUCCESS,
  payload: sampleSampleNotification,
});

export const getSampleNotificationFail = error => ({
  type: GET_SAMPLE_NOTIFICATION_FAIL,
  payload: error,
});


