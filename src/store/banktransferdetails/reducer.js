import {
  GET_BANKS_SUCCESS,
  GET_BANKS_FAIL,
  GET_BANK_ACCOUNTS_SUCCESS,
  GET_BANK_ACCOUNTS_FAIL,
  GET_BANK_TRANSFER_SUCCESS,
  GET_BANK_TRANSFER_FAIL,
  ADD_BANK_TRANSFER_SUCCESS,
  ADD_BANK_TRANSFER_FAIL,
  UPDATE_BANK_TRANSFER_SUCCESS,
  UPDATE_BANK_TRANSFER_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  bankTransfers: [],
  bankAccounts: [],
  banks: [],
  error: {},
};

const bankTransfers = (state = INIT_STATE, action) => {
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
    case GET_BANK_TRANSFER_SUCCESS:
      return {
        ...state,
        bankTransfers: action.payload.data,
      };

    case GET_BANK_TRANSFER_FAIL:
      return {
        ...state,
        error: action.payload,
      };                

    case ADD_BANK_TRANSFER_SUCCESS:
      return {
        ...state,
        bankTransfers: [...state.bankTransfers, action.payload.data],
      };

    case ADD_BANK_TRANSFER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_BANK_TRANSFER_SUCCESS:
      return {
        ...state,
        bankTransfers: state.bankTransfers.map(bankTransfer =>
          bankTransfer.id.toString() === action.payload.id.toString()
            ? { bankTransfer, ...action.payload }
            : bankTransfer
        ),
      };

    case UPDATE_BANK_TRANSFER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default bankTransfers;
