import {
  GET_DISCOUNT_LABHAZIRS,
  GET_DISCOUNT_LABHAZIRS_FAIL,
  GET_DISCOUNT_LABHAZIRS_SUCCESS,
  UPDATE_DISCOUNT_LABHAZIR,
  UPDATE_DISCOUNT_LABHAZIR_SUCCESS,
  UPDATE_DISCOUNT_LABHAZIR_FAIL,
  UPDATE_DISCOUNT_ALL_LABHAZIR,
  UPDATE_DISCOUNT_ALL_LABHAZIR_SUCCESS,
  UPDATE_DISCOUNT_ALL_LABHAZIR_FAIL,
} from "./actionTypes";

export const getDiscountLabHazirs = id => ({
  type: GET_DISCOUNT_LABHAZIRS,
  payload: id,
});
export const getDiscountLabHazirsSuccess = discountLabHazirs => ({
  type: GET_DISCOUNT_LABHAZIRS_SUCCESS,
  payload: discountLabHazirs,
});

export const getDiscountLabHazirsFail = error => ({
  type: GET_DISCOUNT_LABHAZIRS_FAIL,
  payload: error,
});

export const updateDiscountLabHazir = discountLabHazir => ({
  type: UPDATE_DISCOUNT_LABHAZIR,
  payload: discountLabHazir,
});

export const updateDiscountLabHazirSuccess = discountLabHazir => ({
  type: UPDATE_DISCOUNT_LABHAZIR_SUCCESS,
  payload: discountLabHazir,
});

export const updateDiscountLabHazirFail = error => ({
  type: UPDATE_DISCOUNT_LABHAZIR_FAIL,
  payload: error,
});

export const updateDiscountAllLabHazir = discountAllLabHazir => ({
  type: UPDATE_DISCOUNT_ALL_LABHAZIR,
  payload: discountAllLabHazir,
});

export const updateDiscountAllLabHazirSuccess = discountAllLabHazir => ({
  type: UPDATE_DISCOUNT_ALL_LABHAZIR_SUCCESS,
  payload: discountAllLabHazir,
});

export const updateDiscountAllLabHazirFail = error => ({
  type: UPDATE_DISCOUNT_ALL_LABHAZIR_FAIL,
  payload: error,
});
