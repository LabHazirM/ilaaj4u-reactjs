import {
  GET_SHARED_PERCENTAGE_PENDING_FEE,
  GET_SHARED_PERCENTAGE_PENDING_FEE_FAIL,
  GET_SHARED_PERCENTAGE_PENDING_FEE_SUCCESS, 
  GET_SHARED_PERCENTAGE_APPROVED_FEE,
  GET_SHARED_PERCENTAGE_APPROVED_FEE_FAIL,
  GET_SHARED_PERCENTAGE_APPROVED_FEE_SUCCESS,
  UPDATE_SHARED_PERCENTAGE_PENDING_FEE,
  UPDATE_SHARED_PERCENTAGE_PENDING_FEE_SUCCESS,
  UPDATE_SHARED_PERCENTAGE_PENDING_FEE_FAIL,
  UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE,
  UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE_SUCCESS,
  UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE_FAIL,
} from "./actionTypes";

export const getSharedPercentageApprovedFeeTests = id => ({
  type: GET_SHARED_PERCENTAGE_APPROVED_FEE,
  payload: id,
});

export const getSharedPercentageApprovedFeeTestsSuccess = sharedPercentageApprovedFeeTest => ({
  type: GET_SHARED_PERCENTAGE_APPROVED_FEE_SUCCESS,
  payload: sharedPercentageApprovedFeeTest,
});

export const getSharedPercentageApprovedFeeTestsFail = error => ({
  type: GET_SHARED_PERCENTAGE_APPROVED_FEE_FAIL,
  payload: error,
});
export const getSharedPercentagePendingFeeTests = id => ({
  type: GET_SHARED_PERCENTAGE_PENDING_FEE,
  payload: id,
});

export const getSharedPercentagePendingFeeTestsSuccess = sharedPercentagePendingFeeTest => ({
  type: GET_SHARED_PERCENTAGE_PENDING_FEE_SUCCESS,
  payload: sharedPercentagePendingFeeTest,
});

export const getSharedPercentagePendingFeeTestsFail = error => ({
  type: GET_SHARED_PERCENTAGE_PENDING_FEE_FAIL,
  payload: error,
});

export const updateSharedPercentagePendingFeeTest = sharedPercentagePendingFeeTest => ({
  type: UPDATE_SHARED_PERCENTAGE_PENDING_FEE,
  payload: sharedPercentagePendingFeeTest,
});

export const updateSharedPercentagePendingFeeTestSuccess = sharedPercentagePendingFeeTest => ({
  type: UPDATE_SHARED_PERCENTAGE_PENDING_FEE_SUCCESS,
  payload: sharedPercentagePendingFeeTest,
});

export const updateSharedPercentagePendingFeeTestFail = error => ({
  type: UPDATE_SHARED_PERCENTAGE_PENDING_FEE_FAIL,
  payload: error,
});

export const updateSharedPercentageAllPendingFeeTest = sharedPercentageAllPendingFeeTest => ({
  type: UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE,
  payload: sharedPercentageAllPendingFeeTest,
});

export const updateSharedPercentageAllPendingFeeTestSuccess = sharedPercentageAllPendingFeeTest => ({
  type: UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE_SUCCESS,
  payload: sharedPercentageAllPendingFeeTest,
});

export const updateSharedPercentageAllPendingFeeTestFail = error => ({
  type: UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE_FAIL,
  payload: error,
});
