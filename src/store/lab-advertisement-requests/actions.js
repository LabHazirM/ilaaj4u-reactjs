import {
  GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED,
  GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED_FAIL,
  GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED_SUCCESS,
  GET_LAB_ADVERTISEMENT_REQUESTS,
  GET_LAB_ADVERTISEMENT_REQUESTS_FAIL,
  GET_LAB_ADVERTISEMENT_REQUESTS_SUCCESS,
  UPDATE_LAB_ADVERTISEMENT_REQUEST,
  UPDATE_LAB_ADVERTISEMENT_REQUEST_SUCCESS,
  UPDATE_LAB_ADVERTISEMENT_REQUEST_FAIL,
} from "./actionTypes";

export const getLabAdvertisementRequestsAccepted = id => ({
  type: GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED,
  payload: id,
});

export const getLabAdvertisementRequestsAcceptedSuccess = labAdvertisementRequests => ({
  type: GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED_SUCCESS,
  payload: labAdvertisementRequests,
});

export const getLabAdvertisementRequestsAcceptedFail = error => ({
  type: GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED_FAIL,
  payload: error,
});

export const getLabAdvertisementRequests = id => ({
  type: GET_LAB_ADVERTISEMENT_REQUESTS,
  payload: id,
});

export const getLabAdvertisementRequestsSuccess = labAdvertisementRequests => ({
  type: GET_LAB_ADVERTISEMENT_REQUESTS_SUCCESS,
  payload: labAdvertisementRequests,
});

export const getLabAdvertisementRequestsFail = error => ({
  type: GET_LAB_ADVERTISEMENT_REQUESTS_FAIL,
  payload: error,
});



export const updateLabAdvertisementRequest = labAdvertisementRequest => ({
  type: UPDATE_LAB_ADVERTISEMENT_REQUEST,
  payload: labAdvertisementRequest,
});

export const updateLabAdvertisementRequestSuccess = labAdvertisementRequest => ({
  type: UPDATE_LAB_ADVERTISEMENT_REQUEST_SUCCESS,
  payload: labAdvertisementRequest,
});

export const updateLabAdvertisementRequestFail = error => ({
  type: UPDATE_LAB_ADVERTISEMENT_REQUEST_FAIL,
  payload: error,
});

