import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_TEST_APPOINTMENTS_PENDING_LIST,
  GET_TEST_APPOINTMENTS_IN_PROCESS_LIST,
  GET_TEST_APPOINTMENTS_COMPLETED_LIST,
  UPDATE_TEST_APPOINTMENT,
  GET_LAB_PROFILE,
  ADD_NEW_COLLECTIONPOINT_TESTAPPOINTMENT,
  GET_LAB_TOKEN,
} from "./actionTypes";

import {
  getLabProfileSuccess,
  getLabProfileFail,
  getTestAppointmentsPendingListSuccess,
  getTestAppointmentsPendingListFail,
  getTestAppointmentsInProcessListSuccess,
  getTestAppointmentsInProcessListFail,
  getTestAppointmentsCompletedListSuccess,
  getTestAppointmentsCompletedListFail,
  updateTestAppointmentSuccess,
  updateTestAppointmentFail,
  addCollectionPointTestAppointmentFail,
  addCollectionPointTestAppointmentSuccess,
  getLabTokenSuccess,
  getLabTokenFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getLabProfile,
  getLabToken,
  getTestAppointmentsPendingList,
  getTestAppointmentsInProcessList,
  getTestAppointmentsCompletedList,
  updateTestAppointment,
  addNewCollectionPointTestAppointment,

} from "../../helpers/django_api_helper";

function* fetchLabProfile(object) {
  try {
    const response = yield call(getLabProfile, object.payload);
    yield put(getLabProfileSuccess(response));

  } catch (error) {
    yield put(getLabProfileFail(error));
  }
}

function* fetchLabToken(object) {
  try {
    const response = yield call(getLabToken, object.payload);
    yield put(getLabTokenSuccess(response));

  } catch (error) {
    yield put(getLabTokenFail(error));
  }
}

function* onAddNewCollectionPointTestAppointment(object) {
  try {
    const response = yield call(
      addNewCollectionPointTestAppointment,
      object.payload.testAppointment,
      object.payload.id
    );
    yield put(addCollectionPointTestAppointmentSuccess(response));
  } catch (error) {
    yield put(addCollectionPointTestAppointmentFail(error));
  }
}

function* fetchTestAppointmentsPendingList(object) {
  try {
    const response = yield call(getTestAppointmentsPendingList, object.payload);
    yield put(getTestAppointmentsPendingListSuccess(response));
  } catch (error) {
    yield put(getTestAppointmentsPendingListFail(error));
  }
}

function* fetchTestAppointmentsInProcessList(object) {
  try {
    const response = yield call(
      getTestAppointmentsInProcessList,
      object.payload
    );
    yield put(getTestAppointmentsInProcessListSuccess(response));
  } catch (error) {
    yield put(getTestAppointmentsInProcessListFail(error));
  }
}

function* fetchTestAppointmentsCompletedList(object) {
  try {
    const response = yield call(
      getTestAppointmentsCompletedList,
      object.payload
    );
    yield put(getTestAppointmentsCompletedListSuccess(response));
  } catch (error) {
    yield put(getTestAppointmentsCompletedListFail(error));
  }
}

function* onUpdateTestAppointment({ payload: testAppointment }) {
  try {
    const response = yield call(updateTestAppointment, testAppointment);
    yield put(updateTestAppointmentSuccess(response));
  } catch (error) {
    yield put(updateTestAppointmentFail(error));
  }
}

function* TestAppointmentsSaga() {
  yield takeEvery(GET_LAB_PROFILE, fetchLabProfile);
  yield takeEvery(GET_LAB_TOKEN, fetchLabToken);  
  yield takeEvery(
    ADD_NEW_COLLECTIONPOINT_TESTAPPOINTMENT,
    onAddNewCollectionPointTestAppointment
  );
  yield takeEvery(
    GET_TEST_APPOINTMENTS_PENDING_LIST,
    fetchTestAppointmentsPendingList
  );
  yield takeEvery(
    GET_TEST_APPOINTMENTS_IN_PROCESS_LIST,
    fetchTestAppointmentsInProcessList
  );
  yield takeEvery(
    GET_TEST_APPOINTMENTS_COMPLETED_LIST,
    fetchTestAppointmentsCompletedList
  );
  yield takeEvery(UPDATE_TEST_APPOINTMENT, onUpdateTestAppointment);
}

export default TestAppointmentsSaga;
