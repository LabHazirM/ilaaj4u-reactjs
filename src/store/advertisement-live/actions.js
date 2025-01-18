import {
  GET_ADVERTISEMENT_LIVES,
  GET_ADVERTISEMENT_LIVES_SUCCESS,
  GET_ADVERTISEMENT_LIVES_FAIL,
} from "./actionTypes";

export const getAdvertisementLives = id => ({
  type: GET_ADVERTISEMENT_LIVES,
  payload: id,
});

export const getAdvertisementLivesSuccess = advertisementLives => ({
  type: GET_ADVERTISEMENT_LIVES_SUCCESS,
  payload: advertisementLives,
});

export const getAdvertisementLivesFail = error => ({
  type: GET_ADVERTISEMENT_LIVES_FAIL,
  payload: error,
});
