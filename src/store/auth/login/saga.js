import { takeEvery, put, call, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER } from "./actionTypes";
import { loginSuccess, logoutUserSuccess, apiError } from "./actions";

//Include Both Helper File with needed methods
import { postLogin } from "../../../helpers/django_api_helper";

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(postLogin, {
      username: user.username,
      password: user.password,
      guest_id: user.guest_id,

    });

    // If there is data in response then execute this block
    // Otherwise there must be some error so execute else block
    if (response.data.data) {
      const data = response.data.data;

      localStorage.setItem("authUser", JSON.stringify(data));
      yield put(loginSuccess(data));

      // if (data.account_type == "patient") {
      //   history.push("/nearby-labs");
      // }
      // else if (data.account_type == "labowner") {
      //   history.push("/dashboard-lab");
      // }
      // else if (data.account_type == "b2bclient") {
      //   history.push("/dashboard-b2bclient");
      // }
      // else {
      //   history.push("/dashboard-corporate/" + data.user_id);
      // }
    } else {
      const message = response.data.message;
      yield put(apiError(message));
    }
  } catch (error) {
    yield put(apiError("Sorry! You have provided invalid Password."));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");

    // if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
    //   const response = yield call(fireBaseBackend.logout);
    //   yield put(logoutUserSuccess(response));
    // }
    history.push("/login");
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
