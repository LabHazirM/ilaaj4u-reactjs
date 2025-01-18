import {
  GET_LAB_NAMES_LIST,
  GET_LAB_NAMES_LIST_SUCCESS,
  GET_LAB_NAMES_LIST_FAIL,
} from "./actionTypes";

export const getLabNamesList = () => ({
  type: GET_LAB_NAMES_LIST,
  payload: {},
});

export const getLabNamesListSuccess = labNamesList => ({
    type: GET_LAB_NAMES_LIST_SUCCESS,
    payload: labNamesList,
  });

export const getLabNamesListFail = error => ({
  type: GET_LAB_NAMES_LIST_FAIL,
  payload: error,
});
