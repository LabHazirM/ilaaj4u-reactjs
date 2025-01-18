import {
  GET_ACTIVITY_LOG,
  GET_ACTIVITY_LOG_FAIL,
  GET_ACTIVITY_LOG_SUCCESS,
  GET_CSR_OFFICER_NOTIFICATION,
  GET_CSR_OFFICER_NOTIFICATION_FAIL,
  GET_CSR_OFFICER_NOTIFICATION_SUCCESS,
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

export const getCsrOfficerNotification = (id,previousApiCallTime) => ({
  type: GET_CSR_OFFICER_NOTIFICATION,
  payload: {id,previousApiCallTime},
});

export const getCsrOfficerNotificationSuccess = csrOfficerNotification => ({
  type: GET_CSR_OFFICER_NOTIFICATION_SUCCESS,
  payload: csrOfficerNotification,
});

export const getCsrOfficerNotificationFail = error => ({
  type: GET_CSR_OFFICER_NOTIFICATION_FAIL,
  payload: error,
});


