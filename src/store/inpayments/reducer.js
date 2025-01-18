import {
  GET_ACCEPTED_LAB_ADVERTISEMENTS_SUCCESS,
  GET_ACCEPTED_LAB_ADVERTISEMENTS_FAIL,
  GET_LABS_SUCCESS,
  GET_LABS_FAIL,
  GET_DONORS_SUCCESS,
  GET_DONORS_FAIL,
  GET_IN_PAYMENT_SUCCESS,
  GET_IN_PAYMENT_FAIL,
  ADD_IN_PAYMENT_SUCCESS,
  ADD_IN_PAYMENT_FAIL,
  GET_STAFF_PROFILE_SUCCESS,
  GET_STAFF_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  staffProfiles: [],
  advertisements: [],
  inPayments: [],
  inPayment: [],
  labs: [],
  donors: {},
  error: {},
};

const inPayments = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_STAFF_PROFILE_SUCCESS:
      return {
        ...state,
        staffProfiles: action.payload.data,
      };

    case GET_STAFF_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_ACCEPTED_LAB_ADVERTISEMENTS_SUCCESS:
      return {
        ...state,
        advertisements: action.payload.data,
      };

    case GET_ACCEPTED_LAB_ADVERTISEMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_LABS_SUCCESS:
      return {
        ...state,
        labs: action.payload.data,
      };

    case GET_LABS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_DONORS_SUCCESS:
      return {
        ...state,
        donors: action.payload.data,
      };

    case GET_DONORS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_IN_PAYMENT_SUCCESS:
      return {
        ...state,
        inPayments: action.payload.data,
      };

    case GET_IN_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };                

    case ADD_IN_PAYMENT_SUCCESS:
      return {
        ...state,
        inPayments: [...state.inPayments, action.payload.data],
      };

    case ADD_IN_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default inPayments;
