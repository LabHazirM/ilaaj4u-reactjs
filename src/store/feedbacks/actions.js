import {
  GET_FEEDBACKS,
  GET_FEEDBACKS_FAIL,
  GET_FEEDBACKS_SUCCESS,
  GET_LAB_PROFILE,
  GET_LAB_PROFILE_FAIL,
  GET_LAB_PROFILE_SUCCESS,
} from "./actionTypes";

export const getLabProfile = id => ({
  type: GET_LAB_PROFILE,
  payload: id,
});

export const getLabProfileSuccess = labProfile => ({
  type: GET_LAB_PROFILE_SUCCESS,
  payload: labProfile,
});

export const getLabProfileFail = error => ({
  type: GET_LAB_PROFILE_FAIL,
  payload: error,
});
export const getFeedbacks = id => ({
  type: GET_FEEDBACKS,
  payload: id,
});

export const getFeedbacksSuccess = feedbacks => ({
  type: GET_FEEDBACKS_SUCCESS,
  payload: feedbacks,
});

export const getFeedbacksFail = error => ({
  type: GET_FEEDBACKS_FAIL,
  payload: error,
});