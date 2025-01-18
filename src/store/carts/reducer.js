import {
  GET_CARTS_SUCCESS,
  GET_CARTS_FAIL,
  DELETE_CART_SUCCESS,
  DELETE_CART_FAIL,
  EMPTY_CART_SUCCESS,
  EMPTY_CART_FAIL,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  carts: [],
  error: {},
  success: {},
};

const carts = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CARTS_SUCCESS:
      return {
        ...state,
        carts: action.payload.data,
        total_balance_sum: action.payload.total_balance_sum,
      };

    case GET_CARTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case EMPTY_CART_SUCCESS:
      return {
        ...state,
        carts: state.carts.filter(
          cart => cart.id.toString() !== action.payload.id.toString()
        ),
      };

    case EMPTY_CART_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CART_SUCCESS:
      console.log("reducer", action.payload.id)
      return {
        ...state,
        carts: state.carts.filter(
          cart => cart.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_CART_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_TO_CART_SUCCESS:
      return {
        ...state,
        success: action.payload,
      };
    case ADD_TO_CART_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default carts;
