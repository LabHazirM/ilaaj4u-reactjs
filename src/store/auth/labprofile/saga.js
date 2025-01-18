import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_LAB_PROFILE, UPDATE_LAB_PROFILE } from "./actionTypes";

import {
  getLabProfileSuccess,
  getLabProfileFail,
  updateLabProfileSuccess,
  updateLabProfileFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getLabProfile,
  updateLabProfile,
} from "../../../helpers/django_api_helper";

function* fetchLabProfile(object) {
  try {
    const response = yield call(getLabProfile, object.payload);
    yield put(getLabProfileSuccess(response));
  } catch (error) {
    yield put(getLabProfileFail(error));
  }
}

function* onUpdateLabProfile({ payload: { labProfile, id } }) {
  try {
    const response = yield call(updateLabProfile, labProfile, id);
    yield put(updateLabProfileSuccess(response));
  } catch (error) {
    yield put(updateLabProfileFail(error));
  }
}

function* labProfileSaga() {
  yield takeEvery(GET_LAB_PROFILE, fetchLabProfile);
  yield takeEvery(UPDATE_LAB_PROFILE, onUpdateLabProfile);
}

export default labProfileSaga;
