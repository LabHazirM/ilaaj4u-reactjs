import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_DONOR_SETTINGS, UPDATE_DONOR_SETTINGS, GET_TERRITORIES_LIST } from "./actionTypes";

import {
  getTerritoriesListSuccess,
  getTerritoriesListFail,
  getDonorSettingsSuccess,
  getDonorSettingsFail,
  updateDonorSettingsSuccess,
  updateDonorSettingsFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getDonorSettings,
  updateDonorSettings,
  getTerritoriesList,
} from "../../../helpers/django_api_helper";


function* fetchTerritoriesList(object) {
  try {
    const response = yield call(getTerritoriesList, object.payload);
    yield put(getTerritoriesListSuccess(response));
  } catch (error) {
    yield put(getTerritoriesListFail(error));
  }
}

function* fetchDonorSettings(object) {
  try {
    const response = yield call(getDonorSettings, object.payload);
    yield put(getDonorSettingsSuccess(response));
  } catch (error) {
    yield put(getDonorSettingsFail(error));
  }
}

function* onUpdateDonorSettings({ payload: { donorSettings, id } }) {
  try {
    const response = yield call(updateDonorSettings, donorSettings, id);
    yield put(updateDonorSettingsSuccess(response));
  } catch (error) {
    yield put(updateDonorSettingsFail(error));
  }
}

function* donorSettingsSaga() {
  yield takeEvery(GET_DONOR_SETTINGS, fetchDonorSettings);
  yield takeEvery(UPDATE_DONOR_SETTINGS, onUpdateDonorSettings);
  yield takeEvery(GET_TERRITORIES_LIST,fetchTerritoriesList);
}

export default donorSettingsSaga;
