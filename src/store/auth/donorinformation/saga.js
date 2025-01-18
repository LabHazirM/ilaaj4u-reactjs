import { takeEvery, put, call } from "redux-saga/effects";

//Account Redux states
import { ADD_DONOR_INFORMATION,  GET_TERRITORIES_LIST } from "./actionTypes";
import {
  getTerritoriesListSuccess,
  getTerritoriesListFail,
  addDonorInformationSuccessful,
  addDonorInformationFailed,
} from "./actions";

//Include Both Helper File with needed methods
import { postDonorInformation} from "../../../helpers/django_api_helper";
// Territories
function* fetchTerritoriesList(object) {
  try {
    const response = yield call(getTerritoriesList, object.payload);
    yield put(getTerritoriesListSuccess(response));
  } catch (error) {
    yield put(getTerritoriesListFail(error));
  }
}

// Is user register successfull then direct plot user in redux.
function* addDonorInformation({ payload: { donor, id } }) {
  try {
    const response = yield call(postDonorInformation, id, donor);
    if (response.status == 400) {
      yield put(addDonorInformationFailed(response.message));
    } else {
      yield put(addDonorInformationSuccessful(response));
    }
  } catch (error) {
    yield put(addDonorInformationFailed(error));
  }
}

function* DonorInformationSaga() {
  yield takeEvery(ADD_DONOR_INFORMATION, addDonorInformation);
  yield takeEvery(GET_TERRITORIES_LIST,fetchTerritoriesList);

}

export default DonorInformationSaga;
