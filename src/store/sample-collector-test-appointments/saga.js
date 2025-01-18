import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_SAMPLE_COLLECTION_IN_PROCESS_LIST,
  GET_SAMPLE_COLLECTION_COMPLETED_LIST,
  UPDATE_SAMPLE_COLLECTION_STATUS,
} from "./actionTypes";

import {
  getSampleCollectionInProcessListSuccess,
  getSampleCollectionInProcessListFail,
  getSampleCollectionCompletedListSuccess,
  getSampleCollectionCompletedListFail,
  updateSampleCollectionStatusSuccess,
  updateSampleCollectionStatusFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getSampleCollectionInProcessList,
  getSampleCollectionCompletedList,
  updateSampleCollectionStatus,
} from "../../helpers/django_api_helper";

function* fetchSampleCollectionInProcessList(object) {
  try {
    const response = yield call(
      getSampleCollectionInProcessList,
      object.payload
    );
    yield put(getSampleCollectionInProcessListSuccess(response));
  } catch (error) {
    yield put(getSampleCollectionInProcessListFail(error));
  }
}

function* fetchSampleCollectionCompletedList(object) {
  try {
    const response = yield call(
      getSampleCollectionCompletedList,
      object.payload
    );
    yield put(getSampleCollectionCompletedListSuccess(response));
  } catch (error) {
    yield put(getSampleCollectionCompletedListFail(error));
  }
}

function* onUpdateSampleCollectionStatus({ payload: sampleCollectorData }) {
  try {
    const response = yield call(
      updateSampleCollectionStatus,
      sampleCollectorData
    );
    yield put(updateSampleCollectionStatusSuccess(response));
  } catch (error) {
    yield put(updateSampleCollectionStatusFail(error));
  }
}

function* SampleCollectorTestAppointmentsSaga() {
  yield takeEvery(
    GET_SAMPLE_COLLECTION_IN_PROCESS_LIST,
    fetchSampleCollectionInProcessList
  );
  yield takeEvery(
    GET_SAMPLE_COLLECTION_COMPLETED_LIST,
    fetchSampleCollectionCompletedList
  );
  yield takeEvery(
    UPDATE_SAMPLE_COLLECTION_STATUS,
    onUpdateSampleCollectionStatus
  );
}

export default SampleCollectorTestAppointmentsSaga;
