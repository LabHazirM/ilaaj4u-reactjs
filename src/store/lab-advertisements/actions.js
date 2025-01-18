import {
  // GET_ADVERTISEMENT_PRICE_LISTS,
  // GET_ADVERTISEMENT_PRICE_LISTS_FAIL,
  // GET_ADVERTISEMENT_PRICE_LISTS_SUCCESS,
  GET_LAB_ADVERTISEMENTS,
  GET_LAB_ADVERTISEMENTS_FAIL,
  GET_LAB_ADVERTISEMENTS_SUCCESS,
  ADD_NEW_LAB_ADVERTISEMENT,
  ADD_LAB_ADVERTISEMENT_SUCCESS,
  ADD_LAB_ADVERTISEMENT_FAIL,
  UPDATE_LAB_ADVERTISEMENT,
  UPDATE_LAB_ADVERTISEMENT_SUCCESS,
  UPDATE_LAB_ADVERTISEMENT_FAIL,
  DELETE_LAB_ADVERTISEMENT,
  DELETE_LAB_ADVERTISEMENT_SUCCESS,
  DELETE_LAB_ADVERTISEMENT_FAIL,
} from "./actionTypes";

// export const getAdvertisementPriceLists = id=> ({
//   type: GET_ADVERTISEMENT_PRICE_LISTS,
//   payload: id,
// });

// export const getAdvertisementPriceListsSuccess = labAdvertisements => ({
//   type: GET_ADVERTISEMENT_PRICE_LISTS_SUCCESS,
//   payload: labAdvertisements,
// });

// export const getAdvertisementPriceListsFail = error => ({
//   type: GET_ADVERTISEMENT_PRICE_LISTS_FAIL,
//   payload: error,
// });

export const getLabAdvertisements = id => ({
  type: GET_LAB_ADVERTISEMENTS,
  payload: id,
});

export const getLabAdvertisementsSuccess = labAdvertisements => ({
  type: GET_LAB_ADVERTISEMENTS_SUCCESS,
  payload: labAdvertisements,
});

export const getLabAdvertisementsFail = error => ({
  type: GET_LAB_ADVERTISEMENTS_FAIL,
  payload: error,
});

export const addNewLabAdvertisement = (labAdvertisement, id) => ({
  type: ADD_NEW_LAB_ADVERTISEMENT,
  payload: { labAdvertisement, id },
});

export const addLabAdvertisementSuccess = labAdvertisement => ({
  type: ADD_LAB_ADVERTISEMENT_SUCCESS,
  payload: labAdvertisement,
});

export const addLabAdvertisementFail = error => ({
  type: ADD_LAB_ADVERTISEMENT_FAIL,
  payload: error,
});

export const updateLabAdvertisement = labAdvertisement => ({
  type: UPDATE_LAB_ADVERTISEMENT,
  payload: labAdvertisement,
});

export const updateLabAdvertisementSuccess = labAdvertisement => ({
  type: UPDATE_LAB_ADVERTISEMENT_SUCCESS,
  payload: labAdvertisement,
});

export const updateLabAdvertisementFail = error => ({
  type: UPDATE_LAB_ADVERTISEMENT_FAIL,
  payload: error,
});

export const deleteLabAdvertisement = labAdvertisement => ({
  type: DELETE_LAB_ADVERTISEMENT,
  payload: labAdvertisement,
});

export const deleteLabAdvertisementSuccess = labAdvertisement => ({
  type: DELETE_LAB_ADVERTISEMENT_SUCCESS,
  payload: labAdvertisement,
});

export const deleteLabAdvertisementFail = error => ({
  type: DELETE_LAB_ADVERTISEMENT_FAIL,
  payload: error,
});
