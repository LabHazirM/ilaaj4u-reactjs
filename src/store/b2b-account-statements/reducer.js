import {
  GET_B2B_ACCOUNT_STATEMENTS_SUCCESS,
  GET_B2B_ACCOUNT_STATEMENTS_FAIL,
  GET_CLAB_ACCOUNT_STATEMENTS_SUCCESS,
  GET_CLAB_ACCOUNT_STATEMENTS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  b2baccountStatements: [],
  error: {},
};

const b2baccountStatements = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_B2B_ACCOUNT_STATEMENTS_SUCCESS:
      return {
        ...state,
        b2baccountStatements: action.payload.data,
      };

    case GET_B2B_ACCOUNT_STATEMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_CLAB_ACCOUNT_STATEMENTS_SUCCESS:
      return {
        ...state,
        b2baccountStatements: action.payload.data,
      };

    case GET_CLAB_ACCOUNT_STATEMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default b2baccountStatements;
