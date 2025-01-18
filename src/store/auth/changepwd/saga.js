import { takeEvery, put, call } from "redux-saga/effects";

// Login Redux States
import { CHANGE_PASSWORD } from "./actionTypes";
import { userChangePasswordSuccess, userChangePasswordError } from "./actions";

//Include Both Helper File with needed methods
import { postChangePwd } from "../../../helpers/django_api_helper";

//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* changeUser({ payload: { user } }) {
  try {
    const response = yield call(postChangePwd, user);
    if (response) {
      yield put(
        userChangePasswordSuccess(
          "Congratulations! Your password is changed, you can now login to your account using new password."
        )
      );
    }
  } catch (error) {
    if (error.response.status == 400) {
      yield put(userChangePasswordError(error.response.data));
    } else {
      yield put(userChangePasswordError(error.response.data));
    }
  }
}

function* changePasswordSaga() {
  yield takeEvery(CHANGE_PASSWORD, changeUser);
}

export default changePasswordSaga;
