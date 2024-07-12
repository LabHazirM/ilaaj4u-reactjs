import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_LABS_TESTING } from "./actionTypes";

import { getLabsTestingSuccess, getLabsTestingFail } from "./actions";

//Include Both Helper File with needed methods
import { getLabsTesting } from "../../helpers/django_api_helper";

function* fetchLabsTesting(object) {
  try {
    const response = yield call(getLabsTesting, object.payload);
    yield put(getLabsTestingSuccess(response.data));
  } catch (error) {
    yield put(getLabsTestingFail(error));
  }
}
function* labsTestingSaga() {
  yield takeEvery(GET_LABS_TESTING, fetchLabsTesting);
}

export default labsTestingSaga;
