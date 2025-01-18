import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  ADD_NEW_COMPLAINT,
  GET_LABS,
  GET_HANDLED_COMPLAINTS,
  GET_UNHANDLED_COMPLAINTS,
  UPDATE_UNHANDLED_COMPLAINTS,
} from "./actionTypes";

import {
  addComplaintFail,
  addComplaintSuccess,
  getLabsSuccess,
  getLabsFail,
  getHandledComplaintsSuccess,
  getHandledComplaintsFail,
  getUnhandledComplaintsSuccess,
  getUnhandledComplaintsFail,
  updateUnhandledComplaintsSuccess,
  updateUnhandledComplaintsFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  addNewComplaint,
  getHandledComplaints,
  getLabs,
  getUnhandledComplaints,
  updateUnhandledComplaints,
} from "../../helpers/django_api_helper";

function* onAddNewComplaint(object) {
  try {
    const response = yield call(addNewComplaint, object.payload.complaint);
    yield put(addComplaintSuccess(response.data));
  } catch (error) {
    yield put(addComplaintFail(error));
  }
}

function* fetchHandledComplaints(object) {
  try {
    const response = yield call(getHandledComplaints, object.payload);
    console.log("Response: ", response);
    yield put(getHandledComplaintsSuccess(response.data));
  } catch (error) {
    yield put(getHandledComplaintsFail(error));
  }
}
function* fetchLabs() {
  try {
    const response = yield call(getLabs);
    yield put(getLabsSuccess(response));
  } catch (error) {
    yield put(getLabsFail(error));
  }
}
function* fetchUnhandledComplaints(object) {
  try {
    const response = yield call(getUnhandledComplaints, object.payload);
    console.log("Response: ", response);
    yield put(getUnhandledComplaintsSuccess(response.data));
  } catch (error) {
    yield put(getUnhandledComplaintsFail(error));
  }
}
function* onUpdateUnhandledComplaints(object) {
  try {
    console.log(" object.payload: ", object.payload.unhandledComplaints);
    const response = yield call(
      updateUnhandledComplaints,
      object.payload.unhandledComplaints
    );
    yield put(updateUnhandledComplaintsSuccess(response));
  } catch (error) {
    yield put(updateUnhandledComplaintsFail(error));
  }
}
function* complaintsSaga() {
  yield takeEvery(GET_HANDLED_COMPLAINTS, fetchHandledComplaints);
  yield takeEvery(GET_LABS, fetchLabs);
  yield takeEvery(ADD_NEW_COMPLAINT, onAddNewComplaint);
  yield takeEvery(GET_UNHANDLED_COMPLAINTS, fetchUnhandledComplaints);
  yield takeEvery(UPDATE_UNHANDLED_COMPLAINTS, onUpdateUnhandledComplaints);
}

export default complaintsSaga;
