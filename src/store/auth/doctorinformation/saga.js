import { takeEvery, put, call } from "redux-saga/effects";

//Account Redux states
import { ADD_DOCTOR_INFORMATION, GET_TERRITORIES_LIST,} from "./actionTypes";
import {
  getTerritoriesListSuccess,
  getTerritoriesListFail,
  addDoctorInformationSuccessful,
  addDoctorInformationFailed,
} from "./actions";

//Include Both Helper File with needed methods
import { postDoctorInformation, getTerritoriesList} from "../../../helpers/django_api_helper";

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
function* addDoctorInformation({ payload: { doctor, id } }) {
  try {
    const response = yield call(postDoctorInformation, id, doctor);
    if (response.status == 400) {
      yield put(addDoctorInformationFailed(response.message));
    } else {
      yield put(addDoctorInformationSuccessful(response));
    }
  } catch (error) {
    yield put(addDoctorInformationFailed(error));
  }
}

function* DoctorInformationSaga() {
  yield takeEvery(ADD_DOCTOR_INFORMATION, addDoctorInformation);
  yield takeEvery(GET_TERRITORIES_LIST,fetchTerritoriesList);
}

export default DoctorInformationSaga;
