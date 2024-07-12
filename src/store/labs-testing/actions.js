import {
  GET_LABS_TESTING,
  GET_LABS_TESTING_FAIL,
  GET_LABS_TESTING_SUCCESS,

} from "./actionTypes";

export const getLabsTesting = () => ({
  type: GET_LABS_TESTING,
  payload: {},
});

export const getLabsTestingSuccess = labsTesting => ({
  type: GET_LABS_TESTING_SUCCESS,
  payload: labsTesting,
});

export const getLabsTestingFail = error => ({
  type: GET_LABS_TESTING_FAIL,
  payload: error,
});