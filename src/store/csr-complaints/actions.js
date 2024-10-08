import {
  GET_CSR_COMPLAINTS,
  GET_CSR_COMPLAINTS_FAIL,
  GET_CSR_COMPLAINTS_SUCCESS,
  UPDATE_CSR_COMPLAINTS,
  UPDATE_CSR_COMPLAINTS_SUCCESS,
  UPDATE_CSR_COMPLAINTS_FAIL,
} from "./actionTypes";


// ----------- Handled Complaints APIs actions -----------------
export const getCsrComplaints = (id, startDate, endDate) => {
  return {
    type: GET_CSR_COMPLAINTS,
    payload: { id, startDate, endDate },
  };
};

export const getCsrComplaintsSuccess = csrComplaints => {
  return {
    type: GET_CSR_COMPLAINTS_SUCCESS,
    payload: csrComplaints,
  };
};

export const getCsrComplaintsFail = error => {
  return {
    type: GET_CSR_COMPLAINTS_FAIL,
    payload: error,
  };
};
export const updateCsrComplaints = csrComplaints => ({
  type: UPDATE_CSR_COMPLAINTS,
  payload: csrComplaints,
});

export const updateCsrComplaintsSuccess = csrComplaints => ({
  type: UPDATE_CSR_COMPLAINTS_SUCCESS,
  payload: csrComplaints,
});

export const updateCsrComplaintsFail = error => ({
  type: UPDATE_CSR_COMPLAINTS_FAIL,
  payload: error,
});
