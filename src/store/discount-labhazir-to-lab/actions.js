import {
  GET_DISCOUNT_LABHAZIRTOLABS,
  GET_DISCOUNT_LABHAZIRTOLABS_FAIL,
  GET_DISCOUNT_LABHAZIRTOLABS_SUCCESS, 
  UPDATE_DISCOUNT_LABHAZIRTOLAB,
  UPDATE_DISCOUNT_LABHAZIRTOLAB_SUCCESS,
  UPDATE_DISCOUNT_LABHAZIRTOLAB_FAIL,
  UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB,
  UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB_SUCCESS,
  UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB_FAIL,
} from "./actionTypes";

export const getDiscountLabHazirToLabs = id => ({
  type: GET_DISCOUNT_LABHAZIRTOLABS,
  payload: id,
});

export const getDiscountLabHazirToLabsSuccess = discountLabHazirToLabs => ({
  type: GET_DISCOUNT_LABHAZIRTOLABS_SUCCESS,
  payload: discountLabHazirToLabs,
});

export const getDiscountLabHazirToLabsFail = error => ({
  type: GET_DISCOUNT_LABHAZIRTOLABS_FAIL,
  payload: error,
});

export const updateDiscountLabHazirToLab = discountLabHazirToLab => ({
  type: UPDATE_DISCOUNT_LABHAZIRTOLAB,
  payload: discountLabHazirToLab,
});

export const updateDiscountLabHazirToLabSuccess = discountLabHazirToLab => ({
  type: UPDATE_DISCOUNT_LABHAZIRTOLAB_SUCCESS,
  payload: discountLabHazirToLab,
});

export const updateDiscountLabHazirToLabFail = error => ({
  type: UPDATE_DISCOUNT_LABHAZIRTOLAB_FAIL,
  payload: error,
});

export const updateDiscountAllLabHazirToLab = discountAllLabHazir => ({
  type: UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB,
  payload: discountAllLabHazir,
});

export const updateDiscountAllLabHazirToLabSuccess = discountAllLabHazir => ({
  type: UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB_SUCCESS,
  payload: discountAllLabHazir,
});

export const updateDiscountAllLabHazirToLabFail = error => ({
  type: UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB_FAIL,
  payload: error,
});
