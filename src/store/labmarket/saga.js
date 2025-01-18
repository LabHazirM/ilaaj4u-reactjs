import { call, put, takeEvery } from "redux-saga/effects";

// LabMarket Redux States
import { GET_NEARBY_LABS, GET_CORPORATE_LABS, GET_REGION_WISE_ADVERTISEMENT,
  GET_ADV_LIVE , GET_PATIENT_PROFILE } from "./actionTypes";

import { getNearbyLabsFail, getCorporateLabsFail, getCorporateLabsSuccess, getNearbyLabsSuccess, getRegionWiseAdvertisementFail, getRegionWiseAdvertisementSuccess, 
  getAdvLiveFail, getAdvLiveSuccess , getPatientProfileSuccess, getPatientProfileFail} from "./actions";

// Include Helper File with needed methods
import { getNearbyLabs, getCorporateLabs, getRegionWiseAdvertisement, getAdvLive, getPatientProfile } from "helpers/django_api_helper";

function* fetchNearbyLabs(object) {
  try {
    const response = yield call(getNearbyLabs, object.payload.locationDetails);
    yield put(getNearbyLabsSuccess(response.data));
  } catch (error) {
    yield put(getNearbyLabsFail(error));
  }
}

function* fetchCorporateLabs(object) {
  try {
    const response = yield call(getCorporateLabs, object.payload.locationDetails);
    yield put(getCorporateLabsSuccess(response.data));
  } catch (error) {
    yield put(getCorporateLabsFail(error));
  }
}

function* fetchPatientProfile(object) {
  try {
    const response = yield call(getPatientProfile, object.payload);
    yield put(getPatientProfileSuccess(response));
  } catch (error) {
    yield put(getPatientProfileFail(error));
  }
}
function* fetchRegionWiseAdvertisement(object) {
  try {
    const response = yield call(getRegionWiseAdvertisement, object.payload.locationDetails);
    yield put(getRegionWiseAdvertisementSuccess(response.data));
  } catch (error) {
    yield put(getRegionWiseAdvertisementFail(error));
  }
}

function* fetchAdvLive(object) {
  try {
    const response = yield call(getAdvLive, object.payload.locationDetails);
    yield put(getAdvLiveSuccess(response.data));
  } catch (error) {
    yield put(getAdvLiveFail(error));
  }
}

function* labMarketSaga() {
  yield takeEvery(GET_NEARBY_LABS, fetchNearbyLabs);
  yield takeEvery(GET_CORPORATE_LABS, fetchCorporateLabs);
  yield takeEvery(GET_REGION_WISE_ADVERTISEMENT, fetchRegionWiseAdvertisement);
  yield takeEvery(GET_ADV_LIVE, fetchAdvLive);
  yield takeEvery(GET_PATIENT_PROFILE, fetchPatientProfile);
}

export default labMarketSaga;
