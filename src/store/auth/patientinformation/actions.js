import {
  GET_TERRITORIES_LIST,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  GET_CORPORATES_LIST,
  GET_CORPORATES_LIST_SUCCESS,
  GET_CORPORATES_LIST_FAIL,
  ADD_PATIENT_INFORMATION,
  ADD_PATIENT_INFORMATION_SUCCESSFUL,
  ADD_PATIENT_INFORMATION_FAILED,
} from "./actionTypes"

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

// Corporates
export const getCorporatesList = () => ({
  type: GET_CORPORATES_LIST,
  payload: {},
});


export const getCorporatesListSuccess =
  territories => ({
    type: GET_CORPORATES_LIST_SUCCESS,
    payload: territories,
  });

export const getCorporatesListFail = error => ({
  type: GET_CORPORATES_LIST_FAIL,
  payload: error,
});

export const addPatientInformation = (patient, id) => {
  return {
    type: ADD_PATIENT_INFORMATION,
    payload: { patient, id },
  }
}

export const addPatientInformationSuccessful = (patient, id) => {
  return {
    type: ADD_PATIENT_INFORMATION_SUCCESSFUL,
    payload: { patient, id },
  }
}

export const addPatientInformationFailed = (patient, id) => {
  return {
    type: ADD_PATIENT_INFORMATION_FAILED,
    payload: { patient, id },
  }
}
