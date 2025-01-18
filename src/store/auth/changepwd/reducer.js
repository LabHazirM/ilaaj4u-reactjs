import {
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
} from "./actionTypes";

const initialState = {
  changeSuccessMsg: null,
  changeError: null,
};

const changePassword = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_PASSWORD:
      state = {
        ...state,
        changeSuccessMsg: null,
        changeError: null,
      };
      break;
    case CHANGE_PASSWORD_SUCCESS:
      state = {
        ...state,
        changeSuccessMsg: action.payload,
        changeError: null,
      };
      break;
    case CHANGE_PASSWORD_ERROR:
      state = { ...state, changeError: action.payload.old_password };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default changePassword;
