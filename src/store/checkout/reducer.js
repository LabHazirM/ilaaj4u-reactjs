import {
  GET_HOME_SAMPLED_TESTS_FAIL,
  GET_HOME_SAMPLED_TESTS_SUCCESS,
  GET_DONATION_CHECK_FAIL,
  GET_DONATION_CHECK_SUCCESS,
  GET_CHECKOUT_ITEMS_SUCCESS,
  GET_CHECKOUT_ITEMS_FAIL,
  ADD_CHECKOUT_DATA_SUCCESS,
  ADD_CHECKOUT_DATA_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  homeSampledTests: [],
  checkoutItems: [],
  checkedoutData: [],
  donationCheck:[],
  error: {},
};

const checkout = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_HOME_SAMPLED_TESTS_SUCCESS:
      return {
        ...state,
        homeSampledTests: action.payload,
      };

    case GET_HOME_SAMPLED_TESTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_DONATION_CHECK_SUCCESS:
        return {
          ...state,
          donationCheck: action.payload,
        };
  
      case GET_DONATION_CHECK_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    case GET_CHECKOUT_ITEMS_SUCCESS:
      return {
        ...state,
        checkoutItems: action.payload.data,
      };

    case GET_CHECKOUT_ITEMS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_CHECKOUT_DATA_SUCCESS:
      return {
        ...state,
        checkedoutData: [...state.checkedoutData, action.payload.data],
      };

    case ADD_CHECKOUT_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default checkout;
