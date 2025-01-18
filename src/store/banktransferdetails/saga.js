import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_BANK_TRANSFER, 
  GET_BANKS,
  GET_BANK_ACCOUNTS,
  ADD_NEW_BANK_TRANSFER,
  UPDATE_BANK_TRANSFER,
} from "./actionTypes";

import {
  getBankAccountsSuccess,
  getBankAccountsFail,
  getBanksSuccess,
  getBanksFail,
  getBankTransferSuccess,
  getBankTransferFail,
  addBankTransferFail,
  addBankTransferSuccess,
  updateBankTransferSuccess,
  updateBankTransferFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getBankTransfer, getBanks, getBankAccounts, updateBankTransfer,
  addNewBankTransfer,
 } from "../../helpers/django_api_helper";

 function* fetchBankAccounts() {
  try {
    const response = yield call(getBankAccounts);
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

function* fetchBankTransfers(object) {
  try {
    const response = yield call(getBankTransfer, object.payload);
    yield put(getBankTransferSuccess(response));
  } catch (error) {
    yield put(getBankTransferFail(error));
  }
}

function* onAddNewBankTransfer(object) {
  try {
    const response = yield call(
      addNewBankTransfer,
      object.payload.bankTransfer,
      object.payload.id
    );
    yield put(addBankTransferSuccess(response));
  } catch (error) {
    yield put(addBankTransferFail(error));
  }
}

function* onUpdateBankTransfer({ payload: bankTransfer }) {
  try {
    const response = yield call(updateBankTransfer, bankTransfer);
    yield put(updateBankTransferSuccess(response));
  } catch (error) {
    yield put(updateBankTransferFail(error));
  }
}

function* bankTransferSaga() {
  yield takeEvery(GET_BANKS, fetchBanks);
  yield takeEvery(GET_BANK_ACCOUNTS, fetchBankAccounts);
  yield takeEvery(GET_BANK_TRANSFER,fetchBankTransfers);
  yield takeEvery(ADD_NEW_BANK_TRANSFER, onAddNewBankTransfer);
  yield takeEvery(UPDATE_BANK_TRANSFER, onUpdateBankTransfer);

}

export default bankTransferSaga;
