import { ADD_TO_CART } from "helpers/url_helper";
import {
  GET_QUOTES,
  GET_QUOTES_FAIL,
  GET_QUOTES_SUCCESS,
  DELETE_CART,
  DELETE_CART_SUCCESS,
  DELETE_CART_FAIL,
  EMPTY_CART,
  EMPTY_CART_SUCCESS,
  EMPTY_CART_FAIL,
  // ADD_TO_CART_SUCCESS,
  // ADD_TO_CART_FAIL,
} from "./actionTypes";

// ----------- Cart list APIs actions -----------------
export const getQuotes = (city_id, test_id, search_type, address, longitude, latitude, km, locationAccessAllowed) => (
  console.log("action", city_id, test_id, search_type, address, longitude, latitude, km, locationAccessAllowed),
  {
  type: GET_QUOTES,
  payload: {city_id, test_id, search_type, address, longitude, latitude, km, locationAccessAllowed}, 
});;

export const getQuotesSuccess = quotes => (
  console.log("action quotesssssssssssss", quotes), 
  {
  type: GET_QUOTES_SUCCESS,
  payload: quotes,
});

export const getQuotesFail = error => ({
  type: GET_QUOTES_FAIL,
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

// export const addToCartSuccess = cart => (
//   console.log("action", cart),
//   {
//   type: ADD_TO_CART_SUCCESS,
//   payload: cart,
// });

// export const addToCartFail = error => ({
//   type: ADD_TO_CART_FAIL,
//   payload: error,
// });
