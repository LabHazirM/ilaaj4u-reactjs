import {
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
} from "./actionTypes";

export const userChangePassword = user => {
  return {
    type: CHANGE_PASSWORD,
    payload: { user },
  };
};

export const userChangePasswordSuccess = message => {
  return {
    type: CHANGE_PASSWORD_SUCCESS,
    payload: message,
  };
};

export const userChangePasswordError = message => {
  return {
    type: CHANGE_PASSWORD_ERROR,
    payload: message,
  };
};
