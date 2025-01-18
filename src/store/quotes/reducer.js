import {
  GET_QUOTES_SUCCESS,
  GET_QUOTES_FAIL,
  DELETE_CART_SUCCESS,
  DELETE_CART_FAIL,
  EMPTY_CART_SUCCESS,
  EMPTY_CART_FAIL,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  quotes: [],
  error: {},
  success: {},
};

const quotes = (state = INIT_STATE, action) => {
  switch (action.type) {
    // case GET_QUOTES_SUCCESS:
    //   console.log("reducersssssssssssssssssssssss", action.payload)
    //   return {
    //     ...state,
    //     quotes: action.payload,
    //   };
    case GET_QUOTES_SUCCESS:
      return {
        ...state,
        quotes: action.payload.data,
      };

    case GET_QUOTES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case EMPTY_CART_SUCCESS:
      return {
        ...state,
        quotes: state.quotes.filter(
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
        quotes: state.quotes.filter(
          cart => cart.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_CART_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // case ADD_TO_CART_SUCCESS:
    //   return {
    //     ...state,
    //     success: action.payload,
    //   };
    // case ADD_TO_CART_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    default:
      return state;
  }
};

export default quotes;
