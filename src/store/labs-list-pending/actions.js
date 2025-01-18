import {
  GET_LABS_LIST_PENDING_FEE,
  GET_LABS_LIST_PENDING_FEE_SUCCESS,
  GET_LABS_LIST_PENDING_FEE_FAIL,
  GET_LABS_LIST_APPROVED_FEE,
  GET_LABS_LIST_APPROVED_FEE_SUCCESS,
  GET_LABS_LIST_APPROVED_FEE_FAIL,
} from "./actionTypes";
export const getLabsListApprovedFee = () => ({
  type: GET_LABS_LIST_APPROVED_FEE,
  payload: {},
});

export const getLabsListApprovedFeeSuccess =
  labsListApprovedFee => ({
    type: GET_LABS_LIST_APPROVED_FEE_SUCCESS,
    payload: labsListApprovedFee,
  });

export const getLabsListApprovedFeeFail = error => ({
  type: GET_LABS_LIST_APPROVED_FEE_FAIL,
  payload: error,
});

export const getLabsListPendingFee = () => ({
  type: GET_LABS_LIST_PENDING_FEE,
  payload: {},
});

export const getLabsListPendingFeeSuccess =
  labsListPendingFee => ({
    type: GET_LABS_LIST_PENDING_FEE_SUCCESS,
    payload: labsListPendingFee,
  });

export const getLabsListPendingFeeFail = error => ({
  type: GET_LABS_LIST_PENDING_FEE_FAIL,
  payload: error,
});
