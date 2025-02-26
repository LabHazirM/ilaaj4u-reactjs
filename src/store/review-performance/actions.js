import {
  GET_REVIEW_PERFORMANCE,
  GET_REVIEW_PERFORMANCE_FAIL,
  GET_REVIEW_PERFORMANCE_SUCCESS,
  GET_REVIEW_PERFORMANCE_TEST,
  GET_REVIEW_PERFORMANCE_TEST_SUCCESS,
  GET_REVIEW_PERFORMANCE_TEST_FAIL
} from "./actionTypes";

export const getReviewPerformance = (start_date, end_date) => {
  console.log("Dispatching action with start_date and end_date:", start_date, end_date);
  return {
    type: GET_REVIEW_PERFORMANCE,
    payload: { start_date, end_date },
  };
};

export const getReviewPerformanceSuccess = (ReviewPerformance) => {
  console.log("Dispatching success action with ReviewPerformance data:", ReviewPerformance);
  return {
    type: GET_REVIEW_PERFORMANCE_SUCCESS,
    payload: ReviewPerformance,
  };
};

export const getReviewPerformanceFail = (error) => {
  console.log("Dispatching fail action with error:", error);
  return {
    type: GET_REVIEW_PERFORMANCE_FAIL,
    payload: error,
  };
};

export const getReviewPerformanceTest = (start_date, end_date) => {
  console.log("Dispatching action with start_date and end_date:", start_date, end_date);
  return {
    type: GET_REVIEW_PERFORMANCE_TEST,
    payload: { start_date, end_date },
  };
};

export const getReviewPerformanceTestSuccess = (ReviewPerformanceTest) => {
  console.log("Dispatching success action with ReviewPerformance data:", ReviewPerformanceTest);
  return {
    type: GET_REVIEW_PERFORMANCE_TEST_SUCCESS,
    payload: ReviewPerformanceTest,
  };
};

export const getReviewPerformanceTestFail = (error) => {
  console.log("Dispatching fail action with error:", error);
  return {
    type: GET_REVIEW_PERFORMANCE_TEST_FAIL,
    payload: error,
  };
};
