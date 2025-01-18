import {
  ADD_CORPORATE_INFORMATION,
  ADD_CORPORATE_INFORMATION_SUCCESSFUL,
  ADD_CORPORATE_INFORMATION_FAILED,
  GET_TERRITORIES_LIST,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
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

export const addCorporateInformation = (corporate, id) => {
  return {
    type: ADD_CORPORATE_INFORMATION,
    payload: { corporate, id },
  };
};

export const addCorporateInformationSuccessful = (corporate, id) => {
  return {
    type: ADD_CORPORATE_INFORMATION_SUCCESSFUL,
    payload: { corporate, id },
  };
};

export const addCorporateInformationFailed = (corporate, id) => {
  return {
    type: ADD_CORPORATE_INFORMATION_FAILED,
    payload: { corporate, id },
  };
};
