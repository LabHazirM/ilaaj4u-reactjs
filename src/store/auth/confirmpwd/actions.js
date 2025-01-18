import {
  CONFIRM_PASSWORD,
  CONFIRM_PASSWORD_SUCCESS,
  CONFIRM_PASSWORD_ERROR,
} from "./actionTypes";

export const userConfirmPassword = (user, token) => {
  return {
    type: CONFIRM_PASSWORD,
    payload: { user, token },
  };
};

export const userConfirmPasswordSuccess = message => {
  return {
    type: CONFIRM_PASSWORD_SUCCESS,
    payload: message,
  };
};

export const userConfirmPasswordError = message => {
  return {
    type: CONFIRM_PASSWORD_ERROR,
    payload: message,
  };
};
