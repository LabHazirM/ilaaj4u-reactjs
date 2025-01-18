import {
  // GET_CREATE_BANKS_SUCCESS,
  // GET_CREATE_BANKS_FAIL,
  ADD_CREATE_BANK_SUCCESS,
  ADD_CREATE_BANK_FAIL,
  GET_BANKS_SUCCESS,
  GET_BANKS_FAIL,
  UPDATE_BANK_SUCCESS,
  UPDATE_BANK_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  createBanks: [],
  bank: [],
  banks: [],
  error: {},
};

const createBanks = (state = INIT_STATE, action) => {
  switch (action.type) {
    // case GET_CREATE_BANKS_SUCCESS:
    //   return {
    //     ...state,
    //     createBanks: action.payload.data,
    //   };

    // case GET_CREATE_BANKS_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };
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

    case ADD_CREATE_BANK_SUCCESS:
      return {
        ...state,
        createBanks: [...state.createBanks, action.payload.data],
      };

    case ADD_CREATE_BANK_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    
    case UPDATE_BANK_SUCCESS:
      return {
        ...state,
        banks: state.banks.map(bank =>
          bank.id.toString() === action.payload.id.toString()
            ? { bank, ...action.payload }
            : bank
        ),
      };

    case UPDATE_BANK_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default createBanks;
