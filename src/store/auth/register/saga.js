import { takeEvery, put, call } from "redux-saga/effects";

//Account Redux states
import { REGISTER_USER } from "./actionTypes";
import { registerUserSuccessful, registerUserFailed } from "./actions";

//Include Both Helper File with needed methods
import { postRegister } from "../../../helpers/django_api_helper";

// Is user register successfull then direct plot user in redux.
function* registerUser({ payload: { user } }) {
  try {
    const response = yield call(postRegister, user);
    yield put(registerUserSuccessful(response));

    if (response.error) {
      yield put(registerUserFailed(response));
    } else if (response.status === 400) {
      yield put(registerUserFailed(response.message));
    }
  } catch (error) {
    yield put(registerUserFailed(error));
  }
}

function* accountSaga() {
  yield takeEvery(REGISTER_USER, registerUser);
}

export default accountSaga;
