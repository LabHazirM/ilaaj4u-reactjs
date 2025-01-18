import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_CORPORATE_PROFILE, UPDATE_CORPORATE_PROFILE } from "./actionTypes";

import {
  getCorporateProfileSuccess,
  getCorporateProfileFail,
  updateCorporateProfileSuccess,
  updateCorporateProfileFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getCorporateProfile,
  updateCorporateProfile,
} from "../../../helpers/django_api_helper";

function* fetchCorporateProfile(object) {
  try {
    const response = yield call(getCorporateProfile, object.payload);
    yield put(getCorporateProfileSuccess(response));
  } catch (error) {
    yield put(getCorporateProfileFail(error));
  }
}

function* onUpdateCorporateProfile({ payload: { CorporateProfile, id } }) {
  try {
    console.log('Updating corporate profile with id:', id);
    console.log('Corporate profile data:', CorporateProfile);
    const response = yield call(updateCorporateProfile, CorporateProfile, id);
    yield put(updateCorporateProfileSuccess(response));
  } catch (error) {
    yield put(updateCorporateProfileFail(error));
  }
}

function* corporateProfileSaga() {
  yield takeEvery(GET_CORPORATE_PROFILE, fetchCorporateProfile);
  yield takeEvery(UPDATE_CORPORATE_PROFILE, onUpdateCorporateProfile);
}

export default corporateProfileSaga;
