import {
  GET_NEARBY_TESTS,
  GET_NEARBY_TESTS_FAIL,
  GET_NEARBY_TESTS_SUCCESS,
  GET_NEARBY_TESTS_DISCOUNTEDLH,
  GET_NEARBY_TESTS_DISCOUNTEDLH_FAIL,
  GET_NEARBY_TESTS_DISCOUNTEDLH_SUCCESS,
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

export const getNearbyTests = (search_type, address, id, test_name) => ({
  type: GET_NEARBY_TESTS,
  payload: { search_type, address, id, test_name },
});

export const getNearbyTestsSuccess = nearbyTests => ({
  type: GET_NEARBY_TESTS_SUCCESS,
  payload: nearbyTests,
});


export const getNearbyTestsFail = error => ({
  type: GET_NEARBY_TESTS_FAIL,
  payload: error,
});


export const getNearbyTestsDiscounted = (search_type, address, id, test_name) => ({
  type: GET_NEARBY_TESTS_DISCOUNTEDLH,
  payload: { search_type, address, id, test_name },
});

export const getNearbyTestsDiscountedSuccess = nearbyTests => ({
  type: GET_NEARBY_TESTS_DISCOUNTEDLH_SUCCESS,
  payload: nearbyTests,
});


export const getNearbyTestsDiscountedFail = error => ({
  type: GET_NEARBY_TESTS_DISCOUNTEDLH_FAIL,
  payload: error,
});

