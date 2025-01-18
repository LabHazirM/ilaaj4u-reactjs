import {
  GET_MSGS,
  GET_MSGS_FAIL,
  GET_MSGS_SUCCESS,
  ADD_NEW_MSG,
  ADD_MSG_SUCCESS,
  ADD_MSG_FAIL,
} from "./actionTypes";

export const getMsgs = id => ({
  type: GET_MSGS,
  payload: id,
});

export const getMsgsSuccess = msgs => ({
  type: GET_MSGS_SUCCESS,
  payload: msgs,
});

export const getMsgsFail = error => ({
  type: GET_MSGS_FAIL,
  payload: error,
});

export const addNewMsg = (msg, id) => ({
  type: ADD_NEW_MSG,
  payload: { msg, id },
});

export const addMsgSuccess = msg => ({
  type: ADD_MSG_SUCCESS,
  payload: msg,
});

export const addMsgFail = error => ({
  type: ADD_MSG_FAIL,
  payload: error,
});
