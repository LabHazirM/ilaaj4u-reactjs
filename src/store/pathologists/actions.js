import {
  GET_PATHOLOGISTS,
  GET_PATHOLOGISTS_FAIL,
  GET_PATHOLOGISTS_SUCCESS,
  ADD_NEW_PATHOLOGIST,
  ADD_PATHOLOGIST_SUCCESS,
  ADD_PATHOLOGIST_FAIL,
  UPDATE_PATHOLOGIST,
  UPDATE_PATHOLOGIST_SUCCESS,
  UPDATE_PATHOLOGIST_FAIL,
  DELETE_PATHOLOGIST,
  DELETE_PATHOLOGIST_SUCCESS,
  DELETE_PATHOLOGIST_FAIL,
} from "./actionTypes";

// ----------- Pathologist list APIs actions -----------------
export const getPathologists = id => ({
  type: GET_PATHOLOGISTS,
  payload: id,
});

export const getPathologistsSuccess = pathologists => ({
  type: GET_PATHOLOGISTS_SUCCESS,
  payload: pathologists,
});

export const getPathologistsFail = error => ({
  type: GET_PATHOLOGISTS_FAIL,
  payload: error,
});

export const addNewPathologist = (pathologist, id) => ({
  type: ADD_NEW_PATHOLOGIST,
  payload: { pathologist, id },
});

export const addPathologistSuccess = pathologist => ({
  type: ADD_PATHOLOGIST_SUCCESS,
  payload: pathologist,
});

export const addPathologistFail = error => ({
  type: ADD_PATHOLOGIST_FAIL,
  payload: error,
});

export const updatePathologist = pathologist => ({
  type: UPDATE_PATHOLOGIST,
  payload: pathologist,
});

export const updatePathologistSuccess = pathologist => ({
  type: UPDATE_PATHOLOGIST_SUCCESS,
  payload: pathologist,
});

export const updatePathologistFail = error => ({
  type: UPDATE_PATHOLOGIST_FAIL,
  payload: error,
});

export const deletePathologist = pathologist => ({
  type: DELETE_PATHOLOGIST,
  payload: pathologist,
});

export const deletePathologistSuccess = pathologist => ({
  type: DELETE_PATHOLOGIST_SUCCESS,
  payload: pathologist,
});

export const deletePathologistFail = error => ({
  type: DELETE_PATHOLOGIST_FAIL,
  payload: error,
});
