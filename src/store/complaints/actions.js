import {
  ADD_NEW_COMPLAINT,
  ADD_COMPLAINT_SUCCESS,
  ADD_COMPLAINT_FAIL,
  GET_LABS,
  GET_LABS_SUCCESS,
  GET_LABS_FAIL,
  GET_HANDLED_COMPLAINTS,
  GET_HANDLED_COMPLAINTS_FAIL,
  GET_HANDLED_COMPLAINTS_SUCCESS,
  GET_UNHANDLED_COMPLAINTS,
  GET_UNHANDLED_COMPLAINTS_FAIL,
  GET_UNHANDLED_COMPLAINTS_SUCCESS,
  UPDATE_UNHANDLED_COMPLAINTS,
  UPDATE_UNHANDLED_COMPLAINTS_SUCCESS,
  UPDATE_UNHANDLED_COMPLAINTS_FAIL,
} from "./actionTypes";

export const addNewComplaint = complaint => ({
  type: ADD_NEW_COMPLAINT,
  payload: { complaint },
});

export const addComplaintSuccess = complaint => ({
  type: ADD_COMPLAINT_SUCCESS,
  payload: complaint,
});

export const addComplaintFail = error => ({
  type: ADD_COMPLAINT_FAIL,
  payload: error,
});
export const getLabs = () => ({
  type: GET_LABS,
});

export const getLabsSuccess = labs => ({
  type: GET_LABS_SUCCESS,
  payload: labs,
});

export const getLabsFail = error => ({
  type: GET_LABS_FAIL,
  payload: error,
});
// ----------- Handled Complaints APIs actions -----------------
export const getHandledComplaints = id => ({
  type: GET_HANDLED_COMPLAINTS,
  payload: id,
});

export const getHandledComplaintsSuccess = handledComplaints => ({
  type: GET_HANDLED_COMPLAINTS_SUCCESS,
  payload: handledComplaints,
});

export const getHandledComplaintsFail = error => ({
  type: GET_HANDLED_COMPLAINTS_FAIL,
  payload: error,
});

// ----------- Unhandled Complaints APIs actions -----------------
export const getUnhandledComplaints = id => ({
  type: GET_UNHANDLED_COMPLAINTS,
  payload: id,
});

export const getUnhandledComplaintsSuccess = unhandledComplaints => (
  console.log("unhandledComplaints: ", unhandledComplaints),
  {
    type: GET_UNHANDLED_COMPLAINTS_SUCCESS,
    payload: unhandledComplaints,
  }
);

export const getUnhandledComplaintsFail = error => ({
  type: GET_UNHANDLED_COMPLAINTS_FAIL,
  payload: error,
});

export const updateUnhandledComplaints = unhandledComplaints => ({
  type: UPDATE_UNHANDLED_COMPLAINTS,
  payload: { unhandledComplaints }
});

export const updateUnhandledComplaintsSuccess = unhandledComplaints => ({
  type: UPDATE_UNHANDLED_COMPLAINTS_SUCCESS,
  payload: unhandledComplaints,
});

export const updateUnhandledComplaintsFail = error => ({
  type: UPDATE_UNHANDLED_COMPLAINTS_FAIL,
  payload: error,
});
