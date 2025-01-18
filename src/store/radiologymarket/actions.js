import {
  GET_NEARBY_RADIOLOGY,
  GET_NEARBY_RADIOLOGY_FAIL,
  GET_NEARBY_RADIOLOGY_SUCCESS,
  GET_RADIOLOGY,
  GET_RADIOLOGY_FAIL,
  GET_RADIOLOGY_SUCCESS,
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

export const getNearbyRadiology = (search_type, address, id, test_name) => ({
  type: GET_NEARBY_RADIOLOGY,
  payload: { search_type, address, id, test_name },
});

export const getNearbyRadiologySuccess = nearbyRadiology => ({
  type: GET_NEARBY_RADIOLOGY_SUCCESS,
  payload: nearbyRadiology,
});


export const getNearbyRadiologyFail = error => ({
  type: GET_NEARBY_RADIOLOGY_FAIL,
  payload: error,
});

export const getRadiology = () => ({
  type: GET_RADIOLOGY,
  // payload: {},
});

export const getRadiologySuccess = Radiology => ({
  type: GET_RADIOLOGY_SUCCESS,
  payload: Radiology,
});

export const getRadiologyFail = error => ({
  type: GET_RADIOLOGY_FAIL,
  payload: error,
});
