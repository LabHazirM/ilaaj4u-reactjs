import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_CSR_APPOINTMENTS,
  UPDATE_CSR_APPOINTMENTS,
} from "./actionTypes";

import {
  getCsrAppointmentsSuccess,
  getCsrAppointmentsFail,
  updateCsrAppointmentsSuccess,
  updateCsrAppointmentsFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getCsrAppointments,
  updateCsrAppointments,
} from "../../helpers/django_api_helper";

function* fetchCsrAppointments(object) {
  try {
    const response = yield call(getCsrAppointments, object.payload);
    console.log("Response: ", response);
    yield put(getCsrAppointmentsSuccess(response.data));
  } catch (error) {
    yield put(getCsrAppointmentsFail(error));
  }
}
// function* onUpdateCsrAppointments(object) {
//   try {
//     console.log(" object.payload: ", object.payload.csrAppointments);
//     const response = yield call(
//       updateCsrAppointments,
//       object.payload.csrAppointments
//     );
//     yield put(updateCsrAppointmentsSuccess(response));
//   } catch (error) {
//     yield put(updateCsrAppointmentsFail(error));
//   }
// }
function* onUpdateCsrAppointments({ payload: csrComplaint }) {
  try {
    const response = yield call(updateCsrAppointments, csrComplaint);
    yield put(updateCsrAppointmentsSuccess(response));
  } catch (error) {
    yield put(updateCsrAppointmentsFail(error));
  }
}

function* csrappointmentsSaga() {
  yield takeEvery(GET_CSR_APPOINTMENTS, fetchCsrAppointments);
  yield takeEvery(UPDATE_CSR_APPOINTMENTS, onUpdateCsrAppointments);
}

export default csrappointmentsSaga;
