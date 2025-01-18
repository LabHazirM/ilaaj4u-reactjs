import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_FEEDBACKS, GET_LAB_PROFILE } from "./actionTypes";

import { getFeedbacksSuccess, getFeedbacksFail, getLabProfileFail, getLabProfileSuccess } from "./actions";

//Include Both Helper File with needed methods
import { getFeedbacks, getLabProfile } from "../../helpers/django_api_helper";

function* fetchFeedbacks(object) {
  try {
    const response = yield call(getFeedbacks, object.payload);
    yield put(getFeedbacksSuccess(response.data));
  } catch (error) {
    yield put(getFeedbacksFail(error));
  }
}

function* fetchLabProfile(object) {
  try {
    const response = yield call(getLabProfile, object.payload);
    yield put(getLabProfileSuccess(response));
  } catch (error) {
    yield put(getLabProfileFail(error));
  }
}
function* feedbacksSaga() {
  yield takeEvery(GET_FEEDBACKS, fetchFeedbacks);
  yield takeEvery(GET_LAB_PROFILE, fetchLabProfile);
}

export default feedbacksSaga;
