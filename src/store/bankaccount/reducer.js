import {
  GET_BANK_ACCOUNTS_SUCCESS,
  GET_BANK_ACCOUNTS_FAIL,
  GET_BANKS_SUCCESS,
  GET_BANKS_FAIL,
  ADD_BANK_ACCOUNT_SUCCESS,
  ADD_BANK_ACCOUNT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  bankAccounts: [],
  banks: [],
  error: {},
};

const bankAccounts = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BANK_ACCOUNTS_SUCCESS:
      return {
        ...state,
        bankAccounts: action.payload.data,
      };

    case GET_BANK_ACCOUNTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_BANKS_SUCCESS:
      return {
        ...state,
        banks: action.payload.data,
      };

    case GET_BANKS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_BANK_ACCOUNT_SUCCESS:
      return {
        ...state,
        bankAccounts: [...state.bankAccounts, action.payload.data],
      };

    case ADD_BANK_ACCOUNT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default bankAccounts;
