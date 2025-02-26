import {
  GET_REVIEW_PERFORMANCE_SUCCESS,
  GET_REVIEW_PERFORMANCE_FAIL,
  GET_REVIEW_PERFORMANCE_TEST_SUCCESS,
  GET_REVIEW_PERFORMANCE_TEST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  ReviewPerformance: [],
  ReviewPerformanceTest: [],
  error: {},
};

const ReviewPerformance = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_REVIEW_PERFORMANCE_SUCCESS:
  console.log("Payload received in reducer:", action.payload);
  return {
    ...state,
    ReviewPerformance: action.payload, // Store the whole payload
  };

    case GET_REVIEW_PERFORMANCE_FAIL:
      console.log("error Payload received in reducer:", action.payload);
      return {
        ...state,
        error: action.payload,
      };

    case GET_REVIEW_PERFORMANCE_TEST_SUCCESS:
      console.log("Payload tests received in reducer:", action.payload);
      return {
        ...state,
        ReviewPerformanceTest: action.payload, // Store the whole payload
      };
    
    case GET_REVIEW_PERFORMANCE_TEST_FAIL:
      console.log("error Payload received in reducer:", action.payload);
      return {
        ...state,
        error: action.payload,
      };
            
    default:
      return state;
  }
};

export default ReviewPerformance;
 