import { takeEvery, put, call } from "redux-saga/effects";

// Login Redux States
import { CONFIRM_PASSWORD } from "./actionTypes";
import {
  userConfirmPasswordSuccess,
  userConfirmPasswordError,
} from "./actions";

//Include Both Helper File with needed methods
import { postConfirmPwd } from "../../../helpers/django_api_helper";

//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* confirmUser({ payload: { user, token } }) {
  try {
    const response = yield call(postConfirmPwd, user, token);
    if (response) {
      yield put(
        userConfirmPasswordSuccess(
          "Congratulations! Your password is reset, you can now login to your account using new password."
        )
      );
    }
  } catch (error) {
    if (error.response.status == 404) {
      yield put(
        userConfirmPasswordError(
          "You can't reset your password again as it has already been reset."
        )
      );
    } else {
      yield put(userConfirmPasswordError(error.response.data.password));
    }
  }
}

function* confirmPasswordSaga() {
  yield takeEvery(CONFIRM_PASSWORD, confirmUser);
}

export default confirmPasswordSaga;
