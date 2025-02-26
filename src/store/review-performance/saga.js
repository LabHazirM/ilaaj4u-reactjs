import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_REVIEW_PERFORMANCE, GET_REVIEW_PERFORMANCE_TEST } from "./actionTypes";

import { getReviewPerformanceSuccess, getReviewPerformanceFail, getReviewPerformanceTestSuccess, getReviewPerformanceTestFail } from "./actions";

//Include Both Helper File with needed methods
import { getReviewPerformance, getReviewPerformanceTest } from "../../helpers/django_api_helper";

function* fetchReviewPerformance(object) {
  console.log("Fetching review performance with payload:", object.payload);
  try {
    const response = yield call(getReviewPerformance, object.payload.start_date, object.payload.end_date);
    console.log("Full API response received:", response);

    if (response?.status === 200 && response?.total_labs !== undefined) {
      console.log("Review performance data received:", response);
      yield put(getReviewPerformanceSuccess(response)); // Send full response
    } else {
      console.log("Unexpected response structure:", response);
      yield put(getReviewPerformanceFail("Invalid response structure"));
    }
    
  } catch (error) {
    console.log("Error fetching review performance:", error);
    yield put(getReviewPerformanceFail(error));
  }
}

function* fetchReviewPerformanceTest(object) {
  console.log("Fetching review performance with payload:", object.payload);
  try {
    const response = yield call(getReviewPerformanceTest, object.payload.start_date, object.payload.end_date);
    console.log("Full API response received:", response);

    if (response?.status === 200 && response?.total_offered_tests !== undefined) {
      console.log("Review performance data received:", response);
      yield put(getReviewPerformanceTestSuccess(response)); // Send full response
    } else {
      console.log("Unexpected response structure:", response);
      yield put(getReviewPerformanceTestFail("Invalid response structure"));
    }
    
  } catch (error) {
    console.log("Error fetching review performance:", error);
    yield put(getReviewPerformanceTestFail(error));
  }
}

function* ReviewPerformanceSaga() {
  yield takeEvery(GET_REVIEW_PERFORMANCE, fetchReviewPerformance);
  yield takeEvery(GET_REVIEW_PERFORMANCE_TEST, fetchReviewPerformanceTest);

}

export default ReviewPerformanceSaga;
