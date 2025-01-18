import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_LAB_NAMES_LIST } from "./actionTypes";

import {
  getLabNamesListSuccess,
  getLabNamesListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getLabNamesList } from "../../helpers/django_api_helper";

function* fetchLabNamesList(object) {
  try {
    const response = yield call(getLabNamesList, object.payload);
    yield put(getLabNamesListSuccess(response));
  } catch (error) {
    yield put(getLabNamesListFail(error));
  }
}

function* LabNamesListSaga() {
  yield takeEvery(
    GET_LAB_NAMES_LIST,
    fetchLabNamesList
  );
}

export default LabNamesListSaga;