import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_BANKACCOUNTS,
  DELETE_BANKACCOUNT,
  UPDATE_BANKACCOUNT,
} from "./actionTypes";

import {
  getBankaccountsSuccess,
  getBankaccountsFail,
  updateBankaccountSuccess,
  updateBankaccountFail,
  // deleteBankaccountSuccess,
  // deleteBankaccountFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getBankaccounts,
  updateBankaccount,
  // deleteBankaccount,
} from "../../helpers/django_api_helper";

function* fetchBankaccounts(object) {
  try {
    const response = yield call(getBankaccounts, object.payload);
    yield put(getBankaccountsSuccess(response));
  } catch (error) {
    yield put(getBankaccountsFail(error));
  }
}

function* onUpdateBankaccount({ payload: pathologist }) {
  try {
    const response = yield call(updateBankaccount, pathologist);
    yield put(updateBankaccountSuccess(response));
  } catch (error) {
    yield put(updateBankaccountFail(error));
  }
}

// function* onDeleteBankaccount({ payload: pathologist }) {
//   try {
//     const response = yield call(deleteBankaccount, pathologist);
//     yield put(deleteBankaccountSuccess(response));
//   } catch (error) {
//     yield put(deleteBankaccountFail(error));
//   }
// }

function* pathologistsSaga() {
  yield takeEvery(GET_BANKACCOUNTS, fetchBankaccounts);
  yield takeEvery(UPDATE_BANKACCOUNT, onUpdateBankaccount);
  // yield takeEvery(DELETE_BANKACCOUNT, onDeleteBankaccount);
}

export default pathologistsSaga;
