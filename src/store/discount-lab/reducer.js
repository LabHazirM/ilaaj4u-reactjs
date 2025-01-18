import {
  GET_DISCOUNT_LAB_SUCCESS,
  GET_DISCOUNT_LAB_FAIL,
  UPDATE_DISCOUNT_LAB_SUCCESS,
  UPDATE_DISCOUNT_LAB_FAIL,
  UPDATE_DISCOUNT_ALL_LAB_SUCCESS,
  UPDATE_DISCOUNT_ALL_LAB_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  discountLabs: [],
  error: {},
};

const discountlab = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DISCOUNT_LAB_SUCCESS:
      return {
        ...state,
        discountLabs: action.payload.data,
      };

    case GET_DISCOUNT_LAB_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case UPDATE_DISCOUNT_LAB_SUCCESS:
      return {
        ...state,
        discountLabs: state.discountLabs.map(discountLabs =>
          discountLabs.id.toString() === action.payload.id.toString()
            ? { discountLabs, ...action.payload }
            : discountLabs
        ),
      };
    case UPDATE_DISCOUNT_LAB_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case UPDATE_DISCOUNT_ALL_LAB_SUCCESS:
        return {
          ...state,
          discountLabs: state.discountLabs.map(discountLabs =>
            discountLabs.id.toString() === action.payload.id.toString()
              ? { discountLabs, ...action.payload }
              : discountLabs
          ),
        };
  
      case UPDATE_DISCOUNT_ALL_LAB_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    default:
      return state;
  }
};

export default discountlab;
