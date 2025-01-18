import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_LAB_SETTINGS, UPDATE_LAB_SETTINGS } from "./actionTypes";

import {
  getLabSettingsSuccess,
  getLabSettingsFail,
  updateLabSettingsSuccess,
  updateLabSettingsFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getLabSettings,
  updateLabSettings,
} from "../../../helpers/django_api_helper";

function* fetchLabSettings(object) {
  try {
    const response = yield call(getLabSettings, object.payload);
    yield put(getLabSettingsSuccess(response));
  } catch (error) {
    yield put(getLabSettingsFail(error));
  }
}

function* onUpdateLabSettings({ payload: { labSettings, id } }) {
  try {
    const response = yield call(updateLabSettings, labSettings, id);
    yield put(updateLabSettingsSuccess(response));
  } catch (error) {
    yield put(updateLabSettingsFail(error));
  }
}

function* labSettingsSaga() {
  yield takeEvery(GET_LAB_SETTINGS, fetchLabSettings);
  yield takeEvery(UPDATE_LAB_SETTINGS, onUpdateLabSettings);
}

export default labSettingsSaga;
