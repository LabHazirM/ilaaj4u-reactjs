import {
  GET_TESTS_LIST_SUCCESS,
  GET_TESTS_LIST_FAIL,
  GET_CORPORATE_TESTS_LIST_SUCCESS,
  GET_CORPORATE_TESTS_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  testsList: [],
  error: {},
};

const tests = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TESTS_LIST_SUCCESS:
      return {
        ...state,
        testsList: action.payload.data,
      };

    case GET_TESTS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_CORPORATE_TESTS_LIST_SUCCESS:
      return {
        ...state,
        testsList: action.payload.data,
      };

    case GET_CORPORATE_TESTS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default tests;
