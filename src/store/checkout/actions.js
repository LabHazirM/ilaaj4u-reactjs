import {
  GET_HOME_SAMPLED_TESTS,
  GET_HOME_SAMPLED_TESTS_FAIL,
  GET_HOME_SAMPLED_TESTS_SUCCESS,
  GET_DONATION_CHECK,
  GET_DONATION_CHECK_FAIL,
  GET_DONATION_CHECK_SUCCESS,
  GET_CHECKOUT_ITEMS,
  GET_CHECKOUT_ITEMS_FAIL,
  GET_CHECKOUT_ITEMS_SUCCESS,
  ADD_CHECKOUT_DATA,
  ADD_CHECKOUT_DATA_SUCCESS,
  ADD_CHECKOUT_DATA_FAIL,
} from "./actionTypes";

export const getHomeSampledTests = id => ({
  type: GET_HOME_SAMPLED_TESTS,
  payload: id,
});

export const getHomeSampledTestsSuccess = homeSampledTests => ({
  type: GET_HOME_SAMPLED_TESTS_SUCCESS,
  payload: homeSampledTests,
});

export const getHomeSampledTestsFail = error => ({
  type: GET_HOME_SAMPLED_TESTS_FAIL,
  payload: error,
});
export const getDonationCheck = id => ({
  type: GET_DONATION_CHECK,
  payload: id,
});

export const getDonationCheckSuccess = donationCheck => ({
  type: GET_DONATION_CHECK_SUCCESS,
  payload: donationCheck,
});

export const getDonationCheckFail = error => ({
  type: GET_DONATION_CHECK_FAIL,
  payload: error,
});

export const getCheckoutItems = (id, is_home_sampling_availed, is_state_sampling_availed) => ({
  type: GET_CHECKOUT_ITEMS,
  payload: { id, is_home_sampling_availed, is_state_sampling_availed},
});

export const getCheckoutItemsSuccess = checkoutItems => ({
  type: GET_CHECKOUT_ITEMS_SUCCESS,
  payload: checkoutItems,
});

export const getCheckoutItemsFail = error => ({
  type: GET_CHECKOUT_ITEMS_FAIL,
  payload: error,
});

export const addCheckoutData = (checkoutData, id) => ({
  type: ADD_CHECKOUT_DATA,
  payload: { checkoutData, id },
});

export const addCheckoutDataSuccess = checkoutData => ({
  type: ADD_CHECKOUT_DATA_SUCCESS,
  payload: checkoutData,
});

export const addCheckoutDataFail = error => ({
  type: ADD_CHECKOUT_DATA_FAIL,
  payload: error,
});
