import {
  GET_TERRITORIES_LIST,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  ADD_DONOR_INFORMATION,
  ADD_DONOR_INFORMATION_SUCCESSFUL,
  ADD_DONOR_INFORMATION_FAILED,
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
export const addDonorInformation = (donor, id) => {
  return {
    type: ADD_DONOR_INFORMATION,
    payload: { donor, id },
  }
}

export const addDonorInformationSuccessful = (donor, id) => {
  return {
    type: ADD_DONOR_INFORMATION_SUCCESSFUL,
    payload: { donor, id },
  }
}

export const addDonorInformationFailed = (donor, id) => {
  return {
    type: ADD_DONOR_INFORMATION_FAILED,
    payload: { donor, id },
  }
}
