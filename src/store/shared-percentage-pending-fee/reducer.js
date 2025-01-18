import {
  GET_SHARED_PERCENTAGE_PENDING_FEE_SUCCESS,
  GET_SHARED_PERCENTAGE_PENDING_FEE_FAIL,
  GET_SHARED_PERCENTAGE_APPROVED_FEE_SUCCESS,
  GET_SHARED_PERCENTAGE_APPROVED_FEE_FAIL,
  UPDATE_SHARED_PERCENTAGE_PENDING_FEE_SUCCESS,
  UPDATE_SHARED_PERCENTAGE_PENDING_FEE_FAIL,
  UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE_SUCCESS,
  UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  sharedPercentagePendingFeeTests: [],
  sharedPercentageApprovedFeeTests: [],
  error: {},
};

const sharedPercentagePendingFeeTests = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SHARED_PERCENTAGE_PENDING_FEE_SUCCESS:
      return {
        ...state,
        sharedPercentagePendingFeeTests: action.payload.data,
      };

    case GET_SHARED_PERCENTAGE_PENDING_FEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_SHARED_PERCENTAGE_APPROVED_FEE_SUCCESS:
      return {
        ...state,
        sharedPercentageApprovedFeeTests: action.payload.data,
      };

    case GET_SHARED_PERCENTAGE_APPROVED_FEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
  

    case UPDATE_SHARED_PERCENTAGE_PENDING_FEE_SUCCESS:
      return {
        ...state,
        sharedPercentagePendingFeeTests: state.sharedPercentagePendingFeeTests.map(sharedPercentagePendingFeeTest =>
          sharedPercentagePendingFeeTest.id.toString() === action.payload.id.toString()
            ? { sharedPercentagePendingFeeTest, ...action.payload }
            : sharedPercentagePendingFeeTest
        ),
      };

    case UPDATE_SHARED_PERCENTAGE_PENDING_FEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE_SUCCESS:
      return {
        ...state,
        sharedPercentagePendingFeeTests: state.sharedPercentagePendingFeeTests.map(sharedPercentageAllPendingFeeTest =>
          sharedPercentageAllPendingFeeTest.id.toString() === action.payload.id.toString()
            ? { sharedPercentageAllPendingFeeTest, ...action.payload }
            : sharedPercentageAllPendingFeeTest
        ),
      };

    case UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default sharedPercentagePendingFeeTests;
