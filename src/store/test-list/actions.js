import {
  GET_TESTS_LIST,
  GET_TESTS_LIST_SUCCESS,
  GET_TESTS_LIST_FAIL,
  GET_CORPORATE_TESTS_LIST,
  GET_CORPORATE_TESTS_LIST_SUCCESS,
  GET_CORPORATE_TESTS_LIST_FAIL,
} from "./actionTypes";

export const getTestsList = id => ({
  type: GET_TESTS_LIST,
  payload: id,
});

export const getTestsListSuccess =
  tests => ({
    type: GET_TESTS_LIST_SUCCESS,
    payload: tests,
  });

export const getTestsListFail = error => ({
  type: GET_TESTS_LIST_FAIL,
  payload: error,
});
export const getCorporateTestsList = id => ({
  type: GET_CORPORATE_TESTS_LIST,
  payload: id,
});

export const getCorporateTestsListSuccess =
  corporatetests => ({
    type: GET_CORPORATE_TESTS_LIST_SUCCESS,
    payload: corporatetests,
  });

export const getCorporateTestsListFail = error => ({
  type: GET_CORPORATE_TESTS_LIST_FAIL,
  payload: error,
});
