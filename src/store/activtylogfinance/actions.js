import {
  GET_ACTIVITY_LOG_FINANCE,
  GET_ACTIVITY_LOG_FINANCE_FAIL,
  GET_ACTIVITY_LOG_FINANCE_SUCCESS,
  GET_CORPORATE_COMMIT,
  GET_CORPORATE_COMMIT_FAIL,
  GET_CORPORATE_COMMIT_SUCCESS,
} from "./actionTypes";

// ----------- financeofficer actions -----------------
export const getActivityLogFinance = id => ({
  type: GET_ACTIVITY_LOG_FINANCE,
  payload: id,
});

export const getActivityLogFinanceSuccess = activitylogfinance => ({
  type: GET_ACTIVITY_LOG_FINANCE_SUCCESS,
  payload: activitylogfinance,
});

export const getActivityLogFinanceFail = error => ({
  type: GET_ACTIVITY_LOG_FINANCE_FAIL,
  payload: error,
});

// ----------- corporate actions -----------------
export const getCorporateCommit = id => ({
  type: GET_CORPORATE_COMMIT,
  payload: id,
});

export const getCorporateCommitSuccess = activitylogfinance => ({
  type: GET_CORPORATE_COMMIT_SUCCESS,
  payload: activitylogfinance,
});

export const getCorporateCommitFail = error => ({
  type: GET_CORPORATE_COMMIT_FAIL,
  payload: error,
});

