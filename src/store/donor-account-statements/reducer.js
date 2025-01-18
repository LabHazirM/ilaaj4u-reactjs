import {
  GET_DONOR_ACCOUNT_STATEMENTS_SUCCESS,
  GET_DONOR_ACCOUNT_STATEMENTS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  donoraccountStatements: [],
  error: {},
};

const donoraccountStatements = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DONOR_ACCOUNT_STATEMENTS_SUCCESS:
      return {
        ...state,
        donoraccountStatements: action.payload.data,
      };

    case GET_DONOR_ACCOUNT_STATEMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default donoraccountStatements;
