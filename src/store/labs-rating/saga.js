import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_LABS_RATING } from "./actionTypes";

import { getLabsRatingSuccess, getLabsRatingFail } from "./actions";

//Include Both Helper File with needed methods
import { getLabsRating } from "../../helpers/django_api_helper";

function* fetchLabsRating(object) {
  try {
    const response = yield call(getLabsRating, object.payload);
    yield put(getLabsRatingSuccess(response.data));
  } catch (error) {
    yield put(getLabsRatingFail(error));
  }
}
function* labsRatingSaga() {
  yield takeEvery(GET_LABS_RATING, fetchLabsRating);
}

export default labsRatingSaga;
