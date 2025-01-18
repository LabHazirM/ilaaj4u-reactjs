import {
  GET_PENDING_COMPLAINTS,
  GET_PENDING_COMPLAINTS_SUCCESS,
  GET_PENDING_COMPLAINTS_FAIL,
  GET_PENDING_COMPLAINTS_LABHAZIR,
  GET_PENDING_COMPLAINTS_LABHAZIR_SUCCESS,
  GET_PENDING_COMPLAINTS_LABHAZIR_FAIL,
  GET_INPROCESS_COMPLAINTS,
  GET_INPROCESS_COMPLAINTS_SUCCESS,
  GET_INPROCESS_COMPLAINTS_FAIL,
  GET_INPROCESS_COMPLAINTS_LABHAZIR,
  GET_INPROCESS_COMPLAINTS_LABHAZIR_SUCCESS,
  GET_INPROCESS_COMPLAINTS_LABHAZIR_FAIL,
  GET_RESOLVED_COMPLAINTS,
  GET_RESOLVED_COMPLAINTS_SUCCESS,
  GET_RESOLVED_COMPLAINTS_FAIL,
  GET_RESOLVED_COMPLAINTS_LABHAZIR,
  GET_RESOLVED_COMPLAINTS_LABHAZIR_SUCCESS,
  GET_RESOLVED_COMPLAINTS_LABHAZIR_FAIL,
  ASSIGN_COMPLAINT,
  ASSIGN_COMPLAINT_SUCCESS,
  ASSIGN_COMPLAINT_FAIL,
  
} from "./actionTypes";

export const getPendingComplaints = () => ({
  type: GET_PENDING_COMPLAINTS,
  payload: {},
});

export const getPendingComplaintsSuccess = pendingComplaints => ({
  type: GET_PENDING_COMPLAINTS_SUCCESS,
  payload: pendingComplaints,
});

export const getPendingComplaintsFail = error => ({
  type: GET_PENDING_COMPLAINTS_FAIL,
  payload: error,
});
export const getPendingComplaintsLabhazir = () => ({
  type: GET_PENDING_COMPLAINTS_LABHAZIR,
  payload: {},
});

export const getPendingComplaintsLabhazirSuccess = pendingComplaintsLabhazir => ({
  type: GET_PENDING_COMPLAINTS_LABHAZIR_SUCCESS,
  payload: pendingComplaintsLabhazir,
});

export const getPendingComplaintsLabhazirFail = error => ({
  type: GET_PENDING_COMPLAINTS_LABHAZIR_FAIL,
  payload: error,
});
export const getInProcessComplaints = () => ({
  type: GET_INPROCESS_COMPLAINTS,
  payload: {},
});

export const getInProcessComplaintsSuccess = inProcessComplaints => ({
  type: GET_INPROCESS_COMPLAINTS_SUCCESS,
  payload: inProcessComplaints,
});

export const getInProcessComplaintsFail = error => ({
  type: GET_INPROCESS_COMPLAINTS_FAIL,
  payload: error,
});
export const getInProcessComplaintsLabhazir = () => ({
  type: GET_INPROCESS_COMPLAINTS_LABHAZIR,
  payload: {},
});

export const getInProcessComplaintsLabhazirSuccess = inProcessComplaintsLabhazir => ({
  type: GET_INPROCESS_COMPLAINTS_LABHAZIR_SUCCESS,
  payload: inProcessComplaintsLabhazir,
});

export const getInProcessComplaintsLabhazirFail = error => ({
  type: GET_INPROCESS_COMPLAINTS_LABHAZIR_FAIL,
  payload: error,
});

export const getResolvedComplaints = () => ({
  type: GET_RESOLVED_COMPLAINTS,
  payload: {},
});

export const getResolvedComplaintsSuccess = resolvedComplaints => ({
  type: GET_RESOLVED_COMPLAINTS_SUCCESS,
  payload: resolvedComplaints,
});

export const getResolvedComplaintsFail = error => ({
  type: GET_RESOLVED_COMPLAINTS_FAIL,
  payload: error,
});

export const getResolvedComplaintsLabhazir = () => ({
  type: GET_RESOLVED_COMPLAINTS_LABHAZIR,
  payload: {},
});

export const getResolvedComplaintsLabhazirSuccess = resolvedComplaintsLabhazir => ({
  type: GET_RESOLVED_COMPLAINTS_LABHAZIR_SUCCESS,
  payload: resolvedComplaintsLabhazir,
});

export const getResolvedComplaintsLabhazirFail = error => ({
  type: GET_RESOLVED_COMPLAINTS_LABHAZIR_FAIL,
  payload: error,
});
export const assignComplaint = data => ({
  type: ASSIGN_COMPLAINT,
  payload: { data },
});

export const assignComplaintSuccess = success => ({
  type: ASSIGN_COMPLAINT_SUCCESS,
  payload: success,
});

export const assignComplaintFail = error => ({
  type: ASSIGN_COMPLAINT_FAIL,
  payload: error,
});
