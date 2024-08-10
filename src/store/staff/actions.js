import {
  GET_CSR_LIST,
  GET_CSR_LIST_SUCCESS,
  GET_CSR_LIST_FAIL,
  GET_AUDITOR_LIST,
  GET_AUDITOR_LIST_SUCCESS,
  GET_AUDITOR_LIST_FAIL,
  GET_FINANCE_OFFICER_LIST,
  GET_FINANCE_OFFICER_LIST_SUCCESS,
  GET_FINANCE_OFFICER_LIST_FAIL,
  ADD_STAFF,
  ADD_STAFF_SUCCESS,
  UPDATE_STAFF,
  UPDATE_STAFF_SUCCESS,
  UPDATE_STAFF_FAIL,
  DELETE_STAFF,
  DELETE_STAFF_SUCCESS,
  DELETE_STAFF_FAIL,
  GET_TERRITORIES_LIST,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  ADD_STAFF_FAIL,

  GET_MARKETERS_LIST,
  GET_MARKETERS_LIST_SUCCESS,
  GET_MARKETERS_LIST_FAIL,
} from "./actionTypes";

// Territories
export const getTerritoriesList = () => ({
  type: GET_TERRITORIES_LIST,
  payload: {},
});


export const getTerritoriesListSuccess =
  territories => ({
    type: GET_TERRITORIES_LIST_SUCCESS,
    payload: territories,
  });

export const getTerritoriesListFail = error => ({
  type: GET_TERRITORIES_LIST_FAIL,
  payload: error,
});
export const getCSRList = () => ({
  type: GET_CSR_LIST,
  payload: {},
});

export const getCSRListSuccess = csrList => ({
  type: GET_CSR_LIST_SUCCESS,
  payload: csrList,
});

export const getCSRListFail = error => ({
  type: GET_CSR_LIST_FAIL,
  payload: error,
});

export const getMarketersList = () => ({
  type: GET_MARKETERS_LIST,
  payload: {},
});

export const getMarketersListSuccess = marketersList => ({
  type: GET_MARKETERS_LIST_SUCCESS,
  payload: marketersList,
});

export const getMarketersListFail = error => ({
  type: GET_MARKETERS_LIST_FAIL,
  payload: error,
});
export const getAuditorList = () => ({
  type: GET_AUDITOR_LIST,
  payload: {},
});

export const getAuditorListSuccess = auditorList => ({
  type: GET_AUDITOR_LIST_SUCCESS,
  payload: auditorList,
});

export const getAuditorListFail = error => ({
  type: GET_AUDITOR_LIST_FAIL,
  payload: error,
});

export const getFinanceOfficerList = () => ({
  type: GET_FINANCE_OFFICER_LIST,
  payload: {},
});

export const getFinanceOfficerListSuccess = financeOfficerList => ({
  type: GET_FINANCE_OFFICER_LIST_SUCCESS,
  payload: financeOfficerList,
});

export const getFinanceOfficerListFail = error => ({
  type: GET_FINANCE_OFFICER_LIST_FAIL,
  payload: error,
});

export const addStaff = (staff, id) => ({
  type: ADD_STAFF,
  payload: { staff, id },
});

export const addStaffSuccess = (staff, id) => ({
  type: ADD_STAFF_SUCCESS,
  payload: { staff, id },
});

export const addStaffFail = (staff, id) => ({
  type: ADD_STAFF_FAIL,
  payload: { staff, id },
});

export const updateStaff = staff => ({
  type: UPDATE_STAFF,
  payload: staff,
});

export const updateStaffSuccess = staff => ({
  type: UPDATE_STAFF_SUCCESS,
  payload: staff,
});

export const updateStaffFail = error => ({
  type: UPDATE_STAFF_FAIL,
  payload: error,
});

export const deleteStaff = staff => ({
  type: DELETE_STAFF,
  payload: staff,
});

export const deleteStaffSuccess = staff => ({
  type: DELETE_STAFF_SUCCESS,
  payload: staff,
});

export const deleteStaffFail = error => ({
  type: DELETE_STAFF_FAIL,
  payload: error,
});
