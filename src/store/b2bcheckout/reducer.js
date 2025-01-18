import {
  // GET_B2B_PAYMENTS_SUCCESS,
  // GET_B2B_PAYMENTS_FAIL,
  ADD_B2B_PAYMENT_SUCCESS,
  ADD_B2B_PAYMENT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  b2bPayments: [],
  error: {},
};

const b2bPayments = (state = INIT_STATE, action) => {
  switch (action.type) {
    // case GET_B2B_PAYMENTS_SUCCESS:
    //   return {
    //     ...state,
    //     b2bPayments: action.payload.data,
    //   };

    // case GET_B2B_PAYMENTS_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    case ADD_B2B_PAYMENT_SUCCESS:
      return {
        ...state,
        b2bPayments: [...state.b2bPayments, action.payload.data],
      };

    case ADD_B2B_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default b2bPayments;
