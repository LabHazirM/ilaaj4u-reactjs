import {
  ADD_NEW_CEMPLOYEE_DATA,
  ADD_CEMPLOYEE_DATA_SUCCESS,
  ADD_CEMPLOYEE_DATA_FAIL,
  ADD_NEW_CEMPLOYEE_FILE,
  ADD_CEMPLOYEE_FILE_SUCCESS,
  ADD_CEMPLOYEE_FILE_FAIL,
  GET_LABCORPORATE,
  GET_LABCORPORATE_SUCCESS,
  GET_LABCORPORATE_FAIL,
  GET_ALABCORPORATE,
  GET_ALABCORPORATE_SUCCESS,
  GET_ALABCORPORATE_FAIL,
  GET_ACORPORATE,
  GET_ACORPORATE_SUCCESS,
  GET_ACORPORATE_FAIL,
  GET_RFEECORPORATE,
  GET_RFEECORPORATE_SUCCESS,
  GET_RFEECORPORATE_FAIL,
  GET_EMPLOYEECORPORATE,
  GET_EMPLOYEECORPORATE_SUCCESS,
  GET_EMPLOYEECORPORATE_FAIL,
  GET_LABSCORPORATE,
  GET_LABSCORPORATE_SUCCESS,
  GET_LABSCORPORATE_FAIL,
  UPDATE_CEMPLOYEE,
  UPDATE_CEMPLOYEE_SUCCESS,
  UPDATE_CEMPLOYEE_FAIL,
  DELETE_CEDATA,
  DELETE_CEDATA_SUCCESS,
  DELETE_CEDATA_FAIL,
} from "./actionTypes";

export const getALabCorporate = id => ({
  type: GET_ALABCORPORATE,
  payload: id,
});

export const getALabCorporateSuccess = cemployeeData => ({
  type: GET_ALABCORPORATE_SUCCESS,
  payload: cemployeeData,
});

export const getALabCorporateFail = error => ({
  type: GET_ALABCORPORATE_FAIL,
  payload: error,
});
export const getACorporate = () => ({
  type: GET_ACORPORATE,
  // payload: id,
});

export const getACorporateSuccess = cemployeeData => ({
  type: GET_ACORPORATE_SUCCESS,
  payload: cemployeeData,
});

export const getACorporateFail = error => ({
  type: GET_ACORPORATE_FAIL,
  payload: error,
});
export const getRFeeCorporate = () => ({
  type: GET_RFEECORPORATE,
  // payload: id,
});

export const getRFeeCorporateSuccess = cemployeeData => ({
  type: GET_RFEECORPORATE_SUCCESS,
  payload: cemployeeData,
});

export const getRFeeCorporateFail = error => ({
  type: GET_RFEECORPORATE_FAIL,
  payload: error,
});
export const getLabCorporate = id => ({
  type: GET_LABCORPORATE,
  payload: id,
});

export const getLabCorporateSuccess = cemployeeData => ({
  type: GET_LABCORPORATE_SUCCESS,
  payload: cemployeeData,
});

export const getLabCorporateFail = error => ({
  type: GET_LABCORPORATE_FAIL,
  payload: error,
});
export const getEmployeeCorporate = id => ({
  type: GET_EMPLOYEECORPORATE,
  payload: id,
});

export const getEmployeeCorporateSuccess = cemployeeData => ({
  type: GET_EMPLOYEECORPORATE_SUCCESS,
  payload: cemployeeData,
});

export const getEmployeeCorporateFail = error => ({
  type: GET_EMPLOYEECORPORATE_FAIL,
  payload: error,
});

export const getLabsCorporate = id => ({
  type: GET_LABSCORPORATE,
  payload: id,
});

export const getLabsCorporateSuccess = cemployeeData => ({
  type: GET_LABSCORPORATE_SUCCESS,
  payload: cemployeeData,
});

export const getLabsCorporateFail = error => ({
  type: GET_LABSCORPORATE_FAIL,
  payload: error,
});

export const addNewCemployeeData = (cemployeeData, id) => ({
  type: ADD_NEW_CEMPLOYEE_DATA,
  payload: { cemployeeData, id },
});

export const addCemployeeDataSuccess = cemployeeData => ({
  type: ADD_CEMPLOYEE_DATA_SUCCESS,
  payload: cemployeeData,
});

export const addCemployeeDataFail = error => ({
  type: ADD_CEMPLOYEE_DATA_FAIL,
  payload: error,
});
export const addNewCemployeefile = (cemployeeData) => (
  console.log("data file", cemployeeData),
  {
  type: ADD_NEW_CEMPLOYEE_FILE,
  payload: { cemployeeData},
});

export const addCemployeefileSuccess = cemployeeData => ({
  type: ADD_CEMPLOYEE_FILE_SUCCESS,
  payload: cemployeeData,
});

export const addCemployeefileFail = error => (
  console.log("data file error", cemployeeData),
  {
  type: ADD_CEMPLOYEE_FILE_FAIL,
  payload: error,
});
export const updateCemployee = cemployee => ({
  type: UPDATE_CEMPLOYEE,
  payload: cemployee,
});

export const updateCemployeeSuccess = cemployee => ({
  type: UPDATE_CEMPLOYEE_SUCCESS,
  payload: cemployee,
});

export const updateCemployeeFail = error => ({
  type: UPDATE_CEMPLOYEE_FAIL,
  payload: error,
});
export const deletecedata = cemployee => ({
  type: DELETE_CEDATA,
  payload: cemployee,
});

export const deletecedataSuccess = cemployee => ({
  type: DELETE_CEDATA_SUCCESS,
  payload: cemployee,
});

export const deletecedataFail = error => ({
  type: DELETE_CEDATA_FAIL,
  payload: error,
});