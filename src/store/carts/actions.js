import { ADD_TO_CART } from "helpers/url_helper";
import {
  GET_CARTS,
  GET_CARTS_FAIL,
  GET_CARTS_SUCCESS,
  DELETE_CART,
  DELETE_CART_SUCCESS,
  DELETE_CART_FAIL,
  EMPTY_CART,
  EMPTY_CART_SUCCESS,
  EMPTY_CART_FAIL,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
} from "./actionTypes";

// ----------- Cart list APIs actions -----------------
export const getCarts = id => ({
  type: GET_CARTS,
  payload: id,
  
});

export const getCartsSuccess = carts => ({
  type: GET_CARTS_SUCCESS,
  payload: carts,
});

export const getCartsFail = error => ({
  type: GET_CARTS_FAIL,
  payload: error,
});

export const deleteCart = cart => ({
  type: DELETE_CART,
  payload: cart,
});

export const deleteCartSuccess = cart => ({
  type: DELETE_CART_SUCCESS,
  payload: cart,
});

export const deleteCartFail = error => ({
  type: DELETE_CART_FAIL,
  payload: error,
});
export const emptyCart = cart => ({
  type: EMPTY_CART,
  payload: cart,
});

export const emptyCartSuccess = cart => ({
  type: EMPTY_CART_SUCCESS,
  payload: cart,
});

export const emptyCartFail = error => ({
  type: EMPTY_CART_FAIL,
  payload: error,
});

export const addToCart = (cart, id) => (
  console.log("action", cart),
  {
  type: ADD_TO_CART,
  payload: { cart, id},
});

export const addToCartSuccess = cart => (
  console.log("action", cart),
  {
  type: ADD_TO_CART_SUCCESS,
  payload: cart,
});

export const addToCartFail = error => ({
  type: ADD_TO_CART_FAIL,
  payload: error,
});
