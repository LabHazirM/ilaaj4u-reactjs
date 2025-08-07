import {
  GET_TERRITORIES_LIST,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  ADD_DOCTOR_INFORMATION,
  ADD_DOCTOR_INFORMATION_SUCCESSFUL,
  ADD_DOCTOR_INFORMATION_FAILED,
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


export const addDoctorInformation = (doctor, id) => {
  return {
    type: ADD_DOCTOR_INFORMATION,
    payload: { doctor, id },
  };
};

export const addDoctorInformationSuccessful = (doctor, id) => {
  return {
    type: ADD_DOCTOR_INFORMATION_SUCCESSFUL,
    payload: { doctor, id },
  };
};

export const addDoctorInformationFailed = (doctor, id) => {
  return {
    type: ADD_DOCTOR_INFORMATION_FAILED,
    payload: { doctor, id },
  };
};
