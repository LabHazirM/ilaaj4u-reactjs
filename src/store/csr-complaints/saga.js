import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_CSR_COMPLAINTS,
  UPDATE_CSR_COMPLAINTS,
} from "./actionTypes";

import {
  getCsrComplaintsSuccess,
  getCsrComplaintsFail,
  updateCsrComplaintsSuccess,
  updateCsrComplaintsFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getCsrComplaints,
  updateCsrComplaints,
} from "../../helpers/django_api_helper";

function* fetchCsrComplaints(object) {
  try {
    const response = yield call(getCsrComplaints, object.payload);
    console.log("Response: ", response);
    yield put(getCsrComplaintsSuccess(response.data));
  } catch (error) {
    yield put(getCsrComplaintsFail(error));
  }
}
// function* onUpdateCsrComplaints(object) {
//   try {
//     console.log(" object.payload: ", object.payload.csrComplaints);
//     const response = yield call(
//       updateCsrComplaints,
//       object.payload.csrComplaints
//     );
//     yield put(updateCsrComplaintsSuccess(response));
//   } catch (error) {
//     yield put(updateCsrComplaintsFail(error));
//   }
// }
function* onUpdateCsrComplaints({ payload: csrComplaint }) {
  try {
    const response = yield call(updateCsrComplaints, csrComplaint);
    yield put(updateCsrComplaintsSuccess(response));
  } catch (error) {
    yield put(updateCsrComplaintsFail(error));
  }
}

function* csrcomplaintsSaga() {
  yield takeEvery(GET_CSR_COMPLAINTS, fetchCsrComplaints);
  yield takeEvery(UPDATE_CSR_COMPLAINTS, onUpdateCsrComplaints);
}

export default csrcomplaintsSaga;
