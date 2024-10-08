import {
  GET_ASSIGNED_AUDITS,
  GET_ASSIGNED_AUDITS_FAIL,
  GET_ASSIGNED_AUDITS_SUCCESS,
  GET_LAB_AUDITS,
  GET_LAB_AUDITS_FAIL,
  GET_LAB_AUDITS_SUCCESS,
  ADD_NEW_AUDIT,
  ADD_AUDIT_SUCCESS,
  ADD_AUDIT_FAIL,
  GET_AUDITORS_COMPLETED_AUDITS,
  GET_AUDITORS_COMPLETED_AUDITS_FAIL,
  GET_AUDITORS_COMPLETED_AUDITS_SUCCESS,
  UPDATE_ASSIGNED_AUDITS,
  UPDATE_ASSIGNED_AUDITS_SUCCESS,
  UPDATE_ASSIGNED_AUDITS_FAIL,
  UPDATE_AUDITS_STATUS,
  UPDATE_AUDITS_STATUS_SUCCESS,
  UPDATE_AUDITS_STATUS_FAIL,
} from "./actionTypes";

//////////////////////////
export const UpdateAuditStatus = audit => (
  {
  type: UPDATE_AUDITS_STATUS,
  payload: audit,
});

export const UpdateAuditStatusSuccess = audit => ({
  type: UPDATE_AUDITS_STATUS_SUCCESS,
  payload: audit,
});

export const UpdateAuditStatusFail = error => ({
  type: UPDATE_AUDITS_STATUS_FAIL,
  payload: error,
});
// ----------- Staff profile APIs actions -----------------
export const getAssignedAudits = id => ({
  type: GET_ASSIGNED_AUDITS,
  payload: id,
});

export const getAssignedAuditsSuccess = assignedAudits => ({
  type: GET_ASSIGNED_AUDITS_SUCCESS,
  payload: assignedAudits,
});

export const getAssignedAuditsFail = error => ({
  type: GET_ASSIGNED_AUDITS_FAIL,
  payload: error,
});
export const addNewAudit = (audit, id) => (
  {
  type: ADD_NEW_AUDIT,
  payload: { audit, id },
});

export const addAuditSuccess = audit => ({
  type: ADD_AUDIT_SUCCESS,
  payload: audit,
});

export const addAuditFail = error => ({
  type: ADD_AUDIT_FAIL,
  payload: error,
});

export const getLabAudits = id => ({
  type: GET_LAB_AUDITS,
  payload: id,
});

export const getLabAuditsSuccess = labAudits => ({
  type: GET_LAB_AUDITS_SUCCESS,
  payload: labAudits,
});

export const getLabAuditsFail = error => ({
  type: GET_LAB_AUDITS_FAIL,
  payload: error,
});


export const updateAssignedAudits = assignedAudits => ({
  type: UPDATE_ASSIGNED_AUDITS,
  payload: { assignedAudits },
});

export const updateAssignedAuditsSuccess = assignedAudits => ({
  type: UPDATE_ASSIGNED_AUDITS_SUCCESS,
  payload: assignedAudits,
});

export const updateAssignedAuditsFail = error => ({
  type: UPDATE_ASSIGNED_AUDITS_FAIL,
  payload: error,
});

//Completed audits
export const getAuditorsCompletedAudits = id => ({
  type: GET_AUDITORS_COMPLETED_AUDITS,
  payload: id,
});

export const getAuditorsCompletedAuditsSuccess = completedAudits => ({
  type: GET_AUDITORS_COMPLETED_AUDITS_SUCCESS,
  payload: completedAudits,
});

export const getAuditorsCompletedAuditsFail = error => ({
  type: GET_AUDITORS_COMPLETED_AUDITS_FAIL,
  payload: error,
});
