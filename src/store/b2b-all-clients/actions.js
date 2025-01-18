import {
  GET_B2B_ALL_CLIENTS_LIST,
  GET_B2B_ALL_CLIENTS_LIST_SUCCESS,
  GET_B2B_ALL_CLIENTS_LIST_FAIL,
} from "./actionTypes";

export const getB2bAllClientsList = () => ({
  type: GET_B2B_ALL_CLIENTS_LIST,
  payload: {},
});

export const getB2bAllClientsListSuccess =
  b2bAllClients => ({
    type: GET_B2B_ALL_CLIENTS_LIST_SUCCESS,
    payload: b2bAllClients,
  });

export const getB2bAllClientsListFail = error => ({
  type: GET_B2B_ALL_CLIENTS_LIST_FAIL,
  payload: error,
});
