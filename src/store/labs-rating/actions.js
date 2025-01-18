import {
  GET_LABS_RATING,
  GET_LABS_RATING_FAIL,
  GET_LABS_RATING_SUCCESS,

} from "./actionTypes";

export const getLabsRating = () => ({
  type: GET_LABS_RATING,
  payload: {},
});

export const getLabsRatingSuccess = labsRating => ({
  type: GET_LABS_RATING_SUCCESS,
  payload: labsRating,
});

export const getLabsRatingFail = error => ({
  type: GET_LABS_RATING_FAIL,
  payload: error,
});