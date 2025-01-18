import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_B2B_ALL_CLIENTS_LIST } from "./actionTypes";

import {
  getB2bAllClientsListSuccess,
  getB2bAllClientsListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getB2bAllClientsList } from "../../helpers/django_api_helper";

function* fetchB2bAllClientsList(object) {
  try {
    const response = yield call(getB2bAllClientsList, object.payload);
    yield put(getB2bAllClientsListSuccess(response));
  } catch (error) {
    yield put(getB2bAllClientsListFail(error));
  }
}

function* B2bAllClientsSaga() {
  yield takeEvery(
    GET_B2B_ALL_CLIENTS_LIST,
    fetchB2bAllClientsList
  );
}

export default B2bAllClientsSaga;
