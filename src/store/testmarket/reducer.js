import {
  GET_NEARBY_TESTS_FAIL,
  GET_NEARBY_TESTS_SUCCESS,
  GET_NEARBY_TESTS_DISCOUNTEDLH_FAIL,
  GET_NEARBY_TESTS_DISCOUNTEDLH_SUCCESS,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  nearbyTests: [],
  territoriesList: [],
  error: {},
};

const TestMarket = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TERRITORIES_LIST_SUCCESS:
      return {
        ...state,
        territoriesList: action.payload.data,
      };

    case GET_TERRITORIES_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_NEARBY_TESTS_SUCCESS:
      return {
        ...state,
        nearbyTests: action.payload.data,
      };

    case GET_NEARBY_TESTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_NEARBY_TESTS_DISCOUNTEDLH_SUCCESS:
      return {
        ...state,
        nearbyTests: action.payload.data,
      };

    case GET_NEARBY_TESTS_DISCOUNTEDLH_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default TestMarket;
