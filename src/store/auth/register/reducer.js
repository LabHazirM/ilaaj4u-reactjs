import {
  REGISTER_USER,
  REGISTER_USER_SUCCESSFUL,
  REGISTER_USER_FAILED,
} from "./actionTypes";

const initialState = {
  // emailError: null,
  usernameError: null,
  passwordError: null,
  incompleteRegistrationError: null,
  message: null,
  loading: false,
};

const account = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER:
      state = {
        ...state,
        userID: null,
        userAccountType: null,
        loading: true,
        // emailError: null,
        usernameError: null,
        passwordError: null,
        incompleteRegistrationError: null,
      };
      break;
    case REGISTER_USER_SUCCESSFUL:
      console.log(state = {
        ...state,
        loading: false,
        userID: action.payload.id,
        userAccountType: action.payload.account_type,
        // emailError: null,
        usernameError: null,
        passwordError: null,
        incompleteRegistrationError: null,
      });
      break;
    case REGISTER_USER_FAILED:
      state = {
        ...state,
        userID: null,
        userAccountType: null,
        loading: false,
        // emailError: action.payload.email,
        usernameError: action.payload.username,
        passwordError: action.payload.password,
        incompleteRegistrationError: action.payload.error,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default account;
