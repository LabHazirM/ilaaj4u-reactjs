import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_B2B_PROFILE, UPDATE_B2B_PROFILE } from "./actionTypes";

import {
  getB2bProfileSuccess,
  getB2bProfileFail,
  updateB2bProfileSuccess,
  updateB2bProfileFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getB2bProfile,
  updateB2bProfile,
} from "../../../helpers/django_api_helper";

function* fetchB2bProfile(object) {
  try {
    const response = yield call(getB2bProfile, object.payload);
    yield put(getB2bProfileSuccess(response));
  } catch (error) {
    yield put(getB2bProfileFail(error));
  }
}

function* onUpdateB2bProfile({ payload: { b2bProfile, id } }) {
  try {
    const response = yield call(updateB2bProfile, b2bProfile, id);
    yield put(updateB2bProfileSuccess(response));
  } catch (error) {
    yield put(updateB2bProfileFail(error));
  }
}

function* b2bProfileSaga() {
  yield takeEvery(GET_B2B_PROFILE, fetchB2bProfile);
  yield takeEvery(UPDATE_B2B_PROFILE, onUpdateB2bProfile);
}

export default b2bProfileSaga;
