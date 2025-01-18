import {
  GET_DISCOUNT_LABHAZIRS_SUCCESS,
  GET_DISCOUNT_LABHAZIRS_FAIL,
  UPDATE_DISCOUNT_LABHAZIR_SUCCESS,
  UPDATE_DISCOUNT_LABHAZIR_FAIL,
  UPDATE_DISCOUNT_ALL_LABHAZIR_SUCCESS,
  UPDATE_DISCOUNT_ALL_LABHAZIR_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  discountLabHazirs: [],
  error: {},
};

const discountLabHazirs = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DISCOUNT_LABHAZIRS_SUCCESS:
      return {
        ...state,
        discountLabHazirs: action.payload.data,
      };

    case GET_DISCOUNT_LABHAZIRS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DISCOUNT_LABHAZIR_SUCCESS:
      return {
        ...state,
        discountLabHazirs: state.discountLabHazirs.map(discountLabHazir =>
          discountLabHazir.id.toString() === action.payload.id.toString()
            ? { discountLabHazir, ...action.payload }
            : discountLabHazir
        ),
      };

    case UPDATE_DISCOUNT_LABHAZIR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DISCOUNT_ALL_LABHAZIR_SUCCESS:
      return {
        ...state,
        discountAllLabHazirs: state.discountAllLabHazirs.map(discountAllLabHazir =>
          discountAllLabHazir.id.toString() === action.payload.id.toString()
            ? { discountAllLabHazir, ...action.payload }
            : discountAllLabHazir
        ),
      };

    case UPDATE_DISCOUNT_ALL_LABHAZIR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default discountLabHazirs;
