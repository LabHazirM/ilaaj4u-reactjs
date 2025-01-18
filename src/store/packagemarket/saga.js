import { call, put, takeEvery } from "redux-saga/effects";

// TestMarket Redux States
import { GET_NEARBY_PACKAGES, GET_PACKAGES, GET_TERRITORIES_LIST } from "./actionTypes";
import { getNearbyPackagesFail, getNearbyPackagesSuccess, getPackagesFail, getPackagesSuccess,getTerritoriesListSuccess,
  getTerritoriesListFail, } from "./actions";

// Include Helper File with needed methods
import { getNearbyPackages , getPackages, getTerritoriesList } from "helpers/django_api_helper";

function* fetchTerritoriesList(object) {
  try {
    const response = yield call(getTerritoriesList, object.payload);
    yield put(getTerritoriesListSuccess(response));
  } catch (error) {
    yield put(getTerritoriesListFail(error));
  }
}

function* fetchNearbyPackages(object) {
  try {
    const response = yield call(
      getNearbyPackages,
      object.payload.search_type,
      object.payload.address,
      object.payload.id,
      object.payload.test_name
    );
    yield put(getNearbyPackagesSuccess(response.data));
  } catch (error) {
    yield put(getNearbyPackagesFail(error));
  }
}
function* fetchPackages() {
  try {
    const response = yield call(getPackages);
    yield put(getPackagesSuccess(response));
  } catch (error) {
    yield put(getPackagesFail(error));
  }
}

function* PackageMarketSaga() {
  yield takeEvery(GET_NEARBY_PACKAGES, fetchNearbyPackages);
  yield takeEvery(GET_PACKAGES, fetchPackages);
  yield takeEvery(
    GET_TERRITORIES_LIST,
    fetchTerritoriesList
  );
}

export default PackageMarketSaga;
