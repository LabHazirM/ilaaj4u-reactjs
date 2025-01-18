import {
  GET_DONORS_ACCOUNT_STATEMENTS_SUCCESS,
  GET_DONORS_ACCOUNT_STATEMENTS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  donorsaccountStatements: [],
  error: {},
};

const donoraccountStatements = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DONORS_ACCOUNT_STATEMENTS_SUCCESS:
      return {
        ...state,
        donorsaccountStatements: action.payload.data,
      };

    case GET_DONORS_ACCOUNT_STATEMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default donoraccountStatements;
