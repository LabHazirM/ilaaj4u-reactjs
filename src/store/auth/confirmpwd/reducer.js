import {
  CONFIRM_PASSWORD,
  CONFIRM_PASSWORD_SUCCESS,
  CONFIRM_PASSWORD_ERROR,
} from "./actionTypes";

const initialState = {
  confirmSuccessMsg: null,
  confirmError: null,
};

const confirmPassword = (state = initialState, action) => {
  switch (action.type) {
    case CONFIRM_PASSWORD:
      state = {
        ...state,
        confirmSuccessMsg: null,
        confirmError: null,
      };
      break;
    case CONFIRM_PASSWORD_SUCCESS:
      state = {
        ...state,
        confirmSuccessMsg: action.payload,
      };
      break;
    case CONFIRM_PASSWORD_ERROR:
      state = { ...state, confirmError: action.payload };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default confirmPassword;
