import {
  GET_ACTIVITY_LOG_AUDITOR,
  GET_ACTIVITY_LOG_AUDITOR_FAIL,
  GET_ACTIVITY_LOG_AUDITOR_SUCCESS,
} from "./actionTypes";

// ----------- auditorofficer actions -----------------
export const getActivityLogAuditor = id => ({
  type: GET_ACTIVITY_LOG_AUDITOR,
  payload: id,
});

export const getActivityLogAuditorSuccess = activitylogauditor => ({
  type: GET_ACTIVITY_LOG_AUDITOR_SUCCESS,
  payload: activitylogauditor,
});

export const getActivityLogAuditorFail = error => ({
  type: GET_ACTIVITY_LOG_AUDITOR_FAIL,
  payload: error,
});
