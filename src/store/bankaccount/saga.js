import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_BANKS,
  GET_BANK_ACCOUNTS,
  ADD_NEW_BANK_ACCOUNT,
} from "./actionTypes";

import {
  getBankAccountsSuccess,
  getBankAccountsFail,
  getBanksSuccess,
  getBanksFail,
  addBankAccountFail,
  addBankAccountSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getBankAccounts,
  getBanks,
  addNewBankAccount,
} from "../../helpers/django_api_helper";

function* fetchBankAccounts(object) {
  try {
    const response = yield call(getBankAccounts, object.payload);
    yield put(getBankAccountsSuccess(response));
  } catch (error) {
    yield put(getBankAccountsFail(error));
  }
}
function* fetchBanks() {
  try {
    const response = yield call(getBanks);
    yield put(getBanksSuccess(response));
  } catch (error) {
    yield put(getBanksFail(error));
  }
}
function* onAddNewBankAccount(object) {
  try {
    const response = yield call(
      addNewBankAccount,
      object.payload.bankAccount,
      object.payload.id
    );
    yield put(addBankAccountSuccess(response));
  } catch (error) {
    yield put(addBankAccountFail(error));
  }
}

function* bankAccountSaga() {
  yield takeEvery(GET_BANKS, fetchBanks);
  yield takeEvery(GET_BANK_ACCOUNTS, fetchBankAccounts);
  yield takeEvery(ADD_NEW_BANK_ACCOUNT, onAddNewBankAccount);
}

export default bankAccountSaga;
