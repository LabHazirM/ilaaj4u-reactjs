import {
  GET_LAB_PAYMENTS_SUCCESS,
  GET_LAB_PAYMENTS_FAIL,
  UPDATE_LAB_PAYMENTS_SUCCESS,
  UPDATE_LAB_PAYMENTS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  labPayments: [],
  error: "",
  success: "",
};

const labPayments = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LAB_PAYMENTS_SUCCESS:
      return {
        ...state,
        success: action.payload.data,
      };

    case GET_LAB_PAYMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_LAB_PAYMENTS_SUCCESS:
      return {
        ...state,
        labPayments: state.labPayments.map(labPayments =>
          labPayments.id.toString() === action.payload.id.toString()
            ? { labPayments, ...action.payload }
            : labPayments
        ),
      };

    case UPDATE_LAB_PAYMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default labPayments;
