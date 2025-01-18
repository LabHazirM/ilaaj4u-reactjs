import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_B2B_LAB_SHARES_LIST, GET_B2B_SHARES_LAB_LIST, GET_LABS, ADD_NEW_LAB_SHARE,
  UPDATE_LAB_SHARE, UPDATE_ALL_LAB_SHARE } from "./actionTypes";

import {
  getLabsSuccess,
  getLabsFail,
  getB2bLabSharesListSuccess,
  getB2bLabSharesListFail,
  getB2bSharesLabListSuccess,
  getB2bSharesLabListFail,
  updateLabShareSuccess,
  updateLabShareFail,
  addLabShareFail,
  addLabShareSuccess,
  updateAllLabShareSuccess,
  updateAllLabShareFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getB2bLabSharesList,  getB2bSharesLabList, getLabs,
  addNewLabShare,
  updateLabShare, updateAllLabShare } from "../../helpers/django_api_helper";

function* fetchLabs() {
  try {
    const response = yield call(getLabs);
    yield put(getLabsSuccess(response));
  } catch (error) {
    yield put(getLabsFail(error));
  }
}

function* fetchB2bLabSharesList(object) {
  try {
    const response = yield call(getB2bLabSharesList, object.payload);
    yield put(getB2bLabSharesListSuccess(response));
  } catch (error) {
    yield put(getB2bLabSharesListFail(error));
  }
}
function* fetchB2bSharesLabList(object) {
  try {
    const response = yield call(getB2bSharesLabList, object.payload);
    yield put(getB2bSharesLabListSuccess(response));
  } catch (error) {
    yield put(getB2bSharesLabListFail(error));
  }
}

function* onUpdateLabShare(object) {
  try {
    const response = yield call(updateLabShare, object.payload);
    yield put(updateLabShareSuccess(response));
  } catch (error) {
    yield put(updateLabShareFail(error));
  }
}

function* onUpdateAllLabShare(object) {
  try {
    const response = yield call(updateAllLabShare, object.payload);
    yield put(updateAllLabShareSuccess(response));
  } catch (error) {
    yield put(updateAllLabShareFail(error));
  }
}
function* onAddNewLabShare(object) {
  try {
    const response = yield call(
      addNewLabShare,
      object.payload.b2bLabShare,
      object.payload.id
    );
    yield put(addLabShareSuccess(response));
  } catch (error) {
    yield put(addLabShareFail(error));
  }
}
function* B2bLabSharesSaga() {
  yield takeEvery(
    GET_B2B_LAB_SHARES_LIST,
    fetchB2bLabSharesList
    
  );
  yield takeEvery(
    GET_B2B_SHARES_LAB_LIST,
    fetchB2bSharesLabList
    
  );
  yield takeEvery(GET_LABS, fetchLabs);
  yield takeEvery(UPDATE_LAB_SHARE, onUpdateLabShare);
  yield takeEvery(UPDATE_ALL_LAB_SHARE, onUpdateAllLabShare);
  yield takeEvery(ADD_NEW_LAB_SHARE, onAddNewLabShare);


}

export default B2bLabSharesSaga;
