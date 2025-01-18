import {
  GET_NEARBY_PROFILES,
  GET_NEARBY_PROFILES_FAIL,
  GET_NEARBY_PROFILES_SUCCESS,
  GET_PROFILES,
  GET_PROFILES_FAIL,
  GET_PROFILES_SUCCESS,
  GET_TESTSS,
  GET_TESTSS_FAIL,
  GET_TESTSS_SUCCESS,
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

export const getNearbyProfiles = (search_type, address, id, test_name) => ({
  type: GET_NEARBY_PROFILES,
  payload: { search_type, address, id, test_name },
});

export const getNearbyProfilesSuccess = nearbyProfiles => ({
  type: GET_NEARBY_PROFILES_SUCCESS,
  payload: nearbyProfiles,
});


export const getNearbyProfilesFail = error => ({
  type: GET_NEARBY_PROFILES_FAIL,
  payload: error,
});

export const getProfiles = () => ({
  type: GET_PROFILES,
  // payload: {},
});

export const getProfilesSuccess = Profiles => ({
  type: GET_PROFILES_SUCCESS,
  payload: Profiles,
});

export const getProfilesFail = error => ({
  type: GET_PROFILES_FAIL,
  payload: error,
});
export const getTestss = () => ({
  type: GET_TESTSS,
  // payload: {},
});

export const getTestssSuccess = Testss => ({
  type: GET_TESTSS_SUCCESS,
  payload: Testss,
});

export const getTestssFail = error => ({
  type: GET_TESTSS_FAIL,
  payload: error,
});

