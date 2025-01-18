import {
  GET_BANK_STATEMENTS_SUCCESS,
  GET_BANK_STATEMENTS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  bankStatements: [],
  error: {},
};

const bankStatements = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BANK_STATEMENTS_SUCCESS:
      return {
        ...state,
        bankStatements: action.payload.data,
      };

    case GET_BANK_STATEMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default bankStatements;
