import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_DONOR_REFERRED_APPOINTMENTS_LIST } from "./actionTypes";

import {
  getDonorReferredAppointmentsListSuccess,
  getDonorReferredAppointmentsListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getDonorReferredAppointmentsList } from "../../helpers/django_api_helper";

function* fetchDonorReferredAppointmentsList(object) {
  try {
    const response = yield call(getDonorReferredAppointmentsList, object.payload);
    yield put(getDonorReferredAppointmentsListSuccess(response));
  } catch (error) {
    yield put(getDonorReferredAppointmentsListFail(error));
  }
}

function* DonorReferredAppointmentsSaga() {
  yield takeEvery(
    GET_DONOR_REFERRED_APPOINTMENTS_LIST,
    fetchDonorReferredAppointmentsList
  );
}

export default DonorReferredAppointmentsSaga;
