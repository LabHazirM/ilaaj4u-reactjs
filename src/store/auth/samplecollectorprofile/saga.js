import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_SAMPLE_COLLECTOR_PROFILE, UPDATE_SAMPLE_COLLECTOR_PROFILE } from "./actionTypes";

import {
  getSampleCollectorProfileSuccess,
  getSampleCollectorProfileFail,
  updateSampleCollectorProfileSuccess,
  updateSampleCollectorProfileFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getSampleCollectorProfile,
  updateSampleCollectorProfile,
} from "../../../helpers/django_api_helper";

function* fetchSampleCollectorProfile(object) {
  try {
    const response = yield call(getSampleCollectorProfile, object.payload);
    yield put(getSampleCollectorProfileSuccess(response));
  } catch (error) {
    yield put(getSampleCollectorProfileFail(error));
  }
}

function* onUpdateSampleCollectorProfile({ payload: { sampleCollectorProfile, id } }) {
  try {
    const response = yield call(updateSampleCollectorProfile, sampleCollectorProfile, id);
    yield put(updateSampleCollectorProfileSuccess(response));
  } catch (error) {
    yield put(updateSampleCollectorProfileFail(error));
  }
}

function* sampleCollectorProfileSaga() {
  yield takeEvery(GET_SAMPLE_COLLECTOR_PROFILE, fetchSampleCollectorProfile);
  yield takeEvery(UPDATE_SAMPLE_COLLECTOR_PROFILE, onUpdateSampleCollectorProfile);
}

export default sampleCollectorProfileSaga;
