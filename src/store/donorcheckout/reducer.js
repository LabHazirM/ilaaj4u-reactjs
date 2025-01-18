import {
  // GET_DONOR_PAYMENTS_SUCCESS,
  // GET_DONOR_PAYMENTS_FAIL,
  ADD_DONOR_PAYMENT_SUCCESS,
  ADD_DONOR_PAYMENT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  donorPayments: [],
  error: {},
};

const donorPayments = (state = INIT_STATE, action) => {
  switch (action.type) {
    // case GET_DONOR_PAYMENTS_SUCCESS:
    //   return {
    //     ...state,
    //     donorPayments: action.payload.data,
    //   };

    // case GET_DONOR_PAYMENTS_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    case ADD_DONOR_PAYMENT_SUCCESS:
      return {
        ...state,
        donorPayments: [...state.donorPayments, action.payload.data],
      };

    case ADD_DONOR_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default donorPayments;
