import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_DONOR_PROFILE, UPDATE_DONOR_PROFILE } from "./actionTypes";

import {
  getDonorProfileSuccess,
  getDonorProfileFail,
  updateDonorProfileSuccess,
  updateDonorProfileFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getDonorProfile,
  updateDonorProfile,
} from "../../../helpers/django_api_helper";

function* fetchDonorProfile(object) {
  try {
    const response = yield call(getDonorProfile, object.payload);
    console.log("response: ", response);
    yield put(getDonorProfileSuccess(response));
  } catch (error) {
    yield put(getDonorProfileFail(error));
  }
}

function* onUpdateDonorProfile({ payload: { donorProfile, id } }) {
  try {
    const response = yield call(updateDonorProfile, donorProfile, id);
    yield put(updateDonorProfileSuccess(response));
  } catch (error) {
    yield put(updateDonorProfileFail(error));
  }
}

function* donorProfileSaga() {
  yield takeEvery(GET_DONOR_PROFILE, fetchDonorProfile);
  yield takeEvery(UPDATE_DONOR_PROFILE, onUpdateDonorProfile);
}

export default donorProfileSaga;
