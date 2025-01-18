import {
  GET_BANKACCOUNTS_SUCCESS,
  GET_BANKACCOUNTS_FAIL,

  UPDATE_BANKACCOUNT_SUCCESS,
  UPDATE_BANKACCOUNT_FAIL,
  // DELETE_BANKACCOUNT_SUCCESS,
  // DELETE_BANKACCOUNT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  bankaccounts: [],
  error: {},
};

const bankaccounts = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BANKACCOUNTS_SUCCESS:
      return {
        ...state,
        bankaccounts: action.payload.data,
      };

    case GET_BANKACCOUNTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_BANKACCOUNT_SUCCESS:
      return {
        ...state,
        bankaccounts: state.bankaccounts.map(bankaccount =>
          bankaccount.id.toString() === action.payload.id.toString()
            ? { bankaccount, ...action.payload }
            : bankaccount
        ),
      };

    case UPDATE_BANKACCOUNT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // case DELETE_BANKACCOUNT_SUCCESS:
    //   return {
    //     ...state,
    //     bankaccounts: state.bankaccounts.filter(
    //       bankaccount =>
    //         bankaccount.id.toString() !== action.payload.id.toString()
    //     ),
    //   };

    // case DELETE_BANKACCOUNT_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    default:
      return state;
  }
};

export default bankaccounts;
