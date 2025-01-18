import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_ONLY_MEDICAL_LIST, GET_TERRITORIES_LIST } from "./actionTypes";

import {
  onlyMedicalTestListSuccess,
  onlyMedicalTestListFail,
  getTerritoriesListSuccess,
  getTerritoriesListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { onlyMedicalTestList, getTerritoriesList } from "../../helpers/django_api_helper";

function* fetchonlyMedicalTestList(object) {
  try {
    const response = yield call(onlyMedicalTestList, object.payload);
    yield put(onlyMedicalTestListSuccess(response));
  } catch (error) {
    yield put(onlyMedicalTestListFail(error));
  }
}
function* fetchTerritoriesList(object) {
  try {
    const response = yield call(getTerritoriesList, object.payload);
    yield put(getTerritoriesListSuccess(response));
  } catch (error) {
    yield put(getTerritoriesListFail(error));
  }
}

function* onlyMedicalTestListSaga() {
  yield takeEvery(
    GET_ONLY_MEDICAL_LIST,
    fetchonlyMedicalTestList
  );
  yield takeEvery(
    GET_TERRITORIES_LIST,
    fetchTerritoriesList
  );
}

export default onlyMedicalTestListSaga;