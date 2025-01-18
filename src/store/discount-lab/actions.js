import {
  GET_DISCOUNT_LAB,
  GET_DISCOUNT_LAB_SUCCESS,
  GET_DISCOUNT_LAB_FAIL,
  UPDATE_DISCOUNT_LAB,
  UPDATE_DISCOUNT_LAB_SUCCESS,
  UPDATE_DISCOUNT_LAB_FAIL,
  UPDATE_DISCOUNT_ALL_LAB,
  UPDATE_DISCOUNT_ALL_LAB_SUCCESS,
  UPDATE_DISCOUNT_ALL_LAB_FAIL,
} from "./actionTypes";

export const getDiscountLab = id => ({
  type: GET_DISCOUNT_LAB,
  payload: id,
});

export const getDiscountLabSuccess =
  discountlab => ({
    type: GET_DISCOUNT_LAB_SUCCESS,
    payload: discountlab,
  });

export const getDiscountLabFail = error => ({
  type: GET_DISCOUNT_LAB_FAIL,
  payload: error,
});
export const updateDiscountLab = discountLabs =>
({
  type: UPDATE_DISCOUNT_LAB,
  payload: discountLabs,
});

export const updateDiscountLabSuccess = discountLabs => ({
  type: UPDATE_DISCOUNT_LAB_SUCCESS,
  payload: discountLabs,
});

export const updateDiscountLabFail = error => ({
  type: UPDATE_DISCOUNT_LAB_FAIL,
  payload: error,
});
export const updateDiscountAllLab = discountAllLab => 
({
  type: UPDATE_DISCOUNT_ALL_LAB,
  payload: discountAllLab,
});

export const updateDiscountAllLabSuccess = discountAllLab => ({
  type: UPDATE_DISCOUNT_ALL_LAB_SUCCESS,
  payload: discountAllLab,
});

export const updateDiscountAllLabFail = error => ({
  type: UPDATE_DISCOUNT_ALL_LAB_FAIL,
  payload: error,
});