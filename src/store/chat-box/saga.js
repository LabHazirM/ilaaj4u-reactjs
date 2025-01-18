import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_MSGS,
  ADD_NEW_MSG,
} from "./actionTypes";

import {
  getMsgsSuccess,
  getMsgsFail,
  addMsgFail,
  addMsgSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getMsgs,
  addNewMsg,
} from "../../helpers/django_api_helper";

function* fetchMsgs(object) {
  try {
    const response = yield call(getMsgs, object.payload);
    yield put(getMsgsSuccess(response));
  } catch (error) {
    yield put(getMsgsFail(error));
  }
}

function* onAddNewMsg(object) {
  try {
    const response = yield call(
      addNewMsg,
      object.payload.msg,
      object.payload.id
    );
    yield put(addMsgSuccess(response));
  } catch (error) {
    yield put(addMsgFail(error));
  }
}

function* msgsSaga() {
  yield takeEvery(GET_MSGS, fetchMsgs);
  yield takeEvery(ADD_NEW_MSG, onAddNewMsg);
}

export default msgsSaga;
