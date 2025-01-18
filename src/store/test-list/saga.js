import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_TESTS_LIST, GET_CORPORATE_TESTS_LIST  } from "./actionTypes";


import {
  getTestsListSuccess,
  getTestsListFail,
  getCorporateTestsListSuccess,
  getCorporateTestsListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getTestsList, getCorporateTestsList } from "../../helpers/django_api_helper";

function* fetchTestsList(object) {
  try {
    const response = yield call(getTestsList, object.payload);
    yield put(getTestsListSuccess(response));
  } catch (error) {
    yield put(getTestsListFail(error));
  }
}
function* fetchCorporateTestsList(object) {
  try {
    const response = yield call(getCorporateTestsList, object.payload);
    yield put(getCorporateTestsListSuccess(response));
  } catch (error) {
    yield put(getCorporateTestsListFail(error));
  }
}
function* TestsSaga() {
  yield takeEvery(
    GET_TESTS_LIST,
    fetchTestsList
  );
  yield takeEvery(
    GET_CORPORATE_TESTS_LIST,
    fetchCorporateTestsList
  );
}

export default TestsSaga;
