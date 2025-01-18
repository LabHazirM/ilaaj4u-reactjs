import {
  GET_PENDING_AUDITS,
  GET_PENDING_AUDITS_SUCCESS,
  GET_PENDING_AUDITS_FAIL,
  GET_INPROCESS_AUDITS,
  GET_INPROCESS_AUDITS_SUCCESS,
  GET_INPROCESS_AUDITS_FAIL,
  GET_PASSED_AUDITS,
  GET_PASSED_AUDITS_SUCCESS,
  GET_PASSED_AUDITS_FAIL,
  GET_FAILED_AUDITS,
  GET_FAILED_AUDITS_SUCCESS,
  GET_FAILED_AUDITS_FAIL,
  ASSIGN_AUDIT,
  ASSIGN_AUDIT_SUCCESS,
  ASSIGN_AUDIT_FAIL,
  ADD_LABS_AUDIT,
  ADD_LABS_AUDIT_SUCCESS,
  ADD_LABS_AUDIT_FAIL
} from "./actionTypes";

export const getPendingAudits = () => ({
  type: GET_PENDING_AUDITS,
  payload: {},
});

export const getPendingAuditsSuccess = pendingAudits => ({
  type: GET_PENDING_AUDITS_SUCCESS,
  payload: pendingAudits,
});

export const getPendingAuditsFail = error => ({
  type: GET_PENDING_AUDITS_FAIL,
  payload: error,
});

export const getInProcessAudits = () => ({
  type: GET_INPROCESS_AUDITS,
  payload: {},
});

export const getInProcessAuditsSuccess = inProcessAudits => ({
  type: GET_INPROCESS_AUDITS_SUCCESS,
  payload: inProcessAudits,
});

export const getInProcessAuditsFail = error => ({
  type: GET_INPROCESS_AUDITS_FAIL,
  payload: error,
});

export const getPassedAudits = () => ({
  type: GET_PASSED_AUDITS,
  payload: {},
});

export const getPassedAuditsSuccess = passedAudits => ({
  type: GET_PASSED_AUDITS_SUCCESS,
  payload: passedAudits,
});

export const getPassedAuditsFail = error => ({
  type: GET_PASSED_AUDITS_FAIL,
  payload: error,
});
export const getFailedAudits = () => ({
  type: GET_FAILED_AUDITS,
  payload: {},
});

export const getFailedAuditsSuccess = failedAudits => ({
  type: GET_FAILED_AUDITS_SUCCESS,
  payload: failedAudits,
});

export const getFailedAuditsFail = error => ({
  type: GET_FAILED_AUDITS_FAIL,
  payload: error,
});
export const assignAudit = data => ({
  type: ASSIGN_AUDIT,
  payload: { data },
});

export const assignAuditSuccess = success => ({
  type: ASSIGN_AUDIT_SUCCESS,
  payload: success,
});

export const assignAuditFail = error => ({
  type: ASSIGN_AUDIT_FAIL,
  payload: error,
});

export const AddAllLabsAudit = data => ({
  type: ADD_LABS_AUDIT,
  payload: { data },
});

export const AddAllLabsAuditSuccess = success => ({
  type: ADD_LABS_AUDIT_SUCCESS,
  payload: success,
});

export const AddAllLabsAuditFail = error => ({
  type: ADD_LABS_AUDIT_FAIL,
  payload: error,
});
