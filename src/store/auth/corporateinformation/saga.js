import { takeEvery, put, call } from "redux-saga/effects";

//Account Redux states
import { ADD_CORPORATE_INFORMATION, GET_TERRITORIES_LIST } from "./actionTypes";
import {
  getTerritoriesListSuccess,
  getTerritoriesListFail,
  addCorporateInformationSuccessful,
  addCorporateInformationFailed,
} from "./actions";

//Include Both Helper File with needed methods
import { postCorporateInformation,   getTerritoriesList,
} from "../../../helpers/django_api_helper";

function* fetchTerritoriesList(object) {
  try {
    const response = yield call(getTerritoriesList, object.payload);
    yield put(getTerritoriesListSuccess(response));
  } catch (error) {
    yield put(getTerritoriesListFail(error));
  }
}

// Is user register successfull then direct plot user in redux.
function* addCorporateInformation({ payload: { corporate, id } }) {
  try {
    const response = yield call(postCorporateInformation, id, corporate);

    if (response.status == 400) {
      yield put(addCorporateInformationFailed(response.message));
    } else {
      yield put(addCorporateInformationSuccessful(response));
    }
  } catch (error) {
    yield put(addCorporateInformationFailed(error));
  }
}

function* CorporateInformationSaga() {
  yield takeEvery(ADD_CORPORATE_INFORMATION, addCorporateInformation);
  yield takeEvery(GET_TERRITORIES_LIST,fetchTerritoriesList);
}

export default CorporateInformationSaga;
