import {
  GET_AUDITOR_CENTRAL_TERRITORY_LIST,
  GET_AUDITOR_CENTRAL_TERRITORY_LIST_SUCCESS,
  GET_AUDITOR_CENTRAL_TERRITORY_LIST_FAIL,
  GET_AUDITOR_SOUTH_TERRITORY_LIST,
  GET_AUDITOR_SOUTH_TERRITORY_LIST_SUCCESS,
  GET_AUDITOR_SOUTH_TERRITORY_LIST_FAIL,
  GET_AUDITOR_NORTH_TERRITORY_LIST,
  GET_AUDITOR_NORTH_TERRITORY_LIST_SUCCESS,
  GET_AUDITOR_NORTH_TERRITORY_LIST_FAIL,
} from "./actionTypes";

// AUDITOR central territory
export const getAuditorCentralList = () => ({
  type: GET_AUDITOR_CENTRAL_TERRITORY_LIST,
  payload: {},
});

export const getAuditorCentralListSuccess =
auditorCentral => ({
    type: GET_AUDITOR_CENTRAL_TERRITORY_LIST_SUCCESS,
    payload: auditorCentral,
  });

export const getAuditorCentralListFail = error => ({
  type: GET_AUDITOR_CENTRAL_TERRITORY_LIST_FAIL,
  payload: error,
});
// AUDITOR South territory
export const getAuditorSouthList = () => ({
  type: GET_AUDITOR_SOUTH_TERRITORY_LIST,
  payload: {},
});

export const getAuditorSouthListSuccess =
  auditorSouth => ({
    type: GET_AUDITOR_SOUTH_TERRITORY_LIST_SUCCESS,
    payload: auditorSouth,
  });

export const getAuditorSouthListFail = error => ({
  type: GET_AUDITOR_SOUTH_TERRITORY_LIST_FAIL,
  payload: error,
});
// AUDITOR North territory
export const getAuditorNorthList = () => ({
  type: GET_AUDITOR_NORTH_TERRITORY_LIST,
  payload: {},
});

export const getAuditorNorthListSuccess =
  auditorNorth => ({
    type: GET_AUDITOR_NORTH_TERRITORY_LIST_SUCCESS,
    payload: auditorNorth,
  });

export const getAuditorNorthListFail = error => ({
  type: GET_AUDITOR_NORTH_TERRITORY_LIST_FAIL,
  payload: error,
});