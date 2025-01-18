import {
  GET_TEST_DESCRIPTIONS,
  GET_TEST_DESCRIPTIONS_FAIL,
  GET_TEST_DESCRIPTIONS_SUCCESS,

} from "./actionTypes";

export const getTestDescriptions = id => ({
  type: GET_TEST_DESCRIPTIONS,
  payload: id,
});

export const getTestDescriptionsSuccess = TestDescriptions => ({
  type: GET_TEST_DESCRIPTIONS_SUCCESS,
  payload: TestDescriptions,
});

export const getTestDescriptionsFail = error => ({
  type: GET_TEST_DESCRIPTIONS_FAIL,
  payload: error,
});

