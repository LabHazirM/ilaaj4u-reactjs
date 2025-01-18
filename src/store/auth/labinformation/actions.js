import {
  GET_TERRITORIES_LIST,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  GET_MAIN_LABS,
  GET_MAIN_LABS_SUCCESS,
  GET_MAIN_LABS_FAIL,
  ADD_LAB_INFORMATION,
  ADD_LAB_INFORMATION_SUCCESSFUL,
  ADD_LAB_INFORMATION_FAILED,
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
// lab info
export const getMainLabs = () => ({
  type: GET_MAIN_LABS,
});

export const getMainLabsSuccess = labs => ({
  type: GET_MAIN_LABS_SUCCESS,
  payload: labs,
});

export const getMainLabsFail = error => ({
  type: GET_MAIN_LABS_FAIL,
  payload: error,
});

export const addLabInformation = (lab, id) => {
  return {
    type: ADD_LAB_INFORMATION,
    payload: { lab, id },
  };
};

export const addLabInformationSuccessful = (lab, id) => {
  return {
    type: ADD_LAB_INFORMATION_SUCCESSFUL,
    payload: { lab, id },
  };
};

export const addLabInformationFailed = (lab, id) => {
  return {
    type: ADD_LAB_INFORMATION_FAILED,
    payload: { lab, id },
  };
};

