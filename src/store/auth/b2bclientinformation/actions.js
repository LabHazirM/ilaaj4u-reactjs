import {
  GET_TERRITORIES_LIST,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  ADD_B2BCLIENT_INFORMATION,
  ADD_B2BCLIENT_INFORMATION_SUCCESSFUL,
  ADD_B2BCLIENT_INFORMATION_FAILED,
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


export const addB2bClientInformation = (b2bClient, id) => {
  return {
    type: ADD_B2BCLIENT_INFORMATION,
    payload: { b2bClient, id },
  };
};

export const addB2bClientInformationSuccessful = (b2bClient, id) => {
  return {
    type: ADD_B2BCLIENT_INFORMATION_SUCCESSFUL,
    payload: { b2bClient, id },
  };
};

export const addB2bClientInformationFailed = (b2bClient, id) => {
  return {
    type: ADD_B2BCLIENT_INFORMATION_FAILED,
    payload: { b2bClient, id },
  };
};
