import {
  GET_LABS,
  GET_LABS_SUCCESS,
  GET_LABS_FAIL,
  GET_B2B_LAB_SHARES_LIST,
  GET_B2B_LAB_SHARES_LIST_SUCCESS,
  GET_B2B_LAB_SHARES_LIST_FAIL,
  GET_B2B_SHARES_LAB_LIST,
  GET_B2B_SHARES_LAB_LIST_SUCCESS,
  GET_B2B_SHARES_LAB_LIST_FAIL,
  UPDATE_LAB_SHARE,
  UPDATE_LAB_SHARE_SUCCESS,
  UPDATE_LAB_SHARE_FAIL,
  UPDATE_ALL_LAB_SHARE,
  UPDATE_ALL_LAB_SHARE_SUCCESS,
  UPDATE_ALL_LAB_SHARE_FAIL,
  ADD_NEW_LAB_SHARE,
  ADD_LAB_SHARE_SUCCESS,
  ADD_LAB_SHARE_FAIL,
} from "./actionTypes";


export const getLabs = () => ({
  type: GET_LABS,
});

export const getLabsSuccess = labs => ({
  type: GET_LABS_SUCCESS,
  payload: labs,
});

export const getLabsFail = error => ({
  type: GET_LABS_FAIL,
  payload: error,
});
export const getB2bLabSharesList = id => ({
  type: GET_B2B_LAB_SHARES_LIST,
  payload: id,
});

export const getB2bLabSharesListSuccess = b2bLabShares => ({
  type: GET_B2B_LAB_SHARES_LIST_SUCCESS,
  payload: b2bLabShares,
});

export const getB2bLabSharesListFail = error => ({
  type: GET_B2B_LAB_SHARES_LIST_FAIL,
  payload: error,
});

export const getB2bSharesLabList = id => ({
  type: GET_B2B_SHARES_LAB_LIST,
  payload: id,
});

export const getB2bSharesLabListSuccess = b2bLabShares => ({
  type: GET_B2B_SHARES_LAB_LIST_SUCCESS,
  payload: b2bLabShares,
});

export const getB2bSharesLabListFail = error => ({
  type: GET_B2B_SHARES_LAB_LIST_FAIL,
  payload: error,
});
export const updateLabShare = b2bLabShare => ({
  type: UPDATE_LAB_SHARE,
  payload: b2bLabShare,
});

export const updateLabShareSuccess = labShares => ({
  type: UPDATE_LAB_SHARE_SUCCESS,
  payload: labShares,
});

export const updateLabShareFail = error => ({
  type: UPDATE_LAB_SHARE_FAIL,
  payload: error,
});
export const updateAllLabShare = b2bLabShare => ({
  type: UPDATE_ALL_LAB_SHARE,
  payload: b2bLabShare,
});

export const updateAllLabShareSuccess = labShares => ({
  type: UPDATE_ALL_LAB_SHARE_SUCCESS,
  payload: labShares,
});

export const updateAllLabShareFail = error => ({
  type: UPDATE_ALL_LAB_SHARE_FAIL,
  payload: error,
});
export const addNewLabShare = (b2bLabShare, id) => ({
  type: ADD_NEW_LAB_SHARE,
  payload: { b2bLabShare, id },
});

export const addLabShareSuccess = b2bLabShare => ({
  type: ADD_LAB_SHARE_SUCCESS,
  payload: b2bLabShare,
});

export const addLabShareFail = error => ({
  type: ADD_LAB_SHARE_FAIL,
  payload: error,
});