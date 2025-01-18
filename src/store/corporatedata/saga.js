import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_LABCORPORATE,
  GET_ALABCORPORATE,
  GET_ACORPORATE,
  GET_RFEECORPORATE,
  GET_EMPLOYEECORPORATE,
  GET_LABSCORPORATE,
  ADD_NEW_CEMPLOYEE_DATA,
  ADD_NEW_CEMPLOYEE_FILE,
  UPDATE_CEMPLOYEE,
  DELETE_CEDATA,

} from "./actionTypes";

import {
  getLabCorporateSuccess,
  getLabCorporateFail,
  getALabCorporateSuccess,
  getALabCorporateFail,
  getACorporateSuccess,
  getACorporateFail,
  getRFeeCorporateSuccess,
  getRFeeCorporateFail,
  getEmployeeCorporateSuccess,
  getEmployeeCorporateFail,
  getLabsCorporateSuccess,
  getLabsCorporateFail,
  addCemployeeDataFail,
  addCemployeeDataSuccess,
  addCemployeefileFail,
  addCemployeefileSuccess,
  updateCemployeeSuccess,
  updateCemployeeFail,
  deletecedataSuccess,
  deletecedataFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getLabCorporate,
  getALabCorporate,
  getACorporate,
  getRFeeCorporate,
  getEmployeeCorporate,
  getLabsCorporate,
  addNewCemployeeData,
  addNewCemployeefile,
  updateCemployee,
  deletecedata,
} from "../../helpers/django_api_helper";

function* fetchLabCorporate(object) {
  try {
    const response = yield call(getLabCorporate, object.payload);
    yield put(getLabCorporateSuccess(response));
  } catch (error) {
    yield put(getLabCorporateFail(error));
  }
}
function* fetchALabCorporate(object) {
  try {
    const response = yield call(getALabCorporate, object.payload);
    yield put(getALabCorporateSuccess(response));
  } catch (error) {
    yield put(getALabCorporateFail(error));
  }
}
function* fetchACorporate(object) {
  try {
    const response = yield call(getACorporate, object.payload);
    yield put(getACorporateSuccess(response));
  } catch (error) {
    yield put(getACorporateFail(error));
  }
}
function* fetchRFeeCorporate(object) {
  try {
    const response = yield call(getRFeeCorporate, object.payload);
    yield put(getRFeeCorporateSuccess(response));
  } catch (error) {
    yield put(getRFeeCorporateFail(error));
  }
}
function* fetchEmployeeCorporate(object) {
  try {
    const response = yield call(getEmployeeCorporate, object.payload);
    yield put(getEmployeeCorporateSuccess(response));
  } catch (error) {
    yield put(getEmployeeCorporateFail(error));
  }
}

function* fetchLabsCorporate(object) {
  try {
    const response = yield call(getLabsCorporate, object.payload);
    yield put(getLabsCorporateSuccess(response));
  } catch (error) {
    yield put(getLabsCorporateFail(error));
  }
}

function* onAddNewCemployeeData(object) {
  try {
    const response = yield call(
      addNewCemployeeData,
      object.payload.cemployeeData,
      object.payload.id
    );
    yield put(addCemployeeDataSuccess(response));
  } catch (error) {
    yield put(addCemployeeDataFail(error));
  }
}
function* onAddNewCemployeefile(object) {
  console.log("saga responce", object)

  try {
    const response = yield call(
      addNewCemployeefile,
      object.payload.cemployeeData,
    );
    yield put(addCemployeefileSuccess(response));
  } catch (error) {
    yield put(addCemployeefileFail(error));
  }
}
function* onUpdateCemployee({ payload: cemployee }) {
  try {
    const response = yield call(updateCemployee, cemployee);
    yield put(updateCemployeeSuccess(response));
  } catch (error) {
    yield put(updateCemployeeFail(error));
  }
}
function* onDeleteCedata({ payload: cemployee }) {
  try {
    const response = yield call(deletecedata, cemployee);
    yield put(deletecedataSuccess(response));
  } catch (error) {
    yield put(deletecedataFail(error));
  }
}
function* cemployeeDataSaga() {
  yield takeEvery(GET_LABCORPORATE, fetchLabCorporate);
  yield takeEvery(GET_ALABCORPORATE, fetchALabCorporate);
  yield takeEvery(GET_ACORPORATE, fetchACorporate);
  yield takeEvery(GET_RFEECORPORATE, fetchRFeeCorporate);
  yield takeEvery(GET_EMPLOYEECORPORATE, fetchEmployeeCorporate);
  yield takeEvery(GET_LABSCORPORATE, fetchLabsCorporate);
  yield takeEvery(ADD_NEW_CEMPLOYEE_DATA, onAddNewCemployeeData);
  yield takeEvery(ADD_NEW_CEMPLOYEE_FILE, onAddNewCemployeefile);
  yield takeEvery(UPDATE_CEMPLOYEE, onUpdateCemployee);
  yield takeEvery(DELETE_CEDATA, onDeleteCedata);


}

export default cemployeeDataSaga;
