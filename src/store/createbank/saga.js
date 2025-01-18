import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  // GET_CREATE_BANKS,
  ADD_NEW_CREATE_BANK,
  UPDATE_BANK,
  GET_BANKS,
} from "./actionTypes";

import {
  // getCreateBanksSuccess,
  // getCreateBanksFail,
  getBanksSuccess,
  getBanksFail,
  addCreateBankFail,
  addCreateBankSuccess,
  updateBankSuccess,
  updateBankFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  // getCreateBanks,
  addNewCreateBank,
  updateBank,
  getBanks,
} from "../../helpers/django_api_helper";

// function* fetchCreateBanks(object) {
//   try {
//     const response = yield call(getCreateBanks, object.payload);
//     yield put(getCreateBanksSuccess(response));
//   } catch (error) {
//     yield put(getCreateBanksFail(error));
//   }
// }
function* fetchBanks() {
  try {
    const response = yield call(getBanks);
    yield put(getBanksSuccess(response));
  } catch (error) {
    yield put(getBanksFail(error));
  }
}

function* onAddNewCreateBank(object) {
  try {
    const response = yield call(
      addNewCreateBank,
      object.payload.createBank,
      object.payload.id
    );
    yield put(addCreateBankSuccess(response));
  } catch (error) {
    yield put(addCreateBankFail(error));
  }
}
function* onUpdateBank({ payload: bank }) {
  try {
    const response = yield call(updateBank, bank);
    yield put(updateBankSuccess(response));
  } catch (error) {
    yield put(updateBankFail(error));
  }
}

function* createBankSaga() {
  // yield takeEvery(GET_CREATE_BANKS, fetchCreateBanks);
  yield takeEvery(GET_BANKS, fetchBanks);
  yield takeEvery(ADD_NEW_CREATE_BANK, onAddNewCreateBank);
  yield takeEvery(UPDATE_BANK, onUpdateBank);

}

export default createBankSaga;
