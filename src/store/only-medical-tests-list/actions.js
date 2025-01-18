import {
  GET_ONLY_MEDICAL_LIST,
  GET_ONLY_MEDICAL_LIST_SUCCESS,
  GET_ONLY_MEDICAL_LIST_FAIL,
  GET_TERRITORIES_LIST,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
} from "./actionTypes";

export const onlyMedicalTestList = () => ({
  type: GET_ONLY_MEDICAL_LIST,
  payload: {},
});

export const onlyMedicalTestListSuccess = onlyMedicalTestList => ({
    type: GET_ONLY_MEDICAL_LIST_SUCCESS,
    payload: onlyMedicalTestList,
  });

export const onlyMedicalTestListFail = error => ({
  type: GET_ONLY_MEDICAL_LIST_FAIL,
  payload: error,
});
export const getTerritoriesList = () => ({
  type: GET_TERRITORIES_LIST,
  payload: {},
});

export const getTerritoriesListSuccess = territoriesList => ({
    type: GET_TERRITORIES_LIST_SUCCESS,
    payload: territoriesList,
  });

export const getTerritoriesListFail = error => ({
  type: GET_TERRITORIES_LIST_FAIL,
  payload: error,
});