import {
  GET_CSR_CENTRAL_TERRITORY_LIST,
  GET_CSR_CENTRAL_TERRITORY_LIST_SUCCESS,
  GET_CSR_CENTRAL_TERRITORY_LIST_FAIL,
  GET_CSR_SOUTH_TERRITORY_LIST,
  GET_CSR_SOUTH_TERRITORY_LIST_SUCCESS,
  GET_CSR_SOUTH_TERRITORY_LIST_FAIL,
  GET_CSR_NORTH_TERRITORY_LIST,
  GET_CSR_NORTH_TERRITORY_LIST_SUCCESS,
  GET_CSR_NORTH_TERRITORY_LIST_FAIL,
} from "./actionTypes";

// CSR central territory
export const getCsrCentralList = () => ({
  type: GET_CSR_CENTRAL_TERRITORY_LIST,
  payload: {},
});

export const getCsrCentralListSuccess =
csrCentral => ({
    type: GET_CSR_CENTRAL_TERRITORY_LIST_SUCCESS,
    payload: csrCentral,
  });

export const getCsrCentralListFail = error => ({
  type: GET_CSR_CENTRAL_TERRITORY_LIST_FAIL,
  payload: error,
});
// CSR South territory
export const getCsrSouthList = () => ({
  type: GET_CSR_SOUTH_TERRITORY_LIST,
  payload: {},
});

export const getCsrSouthListSuccess =
  csrSouth => ({
    type: GET_CSR_SOUTH_TERRITORY_LIST_SUCCESS,
    payload: csrSouth,
  });

export const getCsrSouthListFail = error => ({
  type: GET_CSR_SOUTH_TERRITORY_LIST_FAIL,
  payload: error,
});
// CSR North territory
export const getCsrNorthList = () => ({
  type: GET_CSR_NORTH_TERRITORY_LIST,
  payload: {},
});

export const getCsrNorthListSuccess =
  csrNorth => ({
    type: GET_CSR_NORTH_TERRITORY_LIST_SUCCESS,
    payload: csrNorth,
  });

export const getCsrNorthListFail = error => ({
  type: GET_CSR_NORTH_TERRITORY_LIST_FAIL,
  payload: error,
});