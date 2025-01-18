import {
  GET_ADVERTISEMENT_PRICE_LISTS,
  GET_ADVERTISEMENT_PRICE_LISTS_FAIL,
  GET_ADVERTISEMENT_PRICE_LISTS_SUCCESS,
  ADD_NEW_ADVERTISEMENT_PRICE_LIST,
  ADD_ADVERTISEMENT_PRICE_LIST_SUCCESS,
  ADD_ADVERTISEMENT_PRICE_LIST_FAIL,
  UPDATE_ADVERTISEMENT_PRICE_LIST,
  UPDATE_ADVERTISEMENT_PRICE_LIST_SUCCESS,
  UPDATE_ADVERTISEMENT_PRICE_LIST_FAIL,
  DELETE_ADVERTISEMENT_PRICE_LIST,
  DELETE_ADVERTISEMENT_PRICE_LIST_SUCCESS,
  DELETE_ADVERTISEMENT_PRICE_LIST_FAIL,
} from "./actionTypes";

export const getAdvertisementPriceLists = id=> ({
  type: GET_ADVERTISEMENT_PRICE_LISTS,
  payload: id,
});

export const getAdvertisementPriceListsSuccess = advertisementPriceLists => ({
  type: GET_ADVERTISEMENT_PRICE_LISTS_SUCCESS,
  payload: advertisementPriceLists,
});

export const getAdvertisementPriceListsFail = error => ({
  type: GET_ADVERTISEMENT_PRICE_LISTS_FAIL,
  payload: error,
});

export const addNewAdvertisementPriceList = (advertisementPriceList, id) => ({
  type: ADD_NEW_ADVERTISEMENT_PRICE_LIST,
  payload: { advertisementPriceList, id },
});

export const addAdvertisementPriceListSuccess = advertisementPriceList => ({
  type: ADD_ADVERTISEMENT_PRICE_LIST_SUCCESS,
  payload: advertisementPriceList,
});

export const addAdvertisementPriceListFail = error => ({
  type: ADD_ADVERTISEMENT_PRICE_LIST_FAIL,
  payload: error,
});

export const updateAdvertisementPriceList = advertisementPriceList => ({
  type: UPDATE_ADVERTISEMENT_PRICE_LIST,
  payload: advertisementPriceList,
});

export const updateAdvertisementPriceListSuccess = advertisementPriceList => ({
  type: UPDATE_ADVERTISEMENT_PRICE_LIST_SUCCESS,
  payload: advertisementPriceList,
});

export const updateAdvertisementPriceListFail = error => ({
  type: UPDATE_ADVERTISEMENT_PRICE_LIST_FAIL,
  payload: error,
});

export const deleteAdvertisementPriceList = advertisementPriceList => ({
  type: DELETE_ADVERTISEMENT_PRICE_LIST,
  payload: advertisementPriceList,
});

export const deleteAdvertisementPriceListSuccess = advertisementPriceList => ({
  type: DELETE_ADVERTISEMENT_PRICE_LIST_SUCCESS,
  payload: advertisementPriceList,
});

export const deleteAdvertisementPriceListFail = error => ({
  type: DELETE_ADVERTISEMENT_PRICE_LIST_FAIL,
  payload: error,
});
