import {
  GET_ADVERTISEMENTS,
  GET_ADVERTISEMENTS_FAIL,
  GET_ADVERTISEMENTS_SUCCESS,
  ADD_NEW_ADVERTISEMENT,
  ADD_ADVERTISEMENT_SUCCESS,
  ADD_ADVERTISEMENT_FAIL,
  UPDATE_ADVERTISEMENT,
  UPDATE_ADVERTISEMENT_SUCCESS,
  UPDATE_ADVERTISEMENT_FAIL,
  DELETE_ADVERTISEMENT,
  DELETE_ADVERTISEMENT_SUCCESS,
  DELETE_ADVERTISEMENT_FAIL,
} from "./actionTypes";

export const getAdvertisements = () => ({
  type: GET_ADVERTISEMENTS,
  payload: {},
});

export const getAdvertisementsSuccess = advertisements => ({
  type: GET_ADVERTISEMENTS_SUCCESS,
  payload: advertisements,
});

export const getAdvertisementsFail = error => ({
  type: GET_ADVERTISEMENTS_FAIL,
  payload: error,
});

export const addNewAdvertisement = (advertisement, id) => ({
  type: ADD_NEW_ADVERTISEMENT,
  payload: { advertisement, id },
});

export const addAdvertisementSuccess = advertisement => ({
  type: ADD_ADVERTISEMENT_SUCCESS,
  payload: advertisement,
});

export const addAdvertisementFail = error => ({
  type: ADD_ADVERTISEMENT_FAIL,
  payload: error,
});

export const updateAdvertisement = advertisement => ({
  type: UPDATE_ADVERTISEMENT,
  payload: advertisement,
});

export const updateAdvertisementSuccess = advertisement => ({
  type: UPDATE_ADVERTISEMENT_SUCCESS,
  payload: advertisement,
});

export const updateAdvertisementFail = error => ({
  type: UPDATE_ADVERTISEMENT_FAIL,
  payload: error,
});

export const deleteAdvertisement = advertisement => ({
  type: DELETE_ADVERTISEMENT,
  payload: advertisement,
});

export const deleteAdvertisementSuccess = advertisement => ({
  type: DELETE_ADVERTISEMENT_SUCCESS,
  payload: advertisement,
});

export const deleteAdvertisementFail = error => ({
  type: DELETE_ADVERTISEMENT_FAIL,
  payload: error,
});
