import {
  GET_NEARBY_PACKAGES,
  GET_NEARBY_PACKAGES_FAIL,
  GET_NEARBY_PACKAGES_SUCCESS,
  GET_PACKAGES,
  GET_PACKAGES_FAIL,
  GET_PACKAGES_SUCCESS,
  GET_TERRITORIES_LIST,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  
} from "./actionTypes";

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

export const getNearbyPackages = (search_type, address, id, test_name) => ({
  type: GET_NEARBY_PACKAGES,
  payload: { search_type, address, id, test_name },
});

export const getNearbyPackagesSuccess = nearbyPackages => ({
  type: GET_NEARBY_PACKAGES_SUCCESS,
  payload: nearbyPackages,
});


export const getNearbyPackagesFail = error => ({
  type: GET_NEARBY_PACKAGES_FAIL,
  payload: error,
});

export const getPackages = () => ({
  type: GET_PACKAGES,
  // payload: {},
});

export const getPackagesSuccess = Packages => ({
  type: GET_PACKAGES_SUCCESS,
  payload: Packages,
});

export const getPackagesFail = error => ({
  type: GET_PACKAGES_FAIL,
  payload: error,
});
