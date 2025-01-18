import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_TEST_DESCRIPTIONS,
} from "./actionTypes";

import {
  getTestDescriptionsSuccess,
  getTestDescriptionsFail,

} from "./actions";

//Include Both Helper File with needed methods
import {
  getTestDescriptions,
} from "../../helpers/django_api_helper";

function* fetchTestDescriptions(object) {
  try {
    const response = yield call(getTestDescriptions, object.payload);
    yield put(getTestDescriptionsSuccess(response));
  } catch (error) {
    yield put(getTestDescriptionsFail(error));
  }
}

function* testDescriptionsSaga() {
  yield takeEvery(GET_TEST_DESCRIPTIONS, fetchTestDescriptions);
}

export default testDescriptionsSaga;
