import { takeEvery, put, call } from "redux-saga/effects";

//Account Redux states
import { ADD_B2BCLIENT_INFORMATION, GET_TERRITORIES_LIST,} from "./actionTypes";
import {
  getTerritoriesListSuccess,
  getTerritoriesListFail,
  addB2bClientInformationSuccessful,
  addB2bClientInformationFailed,
} from "./actions";

//Include Both Helper File with needed methods
import { postB2bClientInformation, getTerritoriesList} from "../../../helpers/django_api_helper";

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
function* addB2bClientInformation({ payload: { b2bClient, id } }) {
  try {
    const response = yield call(postB2bClientInformation, id, b2bClient);
    if (response.status == 400) {
      yield put(addB2bClientInformationFailed(response.message));
    } else {
      yield put(addB2bClientInformationSuccessful(response));
    }
  } catch (error) {
    yield put(addB2bClientInformationFailed(error));
  }
}

function* B2bClientInformationSaga() {
  yield takeEvery(ADD_B2BCLIENT_INFORMATION, addB2bClientInformation);
  yield takeEvery(GET_TERRITORIES_LIST,fetchTerritoriesList);
}

export default B2bClientInformationSaga;
