import {
  GET_REFERREL_FEES,
  GET_REFERREL_FEES_FAIL,
  GET_REFERREL_FEES_SUCCESS, 
  GET_PUT_REFERREL_FEES,
  GET_PUT_REFERREL_FEES_FAIL,
  GET_PUT_REFERREL_FEES_SUCCESS, 
  UPDATE_REFERREL_FEE,
  UPDATE_REFERREL_FEE_SUCCESS,
  UPDATE_REFERREL_FEE_FAIL,
  UPDATE_REFERREL_ALL_FEE,
  UPDATE_REFERREL_ALL_FEE_SUCCESS,
  UPDATE_REFERREL_ALL_FEE_FAIL,
} from "./actionTypes";
export const getPutReferrelFeeLabs = (test_name) => ({
  type: GET_PUT_REFERREL_FEES,
  payload: {test_name},
});

export const getPutReferrelFeeLabsSuccess = ReferrelFeeLabs => ({
  type: GET_PUT_REFERREL_FEES_SUCCESS,
  payload: ReferrelFeeLabs,
});

export const getPutReferrelFeeLabsFail = error => ({
  type: GET_PUT_REFERREL_FEES_FAIL,
  payload: error,
});
export const getReferrelFeeLabs = id => ({
  type: GET_REFERREL_FEES,
  payload: id,
});

export const getReferrelFeeLabsSuccess = ReferrelFeeLabs => ({
  type: GET_REFERREL_FEES_SUCCESS,
  payload: ReferrelFeeLabs,
});

export const getReferrelFeeLabsFail = error => ({
  type: GET_REFERREL_FEES_FAIL,
  payload: error,
});

export const updateReferrelFeeLab = ReferrelFeeLab => ({
  type: UPDATE_REFERREL_FEE,
  payload: ReferrelFeeLab,
});

export const updateReferrelFeeLabSuccess = ReferrelFeeLab => ({
  type: UPDATE_REFERREL_FEE_SUCCESS,
  payload: ReferrelFeeLab,
});

export const updateReferrelFeeLabFail = error => ({
  type: UPDATE_REFERREL_FEE_FAIL,
  payload: error,
});

export const updateReferrelAllFeeLab = ReferrelFeeLab => ({
  type: UPDATE_REFERREL_ALL_FEE,
  payload: ReferrelFeeLab,
});

export const updateReferrelAllFeeLabSuccess = ReferrelFeeLab => ({
  type: UPDATE_REFERREL_ALL_FEE_SUCCESS,
  payload: ReferrelFeeLab,
});

export const updateReferrelAllFeeLabFail = error => ({
  type: UPDATE_REFERREL_ALL_FEE_FAIL,
  payload: error,
});
